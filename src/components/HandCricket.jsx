import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import ball from "../assets/ball.png";
import bat from "../assets/bat.png";
import "./HandCricket.css";
import Lefthand from "./Lefthand";
import Righthand from "./Righthand";
import HalfTimeModal from "./HalfTimeModal";
import ResultsModal from "./ResultsModal";

const HandCricket = ({getRoomCode, socket}) => {
	const [players, setPlayers] = useState([
		{socketId: 1, name: "Player 1"},
		{socketId: 2, name: "Player 2"},
	]);
	const [gameCopy, setGameCopy] = useState({
		targetScore: -1,
		battingTurn: -1,
		isFirstInnings: null,
		scores: [0, 0],
		firstInning: [],
		secondInning: [],
		spans: [0, 0],
	});
	const [isPlayer1, setIsPlayer1] = useState(false);

	const [player1Choice, setPlayer1Choice] = useState(-1);
	const [player2Choice, setPlayer2Choice] = useState(-1);
	const [selectedChoice, setSelectedChoice] = useState(-1);

	const [last10Balls, setLast10Balls] = useState([]);

	const [gameConcluded, setGameConcluded] = useState(false);

	const [blockUpdates, setBlockUpdates] = useState(false);
	const [switchingInnings, setSwitchingInnings] = useState(false);

	const navigate = useNavigate();

	let URL = import.meta.env.VITE_BACKENDURL;
	const choices = [1, 2, 3, 4, 5, 6];

	function wait(ms) {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}

	useEffect(() => {
		if (getRoomCode() == "") {
			navigate("/");
			return;
		}
		if (socket == null) {
			navigate("/");
			return;
		}
		let fetchGame = async () => {
			const res = await fetch(URL + "/api/game/" + getRoomCode(), {
				headers: {
					"Content-Type": "application/json",
				},
			});
			let game = await res.json();
			setPlayers(game.players);
			setIsPlayer1(game.leader === socket.id);
			console.log(game.tossWinner, game.battingTurn);

			setGameCopy((prev) => ({
				...prev,
				scores: game.scores,
				firstInning: game.firstInning,
				secondInning: game.secondInning,
				spans: game.spans,
				targetScore: game.targetScore,
				battingTurn: game.battingTurn,
				isFirstInnings: true,
			}));
		};
		fetchGame();

		socket.on("game_aborted", () => {
			if (gameConcluded) return;
			alert("you won, he left!!");
			navigate("/");
			return;
		});

		socket.on("out", async ({game, move1, move2}) => {
			console.log(game);

			await updateGame(game, move1, move2);

			setBlockUpdates(true);
			await wait(1000);
			setSwitchingInnings(true);
		});

		socket.on("start-second-inning", async ({game}) => {
			setSwitchingInnings(false);
			console.log("start second inning..");
			if (!game) {
				navigate("/");
				return;
			}

			setPlayer1Choice(-1);
			setPlayer2Choice(-1);
			setSelectedChoice(-1);

			setGameCopy((prev) => ({
				...prev,
				scores: game.scores,
				firstInning: game.firstInning,
				secondInning: game.secondInning,
				spans: game.spans,
				targetScore: game.targetScore,
				battingTurn: game.battingTurn,
				isFirstInnings: false,
			}));

			setBlockUpdates(false);
			setLast10Balls([]);
			console.log(gameCopy);
		});

		socket.on("gameover", async ({game, move1, move2}) => {
			console.log(game);

			await updateGame(game, move1, move2);
			setBlockUpdates(true);

			await wait(1000);

			setPlayer1Choice(-1);
			setPlayer2Choice(-1);
			setSelectedChoice(-1);
			setGameCopy((prev) => ({
				...prev,
				gameWinner: game.gameWinner,
			}));
			setGameConcluded(true);
		});

		socket.on("updateGame", async ({game, move1, move2}) => {
			if (gameConcluded || blockUpdates) return;

			await updateGame(game, move1, move2);
		});
	}, []);

	const updateGame = async (game, move1, move2) => {
		setPlayer1Choice(-1);
		setPlayer2Choice(-1);
		await wait(200);
		setGameCopy((prev) => ({
			...prev,
			scores: game.scores,
			firstInning: game.firstInning,
			secondInning: game.secondInning,
			spans: game.spans,
		}));

		let inning = game.firstInning;
		if (!game.isFirstInnings && game.secondInning.length > 0) {
			inning = game.secondInning;
		}
		let newLast10Balls = [];
		let start = inning.length - 5; // length of displaying previous balls
		for (let i = start < 0 ? 0 : start; i < inning.length; i++) {
			newLast10Balls.push({
				index: i,
				player1: inning[i].player1,
				player2: inning[i].player2,
			});
		}

		setPlayer1Choice(move1);
		setPlayer2Choice(move2);
		setLast10Balls(newLast10Balls);
		setTimeout(setSelectedChoice(-1), 300);
	};

	const switchedInning = async () => {
		socket.emit("has-seen-results", {roomCode: getRoomCode()});
	};

	const getHandEmoji = (choice) => {
		switch (choice) {
			case 1:
				return 1;
			case 2:
				return 2;
			case 3:
				return 3;
			case 4:
				return 4;
			case 5:
				return 5;
			case 6:
				return 6;
			default:
				return 0;
		}
	};

	const handleNumberSelection = (newChoice) => {
		if (gameConcluded || blockUpdates) return;
		if (socket == null) {
			navigate("/");
			return;
		}
		if (selectedChoice === -1) {
			setSelectedChoice(newChoice);
			socket.emit("playerMove", {
				roomCode: getRoomCode(),
				move: newChoice,
			});
		}
	};

	return (
		<div className="relative grow my-6">
			<div
				style={{maxWidth: "100vw"}}
				className="relative z-10 flex justify-between items-center  pt-20 sm:pt-4">
				<div
					className={`py-4 pe-6 ps-0 rounded-r-md ${
						isPlayer1 ? "bg-blue-500" : "bg-rose-600"
					} backdrop-blur-sm text-white font-bold`}>
					<span className="ps-4 pe-2">{players[0].name}</span>
					<img
						className="BattingBallingSymbol"
						src={gameCopy.battingTurn == 0 ? bat : ball}
						alt={gameCopy.battingTurn == 0 ? "Batting" : "Balling"}
					/>
				</div>
				{!gameCopy.isFirstInnings ? (
					<div>
						<p className="ps-4 pe-2 py-1 text-xl font-extrabold">
							Inning&nbsp;2 Target&nbsp;{gameCopy.targetScore}
						</p>
					</div>
				) : (
					<div>
						<p className="ps-4 pe-2 py-1 text-xl font-extrabold">
							Inning 1
						</p>
					</div>
				)}
				<div
					className={`py-4 ps-6 pe-0 rounded-l-md ${
						isPlayer1 ? "bg-rose-600" : "bg-blue-500"
					} backdrop-blur-sm text-white font-bold`}>
					<img
						className="BattingBallingSymbol"
						src={gameCopy.battingTurn == 1 ? bat : ball}
						alt={gameCopy.battingTurn == 1 ? "Batting" : "Balling"}
					/>
					<span className="ps-2 pe-4">{players[1].name}</span>
				</div>
			</div>

			<div className="relative z-10 max-w-4xl mx-auto pt-8 ">
				<div className="flex justify-center items-center space-x-4 sm:space-x-40 mb-6 h-80">
					<Lefthand choice={player1Choice} />
					<Righthand choice={player2Choice} />
				</div>

				<div className="text-center mb-12">
					<div className="flex flex-wrap justify-center space-x-4">
						{choices.map((choice) => (
							<button
								key={choice}
								onClick={() => {
									handleNumberSelection(choice);
								}}
								disabled={selectedChoice !== -1}
								className={`px-4 py-2 z-10 text-3xl rounded-md bg-black/30 backdrop-blur-sm text-white font-bold transition-all transform
                    ${
						selectedChoice === choice
							? "bg-green-500 scale-110"
							: "hover:bg-black/50 hover:scale-105"
					} 
                    ${
						selectedChoice && selectedChoice !== choice
							? "opacity-90"
							: ""
					}
                  `}>
								{getHandEmoji(choice)}
							</button>
						))}
					</div>
				</div>
			</div>

			<div className="relative z-10 w-full flex justify-between items-center bg-white/40 backdrop-blur-sm border-y-8 border-white/20 h-20">
				<div className="ps-2 grow text-gray-800 font-bold flex">
					<p>
						{gameCopy.battingTurn == 0 && (
							<img
								className="BattingBallingSymbol2"
								src={bat}
								alt="*"
							/>
						)}
						<br />
						{gameCopy.battingTurn == 1 && (
							<img
								className="BattingBallingSymbol2"
								src={bat}
								alt="*"
							/>
						)}
					</p>
					<p className="px-2">
						{players[0].name} <br />
						{players[1].name}
					</p>
					<p className="px-2">
						{gameCopy.scores[0]} <br /> {gameCopy.scores[1]}
					</p>
					<p className="px-2 font-semibold ">
						{gameCopy.spans[0]} <br /> {gameCopy.spans[1]}
					</p>
				</div>
				<div
					className="grow-0"
					style={{
						position: "absolute",
						top: "50%",
						left: "50%",
						background: "red",
					}}>
					<div
						className="bg-red-600/100 backdrop-blur-sm border-4 border-white/20"
						style={{
							position: "absolute",
							width: "100px",
							aspectRatio: "1/1",
							transform: "translate(-50%, -50%) rotate(45deg)",
							borderRadius: "1rem",
						}}></div>
					<p
						style={{
							position: "absolute",
							transform: "translate(-50%, -50%)",
							top: "50%",
							left: "50%",
							textAlign: "center",
							color: "white",
							fontWeight: "600",
						}}>
						{gameCopy.isFirstInnings ? (
							<>
								<span style={{fontSize: "0.75rem"}}>
									Runs&nbsp;Scored
								</span>
								<p style={{fontSize: "1.25rem"}}>
									{gameCopy.scores[gameCopy.battingTurn]}
								</p>
							</>
						) : (
							<>
								<span style={{fontSize: "0.75rem"}}>
									Runs&nbsp;left
								</span>
								<p style={{fontSize: "1.25rem"}}>
									{gameCopy.scores[gameCopy.battingTurn] <
									gameCopy.targetScore
										? gameCopy.targetScore -
										  gameCopy.scores[gameCopy.battingTurn]
										: 0}
								</p>
							</>
						)}
					</p>
				</div>
				<div className="py-1  pe-3 grow text-gray-800 font-bold flex flex-row-reverse">
					{last10Balls.length > 0 &&
						last10Balls.map((el, index) => (
							<p key={index} className="ps-1 gap-1 flex flex-col">
								<span className="Balls">{el.player1}</span>
								<span className="Balls">{el.player2}</span>
							</p>
						))}
				</div>
			</div>
			{switchingInnings && (
				<HalfTimeModal
					timer={5}
					game={gameCopy}
					players={players}
					isPlayer1={isPlayer1}
					switchedInning={switchedInning}
				/>
			)}
			{gameConcluded && (
				<ResultsModal
					players={players}
					game={gameCopy}
					isPlayer1={isPlayer1}
				/>
			)}
		</div>
	);
};

export default HandCricket;
