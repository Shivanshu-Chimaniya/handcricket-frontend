// App.js
import React, {useEffect, useState} from "react";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Lobby from "./components/Lobby";
import Game from "./components/GameRoom";
import "./App.css";
import {io} from "socket.io-client";

function App() {
	let [socket, setSocket] = useState(null);
	const [roomCode, setRoomCode] = useState("");
	let URL = import.meta.env.VITE_BACKENDURL;

	useEffect(() => {
		try {
			let newSocket = io(`${URL}/`);
			setSocket(newSocket);
		} catch (err) {
			console.log("Server error please try later!");
		}
	}, []);

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
