import React, {useEffect, useState} from "react";
import {Crown, Copy, Loader2} from "lucide-react";
import {useNavigate} from "react-router-dom";

const WaitingRoom = ({getRoomCode, socket}) => {
	const [copied, setCopied] = useState(false);
	const [players, setPlayers] = useState([
		{socketId: 1, name: "Player 1"},
		{socketId: 2, name: "Player 2"},
	]);
	const [canStart, setCanStart] = useState(false);
	const [isLeader, setIsLeader] = useState(true);
	const roomCode = getRoomCode();
	const navigate = useNavigate();

	let URL = import.meta.env.VITE_BACKENDURL;
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
			if (game.players.length === 2) {
				setCanStart(true);
			}
		};
		fetchGame();

		socket.on("playerJoined", async ({game}) => {
			setPlayers(game.players);
			setIsLeader(game.leader === socket.id);
			if (game.players.length === 2) {
				setCanStart(true);
			}
		});
	}, []);

	const copyRoomCode = () => {
		if (!getRoomCode()) {
			navigate("/");
		}
		navigator.clipboard.writeText(roomCode).then(function () {
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		});
	};

	const handleStart = () => {
		if (socket == null) {
			navigate("/");
		}
		if (!getRoomCode()) {
			navigate("/");
		}
		socket.emit("startGame", {roomCode: getRoomCode()});
	};

	return (
		<div className="relative min-w-96">
			{/* Stadium Background Elements */}
			{/* <div className="absolute inset-0 overflow-hidden">
				<div className="absolute w-20 h-20 bg-blue-200 rounded-full opacity-20 animate-bounce top-20 left-1/4" />
				<div className="absolute w-16 h-16 bg-green-200 rounded-full opacity-20 animate-bounce delay-1000 top-40 right-1/3" />
			</div> */}
			{/* Main Content Container */}
			<div className="relative z-10 max-w-4xl mx-auto pt-16 px-4">
				{/* Start Game Button (Leader Only) */}

				{/* Central Waiting Message */}
				<div className="text-center mb-12">
					<h1 className="text-4xl font-bold text-gray-800 animate-fade-in mb-4">
						Waiting Room
					</h1>
					{!canStart && (
						<div className="flex items-center justify-center space-x-3">
							<span className="text-xl text-gray-800 animate-fade-in">
								Waiting for player two to join
							</span>
						</div>
					)}
				</div>

				{/* Animated Cricket Ball */}
				<div className="w-16 h-16 bg-red-500 rounded-full mx-auto mb-8 animate-bounce shadow-lg">
					<div className="w-full h-full rounded-full border-4 border-red-400 relative">
						<div className="absolute inset-0 border-2 border-red-300 rounded-full transform rotate-45"></div>
					</div>
				</div>

				{/* Players List */}
				<div className="bg-black/50 backdrop-blur-sm rounded-xl p-6 mb-8">
					<h2 className="text-xl font-bold text-white animate-fade-in mb-4">
						Players
					</h2>
					<div className="space-y-4">
						{typeof players[0] !== "undefined" ? (
							<div
								key={players[0].id}
								className="flex items-center justify-between bg-black/5  hover:bg-black/20  p-4 rounded-lg transition-all transform ">
								<div className="flex items-center space-x-3">
									<Crown className="text-yellow-400 w-6 h-6" />

									<span className="text-white font-medium">
										{players[0].name}
									</span>
								</div>
							</div>
						) : (
							<div
								key={0}
								className="flex items-center justify-between bg-black/5 p-4 rounded-lg hover:bg-black/20 transition-all transform ">
								<div className="flex items-center space-x-3">
									<span className="text-white font-medium">
										Player 1
									</span>
								</div>

								<Loader2 className="animate-spin text-gray-800 animate-fade-in" />
							</div>
						)}
						{typeof players[1] !== "undefined" ? (
							<div
								key={players[1].id}
								className="flex items-center justify-between bg-black/5  hover:bg-black/20   p-4 rounded-lg hover:bg-gray/90 transition-all transform ">
								<div className="flex items-center space-x-3">
									<span className="text-white font-medium">
										{players[1].name}
									</span>
								</div>
							</div>
						) : (
							<div
								key={1}
								className="flex items-center justify-between bg-black/5  hover:bg-black/20   p-4 rounded-lg hover:bg-gray/90 transition-all transform ">
								<div className="flex items-center space-x-3">
									<span className="text-white font-medium">
										Player 2
									</span>
								</div>

								<Loader2 className="animate-spin text-gray-800 animate-fade-in" />
							</div>
						)}
					</div>
				</div>
				{canStart && (
					<div className="flex items-center justify-center space-x-3">
						{isLeader ? (
							<button
								onClick={handleStart}
								className="mx-auto bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg transform hover:scale-105 transition-all font-bold shadow-lg">
								Start Game
							</button>
						) : (
							<span className="text-xl text-gray-800 font-extrabold animate-fade-in">
								Waiting for leader to start
							</span>
						)}
					</div>
				)}

				{/* Room Code */}
				<div onClick={copyRoomCode} className="fixed bottom-4 right-4">
					<div className="bg-gray-700/20 backdrop-blur-sm rounded-lg p-4 flex items-center space-x-3">
						<div>
							<div className="text-sm text-white/80">
								Room Code
							</div>
							<div className="text-xl font-bold text-white">
								{roomCode}
							</div>
						</div>
						{!copied ? (
							<button
								className="p-2 hover:bg-white/10 rounded-lg transition-all"
								title={copied ? "Copied!" : "Copy room code"}>
								<Copy className="text-white w-5 h-5" />
							</button>
						) : (
							<span style={{color: "white"}}>&#10003;</span>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default WaitingRoom;
