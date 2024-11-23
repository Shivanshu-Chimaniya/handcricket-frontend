import {Info, Play, RefreshCw, Users} from "lucide-react";
import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import HowToPlayModal from "./HowToPlayModal";
import generateRandomName from "../js/generateRandomName";

export default function Lobby({
	playerName,
	socket,
	changeRoomCode,
	changePlayerName,
	changeGame,
	// game,
	// getRoomCode,
}) {
	const [roomCode, setRoomCode] = useState("");
	const [localPlayerName, setLocalPlayerName] = useState(playerName);
	const [showHowToPlay, setShowHowToPlay] = useState(false);
	const navigate = useNavigate();

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
		if (!localPlayerName) return alert("Enter your name");

		changePlayerName(localPlayerName);
		if (socket == null || !socket.connected)
			return alert("Server is down! Connection Issue");

		socket.emit("create-new-game", {playerName: localPlayerName});
	};

	var handleJoinGame = async () => {
		if (!localPlayerName) return alert("Enter your name");
		changePlayerName(localPlayerName);
		if (!roomCode) return alert("Enter a room code");
		let roomCode2 = roomCode.toUpperCase();
		setRoomCode(roomCode2);
		changeRoomCode(roomCode2);
		if (socket == null || !socket.connected)
			return alert("Server is down! Connection Issue");
		socket.emit("join-game", {
			roomCode: roomCode2,
			playerName: localPlayerName,
		});
	};

	const handleSubmit = (event) => {
		event.preventDefault();
		handleJoinGame();
	};

	return (
		<div className="relative">
			<div className="container mx-auto px-4 pt-28 sm:pt-20 relative">
				<div className="text-center mb-12">
					<h1 className="text-6xl max-[400px]:text-5xl font-bold mb-4 text-gray-800 animate-fade-in">
						HandCricket
					</h1>
					<p className="text-xl max-[400px]:text-sm text-gray-600">
						Setup up a call, Start Playing.
					</p>
				</div>
				<br />

				{/* Player Name Section */}
				<div className="max-w-md mx-auto mb-4">
					<div className="relative">
						<input
							type="text"
							value={localPlayerName}
							onChange={(e) => setLocalPlayerName(e.target.value)}
							className="w-full p-3 pr-12 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
							placeholder="Enter your player name"
						/>
						<button
							onClick={() =>
								setLocalPlayerName(generateRandomName())
							}
							className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
							<RefreshCw size={20} />
						</button>
					</div>
				</div>

				{/* Action Buttons */}
				<div className="max-w-md mx-auto space-y-4 mb-4">
					<button
						onClick={handleCreateGame}
						className="w-full bg-blue-500 text-white py-3 rounded-lg shadow hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2">
						<Play size={20} />
						<span>Create Game</span>
					</button>
				</div>
				<hr />
				<div className="pt-20">
					<form
						onSubmit={handleSubmit}
						className="flex max-w-md mx-auto max-[400px]:space-y-4 max-[400px]:block gap-4">
						<input
							type="text"
							value={roomCode}
							onChange={(e) => setRoomCode(e.target.value)}
							placeholder="Enter game code"
							className="max-[400px]:w-full grow p-3 border rounded focus:ring-2 focus:ring-green-500 outline-none"
						/>

						<button className="max-[400px]:w-full px-4 bg-green-500 text-white py-3 rounded-lg shadow hover:bg-green-600 transition-colors flex items-center justify-center space-x-2">
							<Users size={20} />
							<span>Join&nbsp;Game</span>
						</button>
					</form>
				</div>
				{/* Secondary Buttons */}
				<div className="max-w-md mx-auto mt-8 flex justify-center space-x-4">
					<button
						onClick={() => setShowHowToPlay(true)}
						className="flex items-center space-x-2 text-gray-600 hover:text-gray-800">
						<Info size={20} />
						<span>How to Play</span>
					</button>
				</div>

				{/* Modals */}

				<HowToPlayModal
					isOpen={showHowToPlay}
					onClose={() => setShowHowToPlay(false)}
				/>
			</div>
		</div>
	);
}
