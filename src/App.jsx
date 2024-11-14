// App.js
import React, {useEffect, useState} from "react";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Lobby from "./components/Lobby";
import Game from "./components/GameRoom";
import "./App.css";
import {io} from "socket.io-client";

function App() {
	let [socket, setSocket] = useState(null);
	let [playerName, setPlayerName] = useState("");
	const [roomCode, setRoomCode] = useState(""); // tossing, handcricket, result

	let getSocket = () => {
		console.log("socket");
		if (socket == null) {
			let newSocket = io("http://localhost:3000/");
			setSocket(newSocket);
			return newSocket;
		}
		return socket;
	};

	useEffect(() => {
		let newSocket = io("http://localhost:3000/");
		setSocket(newSocket);
	}, []);

	useEffect(() => {
		if (!socket) return;
		if (roomCode === "") return;
		socket.on("tossing", setGamePhase("tossing"));
		socket.on("game_aborted", setGamePhase("aborted"));
	}, [socket]);

	const getPlayerName = () => {
		return playerName;
	};
	const changePlayerName = (name) => {
		setPlayerName(name);
	};
	const getRoomCode = () => {
		return roomCode;
	};
	const changeRoomCode = (newCode) => {
		setRoomCode(newCode);
	};

	return (
		<>
			<Router>
				<div className="App">
					<Routes>
						<Route
							path="/"
							element={
								<Lobby
									socket={socket}
									getSocket={getSocket}
									getPlayerName={getPlayerName}
									changePlayerName={changePlayerName}
									getRoomCode={getRoomCode}
									changeRoomCode={changeRoomCode}
								/>
							}
						/>
						<Route
							path="/game/:roomCode"
							element={
								<Game
									socket={socket}
									getSocket={getSocket}
									changePlayerName={changePlayerName}
									getPlayerName={getPlayerName}
									getRoomCode={getRoomCode}
									changeRoomCode={changeRoomCode}
								/>
							}
						/>
					</Routes>
				</div>
			</Router>
		</>
	);
}

export default App;
