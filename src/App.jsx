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
	const [roomCode, setRoomCode] = useState("");

	useEffect(() => {
		try {
			let newSocket = io("http://localhost:3000/");

			setSocket(newSocket);
		} catch (err) {
			console.log("Server error please try later!");
		}
	}, []);

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
