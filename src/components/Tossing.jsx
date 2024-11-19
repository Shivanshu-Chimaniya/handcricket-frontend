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
	const [isLeader, setIsLeader] = useState(true);

	const [player1Choice, setPlayer1Choice] = useState(-1);
	const [player2Choice, setPlayer2Choice] = useState(-1);
	const [selectedChoice, setSelectedChoice] = useState(null);

	const [showResult, setShowResult] = useState(false);
	const [winner, setWinner] = useState(-1);
	const [displayChoice, setDisplayChoice] = useState(false);
	const [winnerFound, setWinnerFound] = useState(false);
	const [timer, setTimer] = useState(3);
	const [wantsBatting, setWantsBatting] = useState(null);

	const navigate = useNavigate();
	let hasSentReq = false;

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
			setIsLeader(game.leader === socket.id);
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
				setTimer(3);
				await wait(1000);
				setTimer(2);
				await wait(1000);
				setTimer(1);
				await wait(1000);
				setTimer(0);

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
	// const handleWantsBatting = async (newChoice) => {
	// 	console.log(
	// 		`${wantsBatting} was wants batting, updated wants batting to ${newChoice}`
	// 	);
	// 	if (wantsBatting === null) {
	// 		setWantsBatting(newChoice);
	// 		socket.emit("player-wants-to", {
	// 			roomCode: getRoomCode(),
	// 			choice: newChoice,
	// 		});
	// 	} else {
	// 		console.log("Alrready sent a req");
	// 	}
	// };
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
		<div className="relative overflow-hidden grow my-6">
			<div className="relative z-10 w-full flex justify-between items-center">
				<div className="py-4 pe-6 ps-0 rounded-r-md bg-black/30 backdrop-blur-sm text-white font-bold">
					<span className="ps-4">{players[0].name}</span>
				</div>
				<div className="py-4 ps-6 pe-0 rounded-l-md bg-black/30 backdrop-blur-sm text-white font-bold">
					<span className="pe-4">{players[1].name}</span>
				</div>
			</div>

			<div className="relative z-10 max-w-4xl mx-auto pt-8 px-4 sm:px-0">
				<div className="flex justify-center items-center space-x-16 mb-12 h-96">
					<Lefthand choice={player1Choice} />
					<Righthand choice={player2Choice} />
				</div>

				{!showResult || (showResult && !winnerFound) ? (
					<div className="text-center">
						<h2 className="text-gray-800 text-2xl mb-6">
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
									className={`p-6 rounded-xl text-4xl transition-all transform 
                    ${
						selectedChoice === choice
							? "bg-green-500 scale-110"
							: "bg-white/10 hover:bg-white/20 hover:scale-105"
					} 
                    ${
						selectedChoice && selectedChoice !== choice
							? "opacity-50"
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
										<Trophy className="text-yellow-400 w-8 h-8" />
										<h2 className="text-white text-3xl font-bold">
											{winner} Wins the Toss! {timer} left
										</h2>
									</div>

									{displayChoice && (
										<div className="space-y-4">
											<h3 className="text-white text-xl">
												Choose Your Side:
											</h3>
											<div className="flex justify-center space-x-4">
												<button
													onClick={() =>
														handleWantsBatting(
															"yes"
														)
													}
													className={`bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transform hover:scale-105 transition-all font-bold
												${wantsBatting == true && "bg-blue-600 scale-105"}`}>
													Batting
												</button>
												<button
													onClick={() =>
														handleWantsBatting("no")
													}
													className={`bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg transform hover:scale-105 transition-all font-bold ${
														wantsBatting == false &&
														"bg-red-600 scale-105"
													}`}>
													Bowling
												</button>
											</div>
										</div>
									)}
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
