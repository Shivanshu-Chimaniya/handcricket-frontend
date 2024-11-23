import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import bat from "../assets/bat.png";
import "./HandCricket.css";
import Lefthand from "./Lefthand";
import Righthand from "./Righthand";
import HalfTimeModal from "./HalfTimeModal";
import ResultsModal from "./ResultsModal";
import GameHeader from "./GameHeader";
import ScoreBarPlayerDetails from "./ScoreBarPlayerDetails";
import StartingModal from "./StartingModal";

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
	const [startingGame, setStartingGame] = useState(false);

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
			await wait(900);
			setSwitchingInnings(true);
			setPlayer1Choice(-1);
			setPlayer2Choice(-1);
			setSelectedChoice(-1);
		});

		socket.on("start-second-inning", async ({game}) => {
			setBlockUpdates(false);
			setSwitchingInnings(false);
			setGame(game);
			setLast10Balls([]);
		});

		socket.on("gameover", async ({game, move1, move2}) => {
			setBlockUpdates(true);
			updateGame(game, move1, move2);
			setSelectedChoice(-1);
			setGame(game);
			await wait(900);
			setGameConcluded(true);
		});

		socket.on("updateGame", async ({game, move1, move2}) => {
			updateGame(game, move1, move2);
		});
		setStartingGame(true);
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

	const startFirstInning = async () => {
		setStartingGame(false);
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
		<div className="w-full">
			<GameHeader
				gamePhase={"HandCricket"}
				player1={gameCopy.players[0].playerName}
				player2={gameCopy.players[1].playerName}
				isLeader={isLeader}
				isFirstInnings={game.isFirstInnings}
				targetScore={game.targetScore}
				battingTurn={game.battingTurn}
			/>

			<div className="relative z-10 max-w-4xl mx-auto pt-32 sm:pt-32 ">
				<div className="flex justify-evenly items-center space-x-16 pb-20 sm:pb-12  sm:h-72 h-96">
					<Lefthand choice={player1Choice} />
					<Righthand choice={player2Choice} />
				</div>

				<div className="text-center mb-12">
					<div className="flex justify-center space-x-4">
						{choices.map((choice) => (
							<button
								key={choice}
								onClick={() => {
									handleNumberSelection(choice);
								}}
								disabled={selectedChoice !== -1}
								className={`px-3 py-1 sm:px-4 sm:py-2 z-10 text-xl sm:text-3xl rounded-md bg-black/30 backdrop-blur-sm text-white font-bold transition-all transform
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

			<ScoreBarPlayerDetails
				player1={{
					name: game.players[0].playerName,
					score: game.scores[0],
					ballsPlayed: game.spans[0],
				}}
				player2={{
					name: game.players[1].playerName,
					score: game.scores[1],
					ballsPlayed: game.spans[1],
				}}
				battingPlayer={game.battingTurn}
				currentInnings={game.isFirstInnings ? 0 : 1}
				runs={game.scores[game.battingTurn]}
				runsLeft={game.targetScore - game.scores[game.battingTurn]}
				lastFiveBalls={last10Balls}
			/>
			{startingGame && (
				<StartingModal
					timer={5}
					game={game}
					isLeader={isLeader}
					startFirstInning={startFirstInning}
				/>
			)}

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
