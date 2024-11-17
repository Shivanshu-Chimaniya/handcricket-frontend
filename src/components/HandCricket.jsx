import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import ball from "../assets/ball.png";
import bat from "../assets/bat.png";
import "./HandCricket.css";
import Lefthand from "./Lefthand";
import Righthand from "./Righthand";

const Modal = ({isOpen, onClose, title, children, navigate}) => {
	if (!isOpen) return null;

	return (
		<div className="z-50 fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
			<div className="bg-white rounded-lg p-6 max-w-lg w-full m-4">
				<div className="flex justify-between items-center mb-4">
					<h2 className="text-2xl font-bold">{title}</h2>
					<button
						onClick={() => {
							onClose();
							navigate("/");
						}}
						className="text-gray-500 hover:text-gray-700">
						<b>X</b>
					</button>
				</div>
				{children}
			</div>
		</div>
	);
};

const ResultModal = ({isOpen, onClose, navigate, results}) => (
	<Modal isOpen={isOpen} onClose={onClose} navigate={navigate} title="Result">
		{results.winnerId == -1 && results.loserId == -1 ? (
			<div className="space-y-4">
				<div className="flex items-center space-x-4 p-2 bg-gray-50 rounded">
					<div className="flex-grow">
						<div className="font-semibold">
							{results.players[results.winnerId].name} Drew
						</div>
						<div className="text-sm text-gray-500">
							{results.scores[results.winnerId]} runs ·{" "}
							{results.spans[results.winnerId]} balls
						</div>
					</div>
				</div>
				<div className="flex items-center space-x-4 p-2 bg-gray-50 rounded">
					<div className="flex-grow">
						<div className="font-semibold">
							{results.players[results.loserId].name} Drew
						</div>
						<div className="text-sm text-gray-500">
							{results.scores[results.loserId]} runs ·{" "}
							{results.spans[results.loserId]} balls
						</div>
					</div>
				</div>
			</div>
		) : (
			<div className="space-y-4">
				<div className="flex items-center space-x-4 p-2 bg-gray-50 rounded">
					<div className="flex-grow">
						<div className="font-semibold">
							{results.players[results.winnerId].name} Won
						</div>
						<div className="text-sm text-gray-500">
							{results.scores[results.winnerId]} runs ·{" "}
							{results.spans[results.winnerId]} balls
						</div>
					</div>
				</div>
				<div className="flex items-center space-x-4 p-2 bg-gray-50 rounded">
					<div className="flex-grow">
						<div className="font-semibold">
							{results.players[results.loserId].name} Lost
						</div>
						<div className="text-sm text-gray-500">
							{results.scores[results.loserId]} runs ·{" "}
							{results.spans[results.loserId]} balls
						</div>
					</div>
				</div>
			</div>
		)}
	</Modal>
);

const HandCricket = ({getRoomCode, socket}) => {
	const [players, setPlayers] = useState([
		{socketId: 1, name: "Player 1"},
		{socketId: 2, name: "Player 2"},
	]);
	const [isLeader, setIsLeader] = useState(true);

	const [player1Choice, setPlayer1Choice] = useState(-1);
	const [player2Choice, setPlayer2Choice] = useState(-1);
	const [selectedChoice, setSelectedChoice] = useState(-1);

	const [targetScore, setTargetScore] = useState(0);
	const [battingTurn, setBattingTurn] = useState(-1);
	const [isBatting, setIsBatting] = useState(false);
	const [isFirstInning, setIsFirstInning] = useState(true);

	const [score, setScore] = useState([0, 0]);
	const [last10Balls, setLast10Balls] = useState([]);
	const [spans, setSpans] = useState([0, 0]);

	const [gameConcluded, setGameConcluded] = useState(false);
	const [results, setResults] = useState({
		winnerId: 1,
		loserId: 0,
		scores: [0, 0],
		players: [{name: "player 1"}, {name: "player 2"}],
		spans: [0, 0],
	});

	const [blockUpdates, setBlockUpdates] = useState(false);

	const navigate = useNavigate();

	let url = "http://localhost:3000";
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
			const res = await fetch(url + "/api/game/" + getRoomCode(), {
				headers: {
					"Content-Type": "application/json",
				},
			});
			let json = await res.json();
			setPlayers(json.game.players);
			setIsLeader(json.game.leader === socket.id);
			setIsBatting(
				json.game.players[json.game.battingTurn].socketId == socket.id
			);
			setBattingTurn(json.game.battingTurn);
		};
		fetchGame();

		socket.on("game_aborted", () => {
			navigate("/");
			return;
			// alert("you won, he left!!");
		});

		socket.on("resetMoves", () => {
			if (gameConcluded) return;
			setPlayer1Choice(-1);
			setPlayer2Choice(-1);
		});
		socket.on("out", async ({game, move1, move2}) => {
			if (gameConcluded) return;

			updateGame(move1, move2, game.scores, game.spans);
			let inning = game.firstInning;
			if (!isFirstInning) {
				inning = game.secondInning;
			}
			updateGame2(inning);

			setBlockUpdates(true);
			await wait(1000);
			alert("batsmen out");
			setIsBatting((prev) => !prev);
			setBattingTurn((battingTurn) => (battingTurn == 0 ? 1 : 0));
			setIsFirstInning(false);
			setTargetScore(game.targetScore);
			setBlockUpdates(false);
			setLast10Balls([]);
			setPlayer1Choice(-1);
			setPlayer2Choice(-1);
			console.log("batsmen out");
		});

		socket.on("updateGame", async ({game, move1, move2}) => {
			if (gameConcluded || blockUpdates) return;

			updateGame(move1, move2, game.scores, game.spans);

			let inning = game.firstInning;
			if (!game.isFirstInnings) {
				inning = game.secondInning;
			}

			updateGame2(inning);
		});

		socket.on("gameover", async ({result, game, move1, move2}) => {
			updateGame(move1, move2, game.scores, game.spans);
			let inning = game.firstInning;
			if (!game.isFirstInnings) {
				inning = game.secondInning;
			}
			updateGame2(inning);
			await wait(1000);
			alert("result :", result);
			let winnerId = -1,
				loserId = -1;
			if (result === "chased") {
				winnerId = game.battingTurn;
				loserId = (game.battingTurn + 1) % 2;
			} else if (result === "allout") {
				winnerId = (game.battingTurn + 1) % 2;
				loserId = game.battingTurn;
			} else {
				console.log("What is Game Result", result);
			}
			let players = game.players;
			let scores = game.scores;
			let spans = game.spans;

			setResults({winnerId, loserId, players, scores, spans});
			setGameConcluded(true);
		});
	}, []);

	const updateGame = (move1, move2, scores, spans) => {
		setPlayer1Choice(move1);
		setPlayer2Choice(move2);
		setScore(scores);
		setSpans(spans);
		setSelectedChoice(-1);
	};
	const updateGame2 = (inning) => {
		console.log(inning);
		let newLast10Balls = [];
		let start = inning.length - 5;
		for (let i = start < 0 ? 0 : start; i < inning.length; i++) {
			newLast10Balls.push({
				index: i,
				player1: inning[i].player1,
				player2: inning[i].player2,
			});
		}
		setLast10Balls(newLast10Balls);
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
			<ResultModal
				isOpen={gameConcluded}
				onClose={() => setGameConcluded(false)}
				navigate={navigate}
				results={results}
			/>

			<div className="relative z-10 w-full flex justify-between items-center">
				<div className="py-4 pe-6 ps-0 rounded-r-md bg-black/30 backdrop-blur-sm text-white font-bold">
					<span className="ps-4 pe-2">{players[0].name}</span>
					<img
						className="BattingBallingSymbol"
						src={battingTurn == 0 ? bat : ball}
						alt={battingTurn == 0 ? "Batting" : "Balling"}
					/>
				</div>
				{!isFirstInning ? (
					<div>
						<p className="ps-4 pe-2 py-1 text-xl font-extrabold">
							Inning 2, Target : {score[0]}
						</p>
					</div>
				) : (
					<div>
						<p className="ps-4 pe-2 py-1 text-xl font-extrabold">
							Inning 1
						</p>
					</div>
				)}
				<div className="py-4 ps-6 pe-0 rounded-l-md bg-black/30 backdrop-blur-sm text-white font-bold">
					<img
						className="BattingBallingSymbol"
						src={battingTurn == 1 ? bat : ball}
						alt={battingTurn == 1 ? "Batting" : "Balling"}
					/>
					<span className="ps-2 pe-4">{players[1].name}</span>
				</div>
			</div>

			<div className="relative z-10 max-w-4xl mx-auto pt-8 px-4 sm:px-0">
				<div className="flex justify-center items-center space-x-16 mb-12">
					<Lefthand choice={player1Choice} />
					<Righthand choice={player2Choice} />
				</div>

				<div className="text-center mb-6">
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

			<div className="relative z-10 w-full flex justify-between items-center bg-white/80 backdrop-blur-sm">
				<div className="py-3 grow text-gray-800 font-bold ">
					<p className="ps-4 pe-2 py-1">
						{players[0].name}
						{"    "}
						{score[0]}
						{"    "}
						<span className="font-semibold">{spans[0]}</span>
					</p>
					<p className="ps-4 pe-2 py-1">
						{players[1].name}
						{"    "}
						{score[1]}
						{"    "}
						<span className="font-semibold">{spans[1]}</span>
					</p>
				</div>
				<div className="scoreCard"></div>
				<div className="py-3 grow text-gray-800 font-bold text-end">
					<p className="ps-2 pe-4 py-1">
						{last10Balls.length == 0 ? (
							<></>
						) : (
							<>
								Player 1:
								{last10Balls.map((el) => (
									<span key={el.index} className="Balls">
										{el.player1}
									</span>
								))}
							</>
						)}
					</p>
					<p className="ps-2 pe-4 py-1">
						{last10Balls.length == 0 ? (
							<></>
						) : (
							<>
								Player 2:
								{last10Balls.map((el) => (
									<span key={el.index} className="Balls">
										{el.player2}
									</span>
								))}
							</>
						)}
					</p>
				</div>
			</div>
		</div>
	);
};

export default HandCricket;
