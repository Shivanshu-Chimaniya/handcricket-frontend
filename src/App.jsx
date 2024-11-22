// App.js
import React, {useEffect, useState} from "react";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Lobby from "./components/Lobby";
import GameRoom from "./components/GameRoom";
import "./App.css";
import {io} from "socket.io-client";
import BouncyBalls from "./components/BouncyBalls";
import StadiumLights from "./components/StaduimLights";
import generateRandomName from "./js/generateRandomName";

function App() {
	let [playerName, setPlayerName] = useState(generateRandomName);
	let [socket, setSocket] = useState(null);
	let [gameCopy, setGameCopy] = useState({});
	let URL = import.meta.env.VITE_BACKENDURL;

	useEffect(() => {
		let connect = async () => {
			try {
				let response = await fetch(`${URL}`);
				let json = await response.json();
				console.log(json);
				let newSocket = io(`${URL}/`);
				setSocket(newSocket);
			} catch (err) {
				console.log(err);
			}
		};
		connect();
		return () => {
			if (socket == null) return;
			socket.disconnect();
		};
	}, []);

	// NoGameFound, GameIsFull

	const getRoomCode = () => {
		return gameCopy.roomCode;
	};

	const changePlayerName = (newName) => {
		setPlayerName(newName);
	};
	const changeRoomCode = (newCode) => {
		setGameCopy((prev) => {
			return {...prev, roomCode: newCode};
		});
	};

	const changeGame = (game) => {
		setGameCopy(game);
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
									game={gameCopy}
									getRoomCode={getRoomCode}
									changeRoomCode={changeRoomCode}
									changeGame={changeGame}
									playerName={playerName}
									changePlayerName={changePlayerName}
								/>
							}
						/>
						<Route
							path="/game/:roomCode"
							element={
								<GameRoom
									socket={socket}
									game={gameCopy}
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
