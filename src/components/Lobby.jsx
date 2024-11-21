import React, {useState, useEffect} from "react";
import {RefreshCw, Trophy, Info, Play, Users} from "lucide-react";
import {useNavigate} from "react-router-dom";
import BouncyBalls from "./BouncyBalls";
import StadiumLights from "./StaduimLights";

const generateRandomName = () => {
	const prefixes = ["Cricket", "Batsman", "Bowler", "Captain", "AllRounder"];
	const suffixes = ["Hero", "Pro", "Master", "Champ", "Star"];

	const number = Math.floor(Math.random() * 99) + 1;
	const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
	const randomSuffix = suffixes[Math.floor(Math.random() * suffixes.length)];

	return `${randomPrefix}${randomSuffix}${number}`;
};

const Modal = ({isOpen, onClose, title, children}) => {
	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
			<div className="bg-white rounded-lg p-6 max-w-lg w-full m-4">
				<div className="flex justify-between items-center mb-4">
					<h2 className="text-2xl font-bold">{title}</h2>
					<button
						onClick={onClose}
						className="text-gray-500 hover:text-gray-700">
						<b>X</b>
					</button>
				</div>
				{children}
			</div>
		</div>
	);
};

const LeaderboardModal = ({isOpen, onClose}) => (
	<Modal isOpen={isOpen} onClose={onClose} title="Example Leaderboard">
		<div className="space-y-4">
			{[
				{name: "CricketPro99", wins: 42, highScore: 186, streak: 8},
				{name: "BatsmanHero23", wins: 38, highScore: 164, streak: 6},
				{name: "BowlerStar45", wins: 35, highScore: 142, streak: 5},
			].map((player, index) => (
				<div
					key={index}
					className="flex items-center space-x-4 p-2 bg-gray-50 rounded">
					<div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
						{index + 1}
					</div>
					<div className="flex-grow">
						<div className="font-semibold">{player.name}</div>
						<div className="text-sm text-gray-500">
							{player.wins} wins · {player.highScore} high score ·{" "}
							{player.streak} streak
						</div>
					</div>
				</div>
			))}
		</div>
	</Modal>
);

const HowToPlayModal = ({isOpen, onClose}) => (
	<Modal isOpen={isOpen} onClose={onClose} title="Example How to Play">
		<div className="space-y-4">
			<div>
				<h3 className="font-bold mb-2">1. Getting Started</h3>
				<p className="text-gray-600">
					First, players engage in Rock-Paper-Scissors to decide who
					bats first.
				</p>
			</div>
			<div>
				<h3 className="font-bold mb-2">2. Gameplay</h3>
				<p className="text-gray-600">
					Players choose numbers from 1 to 6. If the numbers match,
					the batting player is out!
				</p>
			</div>
			<div>
				<h3 className="font-bold mb-2">3. Scoring</h3>
				<p className="text-gray-600">
					The batting player scores runs equal to their chosen number
					if it doesn't match the bowler's number.
				</p>
			</div>
		</div>
	</Modal>
);

export default function Lobby({socket, game, changeRoomCode, changeGame}) {
	const [playerName, setPlayerName] = useState("");
	const [roomCode, setRoomCode] = useState("");
	const [showLeaderboard, setShowLeaderboard] = useState(false);
	const [showHowToPlay, setShowHowToPlay] = useState(false);
	const navigate = useNavigate();

	useEffect(() => {
		setPlayerName(generateRandomName());
	}, []);

	// prev
	useEffect(() => {
		if (socket == null) {
			return;
		}
		socket.on("GameCreated", ({game}) => {
			changeGame(game);
			navigate(`/game/${game.roomCode}`);
		});
		socket.on("PlayerJoined", ({game}) => {
			changeGame(game);
			navigate(`/game/${game.roomCode}`);
		});
	}, [socket]);

	const handleCreateGame = async () => {
		if (!playerName) return alert("Enter your name");

		if (socket == null || !socket.connected)
			return alert("Server is down! Connection Issue");

		socket.emit("create-new-game", {playerName});
	};

	var handleJoinGame = async () => {
		if (!playerName) return alert("Enter your name");
		if (!roomCode) return alert("Enter a room code");
		let roomCode2 = roomCode.toUpperCase();
		setRoomCode(roomCode2);
		changeRoomCode(roomCode2);
		if (socket == null || !socket.connected)
			return alert("Server is down! Connection Issue");

		socket.emit("join-game", {
			roomCode: roomCode2,
			playerName,
		});
	};

	return (
		<div className="relative">
			{/* Background Animation */}

			<div className="container mx-auto px-4 pt-40 relative">
				{/* Hero Section */}
				<div className="text-center mb-12">
					<h1 className="text-6xl font-bold mb-4 text-gray-800 animate-fade-in">
						HandCricket
					</h1>
					<p className="text-xl text-gray-600 mb-8">
						Setup up a call, Start Playing.
					</p>
				</div>
				<br />
				{/* Player Name Section */}
				<div className="max-w-md mx-auto mb-8">
					<div className="relative">
						<input
							type="text"
							value={playerName}
							onChange={(e) => setPlayerName(e.target.value)}
							className="w-full p-3 pr-12 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
							placeholder="Enter your player name"
						/>
						<button
							onClick={() => setPlayerName(generateRandomName())}
							className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
							<RefreshCw size={20} />
						</button>
					</div>
				</div>

				{/* Action Buttons */}
				<div className="max-w-md mx-auto space-y-4">
					<button
						onClick={handleCreateGame}
						className="w-full bg-blue-500 text-white py-3 rounded-lg shadow hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2">
						<Play size={20} />
						<span>Create Game</span>
					</button>
					<br />
					<hr />
					<br />
					<div className="flex gap-4">
						<input
							type="text"
							value={roomCode}
							onChange={(e) => setRoomCode(e.target.value)}
							placeholder="Enter game code"
							className=" grow p-2 border rounded focus:ring-2 focus:ring-green-500 outline-none"
						/>

						<button
							onClick={() => handleJoinGame()}
							className="px-4 bg-green-500 text-white py-3 rounded-lg shadow hover:bg-green-600 transition-colors flex items-center justify-center space-x-2">
							<Users size={20} />
							<span>Join Game</span>
						</button>
					</div>
				</div>

				{/* Secondary Buttons */}
				<div className="max-w-md mx-auto mt-8 flex justify-center space-x-4">
					<button
						onClick={() => setShowLeaderboard(true)}
						className="flex items-center space-x-2 text-gray-600 hover:text-gray-800">
						<Trophy size={20} />
						<span>Leaderboard</span>
					</button>

					<button
						onClick={() => setShowHowToPlay(true)}
						className="flex items-center space-x-2 text-gray-600 hover:text-gray-800">
						<Info size={20} />
						<span>How to Play</span>
					</button>
				</div>

				{/* Modals */}
				<LeaderboardModal
					isOpen={showLeaderboard}
					onClose={() => setShowLeaderboard(false)}
				/>
				<HowToPlayModal
					isOpen={showHowToPlay}
					onClose={() => setShowHowToPlay(false)}
				/>
			</div>
		</div>
	);
}
