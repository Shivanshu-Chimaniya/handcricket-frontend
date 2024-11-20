import React, {useState, useEffect} from "react";
import {Trophy} from "lucide-react";
import {useNavigate} from "react-router-dom";
import Lefthand from "./Lefthand";
import Righthand from "./Righthand";

const TossingStage = ({getRoomCode, socket}) => {
	const [players, setPlayers] = useState([
		{socketId: 1, name: "Player 1"},
		{socketId: 2, name: "Player 2"},
	]);
	const [isPlayer1, setIsPlayer1] = useState(true);

	const [player1Choice, setPlayer1Choice] = useState(-1);
	const [player2Choice, setPlayer2Choice] = useState(-1);
	const [selectedChoice, setSelectedChoice] = useState(null);

	const [showResult, setShowResult] = useState(false);
	const [winner, setWinner] = useState(-1);
	const [displayChoice, setDisplayChoice] = useState(false);
	const [winnerFound, setWinnerFound] = useState(false);
	const [timer, setTimer] = useState(10);
	const [wantsBatting, setWantsBatting] = useState(null);

	const navigate = useNavigate();

	let URL = import.meta.env.VITE_BACKENDURL;
	const choices = ["rock", "paper", "scissors"];

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
		};
		fetchGame();

		socket.on("game_aborted", () => {
			alert("player disconnected!!");
			return;
		});

		socket.on("resetToss", () => {
			if (selectedChoice == null) {
				setPlayer1Choice(-1);
				setPlayer2Choice(-1);
			}
		});

		socket.on("tossWinner", async ({winner, p1choice, p2choice}) => {
			setShowResult(true);
			setWinnerFound(true);
			setWinner(winner.name);
			if (socket.id === winner.socketId) {
				setDisplayChoice(true);
			}
			setPlayer1Choice(getFingers(p1choice));
			setPlayer2Choice(getFingers(p2choice));

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

		socket.on("tossDraw", async ({winner, p1choice, p2choice}) => {
			setShowResult(true);
			setPlayer1Choice(getFingers(p1choice));
			setPlayer2Choice(getFingers(p2choice));
			setTimeout(() => {
				setSelectedChoice(null);
			}, 1000);
		});
	}, []);

	const getFingers = (choice) => {
		switch (choice) {
			case "rock":
				return 0;
			case "paper":
				return 5;
			case "scissors":
				return 2;
			default:
				return 6;
		}
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
		if (socket == null) {
			navigate("/");
			return;
		}
		if (selectedChoice === null) {
			setSelectedChoice(newChoice);
			socket.emit("playerTossMove", {
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
		<div className="relative grow my-6">
			<div
				style={{maxWidth: "100vw"}}
				className="relative z-10  flex justify-between items-center pt-20 sm:pt-4">
				<div
					className={`py-4 pe-6 ps-0 rounded-r-md ${
						isPlayer1 ? "bg-blue-500" : "bg-rose-600"
					} backdrop-blur-sm text-white font-bold`}>
					<span className="ps-4">{players[0].name}</span>
				</div>
				<div>
					<p className="ps-4 pe-2 py-1 text-xl font-extrabold">
						Tossing
					</p>
				</div>

				<div
					className={`py-4 ps-6 pe-0 rounded-l-md ${
						isPlayer1 ? "bg-rose-600" : "bg-blue-500"
					} backdrop-blur-sm text-white font-bold`}>
					<span className="pe-4">{players[1].name}</span>
				</div>
			</div>

			<div className="relative z-10 max-w-4xl mx-auto pt-8  pt-20 sm:pt-12">
				<div className="flex justify-center items-center space-x-16 mb-12 h-80 ">
					<Lefthand choice={player1Choice} />
					<Righthand choice={player2Choice} />
				</div>

				{!showResult || (showResult && !winnerFound) ? (
					<div className="text-center">
						<h2 className="text-gray-800 font-extrabold text-2xl mb-6">
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
								<div className="space-y-6">
									<div className="flex items-center justify-center space-x-3">
										<Trophy className="text-yellow-400 font-extrabold w-8 h-8 mb-6" />
										<h2 className="text-gray-800 font-bold text-2xl mb-6">
											{winner} Wins the Toss!
										</h2>
									</div>

									<div className="space-y-4">
										{displayChoice ? (
											<>
												<h3 className="text-gray-800 font-bold text-2xl mb-6">
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
												<h3 className="text-gray-800 font-bold text-2xl mb-6">
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
