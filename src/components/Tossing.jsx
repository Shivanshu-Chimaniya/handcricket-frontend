import React, {useState, useEffect} from "react";
import {Trophy} from "lucide-react";
import {useNavigate} from "react-router-dom";
import Lefthand from "./Lefthand";
import Righthand from "./Righthand";

const TossingStage = ({getRoomCode, socket, handleStartHandCricket}) => {
	const [players, setPlayers] = useState([
		{socketId: 1, name: "Player 1"},
		{socketId: 2, name: "Player 2"},
	]);
	const [isLeader, setIsLeader] = useState(true);

	const [player1Choice, setPlayer1Choice] = useState(-1);
	const [player2Choice, setPlayer2Choice] = useState(-1);
	const [showResult, setShowResult] = useState(false);
	const [winner, setWinner] = useState(null);
	const [winnerFound, setWinnerFound] = useState(false);
	const [selectedChoice, setSelectedChoice] = useState(null);
	const [timer, setTimer] = useState(3);
	const navigate = useNavigate();

	let url = "http://localhost:3000";
	const choices = ["rock", "paper", "scissors"];

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
		};
		fetchGame();

		socket.on("game_aborted", () => {
			alert("you won, he left!!");
		});

		socket.on("resetToss", () => {
			if (selectedChoice == null) {
				setPlayer1Choice(-1);
				setPlayer2Choice(-1);
			}
		});

		socket.on("tossWinner", async ({winner, p1choice, p2choice}) => {
			setShowResult(true);
			if (socket.id === winner.socketId) {
				setWinner(true);
			} else {
				setWinner(false);
			}
			setPlayer1Choice(getFingers(p1choice));
			setPlayer2Choice(getFingers(p2choice));
			let fn = async () => {
				function wait(ms) {
					return new Promise((resolve) => setTimeout(resolve, ms));
				}
				setTimer(3);
				await wait(1000);
				setTimer(2);
				await wait(1000);
				setTimer(1);
				await wait(1000);
				setTimer(0);
				handleStartHandCricket();
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

	return (
		<div className="relative overflow-hidden grow my-6">
			{/* Header Section */}
			<div className="relative z-10 w-full flex justify-between items-center">
				<div className="py-4 pe-6 ps-0 rounded-r-md bg-black/30 backdrop-blur-sm text-white font-bold">
					<span className="ps-4">{players[0].name}</span>
				</div>
				<div className="py-4 ps-6 pe-0 rounded-l-md bg-black/30 backdrop-blur-sm text-white font-bold">
					<span className="pe-4">{players[1].name}</span>
				</div>
			</div>

			{/* Main Content */}
			<div className="relative z-10 max-w-4xl mx-auto pt-8 px-4 sm:px-0">
				{/* Hands Display Area */}
				<div className="flex justify-center items-center space-x-16 mb-12">
					<Lefthand choice={player1Choice} />
					<Righthand choice={player2Choice} />
				</div>

				{/* Selection Area */}
				{winner == null ? (
					<div className="text-center mb-6">
						<h2 className="text-gray-800 text-2xl mb-6">
							{showResult == true
								? "It's a Tie! Try Again!"
								: "Make Your Choice!"}
						</h2>
						<div className="flex justify-center space-x-4">
							{choices.map((choice) => (
								<button
									key={choice}
									onClick={() => {
										handleTossSelection(choice);
									}}
									disabled={selectedChoice}
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
						{/* Result Display */}
						<div
							className={`transform transition-all duration-500 ${
								showResult
									? "translate-y-0 opacity-100"
									: "translate-y-8 opacity-0"
							}`}>
							<div className="space-y-6">
								<div className="flex items-center justify-center space-x-3">
									<Trophy className="text-yellow-400 w-8 h-8" />
									<h2 className="text-gray-800 text-3xl font-bold">
										{`${winner ? "You" : "They"} Won the
											Toss!`}
									</h2>
									<h2 className="text-gray-800 text-3xl font-bold">
										{`Game starts in ${timer} seconds.`}
									</h2>
								</div>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default TossingStage;
