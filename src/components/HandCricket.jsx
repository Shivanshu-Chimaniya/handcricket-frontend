import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import ball from "../assets/ball.png";
import bat from "../assets/bat.png";
import "./HandCricket.css";
import Lefthand from "./Lefthand";
import Righthand from "./Righthand";
import HalfTimeModal from "./HalfTimeModal";
import ResultsModal from "./ResultsModal";

const HandCricket = ({getRoomCode, socket, gameCopy}) => {
	const [game, setGame] = useState(gameCopy);
	const [isLeader, setIsLeader] = useState(false);

	const [player1Choice, setPlayer1Choice] = useState(-1);
	const [player2Choice, setPlayer2Choice] = useState(-1);
	const [selectedChoice, setSelectedChoice] = useState(-1);

	const [last10Balls, setLast10Balls] = useState([]);

	const [gameConcluded, setGameConcluded] = useState(false);

	const [blockUpdates, setBlockUpdates] = useState(false);
	const [switchingInnings, setSwitchingInnings] = useState(false);

	const navigate = useNavigate();

	const choices = [1, 2, 3, 4, 5, 6];

	function wait(ms) {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}

	useEffect(() => {
		setIsLeader(gameCopy.leader.socketId == socket.id);

		socket.on("out", async ({game, move1, move2}) => {
			updateGame(game, move1, move2);
			setBlockUpdates(true);
			await wait(400);
			setSwitchingInnings(true);
		});

		socket.on("start-second-inning", async ({game}) => {
			setBlockUpdates(false);
			setSwitchingInnings(false);
			console.log("halfinr req");
			setPlayer1Choice(-1);
			setPlayer2Choice(-1);
			setSelectedChoice(-1);
			setGame(game);
			setLast10Balls([]);
		});

		socket.on("gameover", async ({game, move1, move2}) => {
			console.log(game);

			setBlockUpdates(true);
			updateGame(game, move1, move2);
			setPlayer1Choice(-1);
			setPlayer2Choice(-1);
			setSelectedChoice(-1);
			setGame(game);
			await wait(400);
			setGameConcluded(true);
		});

		socket.on("updateGame", async ({game, move1, move2}) => {
			if (gameConcluded || blockUpdates) return;

			await updateGame(game, move1, move2);
		});
	}, []);

	const updateGame = async (game, move1, move2) => {
		setGame(game);

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

		setPlayer1Choice((prevChoice) =>
			getFingers({prevChoice, newChoice: move1})
		);
		setPlayer2Choice((prevChoice) =>
			getFingers({prevChoice, newChoice: move2})
		);
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

	const getFingers = ({prevChoice, newChoice}) => {
		let thisChoice = newChoice;

		if (thisChoice == prevChoice) {
			thisChoice += 7;
		}

		return thisChoice;
	};

	const handleNumberSelection = (newChoice) => {
		if (gameConcluded || blockUpdates) return;

		if (selectedChoice === -1) {
			setSelectedChoice(newChoice);
			socket.emit("playerMove", {
				roomCode: getRoomCode(),
				move: newChoice,
			});
		}
	};

	const handleRematchButtonClick = () => {
		alert("abhi nahi");
	};

	const handleHomeButtonClick = () => {
		navigate("/");
	};

	return (
		<div className="relative grow my-6">
			<div
				style={{maxWidth: "100vw"}}
				className="relative z-10 flex justify-between items-center  pt-20 sm:pt-4">
				<div
					className={`py-4 pe-6 ps-0 rounded-r-md ${
						isLeader ? "bg-blue-500" : "bg-rose-600"
					} backdrop-blur-sm text-white font-bold`}>
					<span className="ps-4 pe-2">
						{game.players[0].playerName}
					</span>
					<img
						className="BattingBallingSymbol"
						src={game.battingTurn == 0 ? bat : ball}
						alt={game.battingTurn == 0 ? "Batting" : "Balling"}
					/>
				</div>
				{!game.isFirstInnings ? (
					<div>
						<p className="ps-4 pe-2 py-1 text-xl font-extrabold">
							Inning&nbsp;2 Target&nbsp;{game.targetScore}
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
						isLeader ? "bg-rose-600" : "bg-blue-500"
					} backdrop-blur-sm text-white font-bold`}>
					<img
						className="BattingBallingSymbol"
						src={game.battingTurn == 1 ? bat : ball}
						alt={game.battingTurn == 1 ? "Batting" : "Balling"}
					/>
					<span className="ps-2 pe-4">
						{game.players[1].playerName}
					</span>
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
						{game.battingTurn == 0 && (
							<img
								className="BattingBallingSymbol2"
								src={bat}
								alt="*"
							/>
						)}
						<br />
						{game.battingTurn == 1 && (
							<img
								className="BattingBallingSymbol2"
								src={bat}
								alt="*"
							/>
						)}
					</p>
					<p className="px-2">
						{game.players[0].playerName} <br />
						{game.players[1].playerName}
					</p>
					<p className="px-2">
						{game.scores[0]} <br /> {game.scores[1]}
					</p>
					<p className="px-2 font-semibold ">
						{game.spans[0]} <br /> {game.spans[1]}
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
					<div
						style={{
							position: "absolute",
							transform: "translate(-50%, -50%)",
							top: "50%",
							left: "50%",
							textAlign: "center",
							color: "white",
							fontWeight: "600",
						}}>
						{game.isFirstInnings ? (
							<>
								<span style={{fontSize: "0.75rem"}}>
									Runs&nbsp;Scored
								</span>
								<div style={{fontSize: "1.25rem"}}>
									{game.scores[game.battingTurn]}
								</div>
							</>
						) : (
							<>
								<span style={{fontSize: "0.75rem"}}>
									Runs&nbsp;left
								</span>
								<div style={{fontSize: "1.25rem"}}>
									{game.scores[game.battingTurn] <
									game.targetScore
										? game.targetScore -
										  game.scores[game.battingTurn]
										: 0}
								</div>
							</>
						)}
					</div>
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
					timer={10}
					game={game}
					isLeader={isLeader}
					switchedInning={switchedInning}
				/>
			)}
			{gameConcluded && (
				<ResultsModal
					game={game}
					isLeader={isLeader}
					handleRematchButtonClick={handleRematchButtonClick}
					handleHomeButtonClick={handleHomeButtonClick}
				/>
			)}
		</div>
	);
};

export default HandCricket;
