// import React, {useEffect, useState} from "react";
// import {useNavigate} from "react-router-dom";
// import axios from "axios";
// import "./Lobby.css";

// const Lobby = ({getSocket, playerName, setPlayerName}) => {
// 	const [roomCode, setRoomCode] = useState("");
// 	let url = "http://localhost:3000/api/";

// 	const navigate = useNavigate();

// 	const handleCreateGame = async () => {
// 		if (!playerName) {
// 			alert("Please enter your name");
// 			return;
// 		}
// 		try {
// 			let socket = await getSocket();
// 			let roomCode = generateRoomCode();
// 			let response = await fetch(url + "create", {
// 				headers: {
// 					"Content-Type": "application/json",
// 				},
// 				method: "POST",
// 				body: JSON.stringify({
// 					playerName: playerName,
// 					roomCode: roomCode,
// 					socketId: socket.id,
// 				}),
// 			});
// 			const json = await response.json();
// 			if (!response.ok) {
// 				if (response.status == 500) {
// 					alert("error creating the Game");
// 					return;
// 				}
// 				alert("unknown error in creating");
// 			}
// 			console.log(json);
// 			socket.emit("createSocketRoom", {roomCode});
// 			navigate(`/game/${roomCode}`);
// 		} catch (error) {
// 			console.error("Error creating game:", error);
// 		}
// 	};

// 	const handleJoinGame = async () => {
// 		if (!playerName || !roomCode) {
// 			alert("Please fill all fields");
// 			return;
// 		}
// 		let socket = await getSocket();

// 		try {
// 			let response = await fetch(url + "join", {
// 				headers: {
// 					"Content-Type": "application/json",
// 				},
// 				method: "POST",
// 				body: JSON.stringify({
// 					playerName: playerName,
// 					roomCode: roomCode,
// 					socketId: socket.id,
// 				}),
// 			});
// 			if (!response.ok) {
// 				if (response.status == 400) {
// 					alert(json.error);
// 					return;
// 				}
// 				if (response.status == 500) {
// 					alert("error creating the Game");
// 					return;
// 				}
// 				alert("unknown error in joining");
// 			}
// 			const json = await response.json();
// 			console.log(json);

// 			navigate(`/game/${roomCode}`);
// 		} catch (error) {
// 			console.error("Error Joining game:", error);
// 		}
// 	};

// 	const generateRoomCode = () =>
// 		Math.random().toString(36).substring(2, 8).toUpperCase();

// 	return (
// 		<div className="lobby">
// 			<h2>Hand Cricket Game</h2>
// 			<input
// 				type="text"
// 				placeholder="Enter your name"
// 				value={playerName}
// 				onChange={(e) => setPlayerName(e.target.value)}
// 			/>
// 			<button onClick={handleCreateGame}>Create Game</button>
// 			<input
// 				type="text"
// 				placeholder="Enter room code"
// 				value={roomCode}
// 				onChange={(e) => setRoomCode(e.target.value)}
// 			/>
// 			<button onClick={handleJoinGame}>Join Game</button>
// 		</div>
// 	);
// };

// export default Lobby;

// components/Lobby.js
import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";

const Lobby = ({
	getSocket,
	socket,
	getPlayerName,
	changePlayerName,
	getRoomCode,
	changeRoomCode,
}) => {
	let [playerName, setPlayerName] = useState(getPlayerName);
	let [roomCode, setRoomCode] = useState(getRoomCode);
	const navigate = useNavigate();
	let url = "http://localhost:3000";

	useEffect(() => {
		if (!socket) return;
		socket.on("gameCreated", ({game}) => {
			changeRoomCode(game.roomCode);
			navigate(`/game/${game.roomCode}`);
		});

		socket.on("playerJoined", ({game}) => {
			changeRoomCode(game.roomCode);
			navigate(`/game/${game.roomCode}`);
		});
	}, [socket]);

	const handleCreateGame = async () => {
		if (!playerName) return alert("Enter your name");
		changePlayerName(playerName);
		if (!socket) return;
		socket.emit("createGame", {playerName});
	};

	const handleJoinGame = async () => {
		if (!playerName || !roomCode) return alert("Fill all fields");
		changePlayerName(playerName);
		changeRoomCode(roomCode);

		if (!socket) return;
		socket.emit("joinGame", {
			roomCode,
			playerName,
		});
	};

	return (
		<div className="lobby">
			<h2>Hand Cricket Game</h2>
			<input
				type="text"
				placeholder="Enter your name"
				value={playerName}
				onChange={(e) => setPlayerName(e.target.value)}
			/>
			<button onClick={handleCreateGame}>Create Game</button>

			<input
				type="text"
				placeholder="Enter room code"
				value={roomCode}
				onChange={(e) => setRoomCode(e.target.value)}
			/>
			<button onClick={handleJoinGame}>Join Game</button>
		</div>
	);
};

export default Lobby;
