import React, {useState, useEffect} from "react";
import {Trophy} from "lucide-react";
import {useNavigate} from "react-router-dom";
import Lefthand from "./Lefthand";
import Righthand from "./Righthand";
import GameHeader from "./GameHeader";
import "./Tossing.css";

const TossingStage = ({getRoomCode, socket, gameCopy}) => {
	const [isLeader, setIsLeader] = useState(true);
	const [game, setGame] = useState(gameCopy);

	const [player1Choice, setPlayer1Choice] = useState(-1);
	const [player2Choice, setPlayer2Choice] = useState(-1);
	const [selectedChoice, setSelectedChoice] = useState(null);
	// rock paper scissors
	const [showResult, setShowResult] = useState(false);
	const [tossWinner, setTossWinner] = useState("");
	const [winnerFound, setWinnerFound] = useState(false);

	// batting or bowling
	const [displayChoice, setDisplayChoice] = useState(false);
	const [timer, setTimer] = useState(10);
	const [wantsBatting, setWantsBatting] = useState(null);

	const navigate = useNavigate();

	const choices = ["rock", "paper", "scissors"];

	function wait(ms) {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}

	useEffect(() => {
		setIsLeader(gameCopy.leader.socketId == socket.id);

		socket.on("TossWinner", async ({winner, p1choice, p2choice}) => {
			setShowResult(true);
			setWinnerFound(true);
			setTossWinner(winner.playerName);
			if (socket.id === winner.socketId) {
				setDisplayChoice(true);
			}

			setPlayer1Choice((prevChoice) =>
				getFingers({prevChoice, newChoice: p1choice})
			);
			setPlayer2Choice((prevChoice) =>
				getFingers({prevChoice, newChoice: p2choice})
			);

			let fn = async () => {
				setTimer(10);
				await wait(1000);
				setTimer(9);
				await wait(1000);
				setTimer(8);
				await wait(1000);
				setTimer(7);
				await wait(1000);
				setTimer(6);
				await wait(1000);
				setTimer(5);
				await wait(1000);
				setTimer(4);
				await wait(1000);
				setTimer(3);
				await wait(1000);
				setTimer(2);
				await wait(1000);
				setTimer(1);
				await wait(1000);

				if (socket.id === winner.socketId) {
					if (wantsBatting === null) {
						handleWantsBatting(false);
					}
				}
			};
			fn();
		});

		socket.on("TossDraw", async ({winner, p1choice, p2choice}) => {
			setShowResult(true);
			setPlayer1Choice((prevChoice) =>
				getFingers({prevChoice, newChoice: p1choice})
			);
			setPlayer2Choice((prevChoice) =>
				getFingers({prevChoice, newChoice: p2choice})
			);

			setTimeout(() => {
				setSelectedChoice(null);
			}, 500);
		});
	}, []);

	const getFingers = ({prevChoice, newChoice}) => {
		let thisChoice = 6;

		if (newChoice === "rock") thisChoice = 0;
		if (newChoice === "paper") thisChoice = 5;
		if (newChoice === "scissors") thisChoice = 2;

		if (thisChoice == prevChoice) {
			thisChoice += 7;
		}

		return thisChoice;
	};

	const getHandEmoji = (choice) => {
		switch (choice) {
			case "rock":
				return "✊";
			case "paper":
				return "✋";
			case "scissors":
				return "✌️";
			default:
				return "🤚";
		}
	};

	const handleTossSelection = (newChoice) => {
		if (selectedChoice === null) {
			setSelectedChoice(newChoice);
			socket.emit("player-toss-move", {
				roomCode: getRoomCode(),
				choice: newChoice,
			});
		}
	};
	const handleWantsBatting = async (newChoice) => {
		if (wantsBatting === null) {
			setWantsBatting(newChoice); // Update state
			socket.emit("player-wants-to", {
				roomCode: getRoomCode(),
				choice: newChoice,
			});
		} else {
			console.log("Already sent a request; ignoring further clicks.");
		}
	};

	return (
		<div className="w-full">
			<GameHeader
				gamePhase={"Tossing"}
				player1={gameCopy.players[0].playerName}
				player2={gameCopy.players[1].playerName}
				isLeader={isLeader}
				isFirstInnings={-1}
				targetScore={-1}
				battingTurn={-1}
			/>

			<div className="relative z-10 max-w-4xl mx-auto pt-32 sm:pt-32">
				<div className="flex justify-center items-center space-x-16 pb-20 sm:pb-12  sm:h-72 h-96">
					<Lefthand choice={player1Choice} />
					<Righthand choice={player2Choice} />
				</div>

				{!showResult || (showResult && !winnerFound) ? (
					<div className="text-center">
						<h2 className="text-gray-800 font-extrabold text-xl mb-6">
							{showResult
								? "It's a Tie! Make Your Choice!"
								: "Make Your Choice!"}
						</h2>
						<div className="flex justify-center space-x-4">
							{choices.map((choice) => (
								<button
									key={choice}
									onClick={() => {
										handleTossSelection(choice);
									}}
									disabled={selectedChoice !== null}
									className={`p-6 rounded-xl text-4xl transition-all transform bg-black/30 backdrop-blur-sm text-white font-bold
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
				) : (
					<div className="text-center">
						<div
							className={`transform transition-all duration-500 ${
								showResult
									? "translate-y-0 opacity-100"
									: "translate-y-8 opacity-0"
							}`}>
							{winnerFound && (
								<div className="py-12 bg-black/30 backdrop-blur-sm rounded-lg">
									<div className="flex items-center justify-center space-x-3">
										<Trophy className="text-yellow-400 font-extrabold w-8 h-8 " />
										<h2 className="text-white font-bold text-xl sm:text-2xl">
											{tossWinner} Wins the Toss!
										</h2>
									</div>

									<div className="space-y-4">
										{displayChoice ? (
											<>
												<h3 className="text-white font-bold pt-1 text-sm sm:text-xl mb-3">
													Choose Your Side, default
													balling ({timer}s)
												</h3>
												<div className="flex justify-center space-x-4">
													<button
														onClick={() =>
															handleWantsBatting(
																true
															)
														}
														className={`bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transform hover:scale-105 transition-all font-bold
													${wantsBatting == true && "bg-blue-600 scale-105"}`}>
														Batting
													</button>
													<button
														onClick={() =>
															handleWantsBatting(
																false
															)
														}
														className={`bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg transform hover:scale-105 transition-all font-bold ${
															wantsBatting ==
																false &&
															"bg-red-600 scale-105"
														}`}>
														Bowling
													</button>
												</div>
											</>
										) : (
											<>
												<h3 className="text-white font-bold text-2xl my-6">
													They are choosing ({timer}s
													left)
												</h3>
											</>
										)}
									</div>
								</div>
							)}
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default TossingStage;
