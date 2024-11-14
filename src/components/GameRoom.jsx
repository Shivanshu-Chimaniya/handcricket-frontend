import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {io} from "socket.io-client";

const socket = io();

const Game = ({
	getSocket,
	socket,
	getPlayerName,
	changePlayerName,
	getRoomCode,
	changeRoomCode,
}) => {
	const [game, setGame] = useState({});
	const [players, setPlayers] = useState([]);
	const [gamePhase, setGamePhase] = useState("waiting");
	const [tossChoice, setTossChoice] = useState(null);
	const [isBatting, setIsBatting] = useState(null);
	const [currBall, setCurrBall] = useState([0, 0]);
	const [playerMove, setPlayerMove] = useState(-1);
	const [targetScore, setTargetScore] = useState(null);
	const navigate = useNavigate();
	let url = "http://localhost:3000";

	useEffect(() => {
		if (!getRoomCode()) {
			navigate("/");
		}
		let fetchGame = async () => {
			const res = await fetch(url + "/api/game/" + getRoomCode(), {
				headers: {
					"Content-Type": "application/json",
				},
			});
			let json = await res.json();
			setGame(json.game);
			setPlayers(json.game.players);
			if (json.game.players.length == 2) {
				setGamePhase("canStart");
			}
		};
		fetchGame();
	}, []);

	useEffect(() => {
		if (!socket) {
			alert("connection broke");
			navigate("/");
			return;
		}
		socket.on("playerJoined", async ({}) => {
			const res = await fetch(url + "/api/game/" + getRoomCode(), {
				headers: {
					"Content-Type": "application/json",
				},
			});
			let json = await res.json();
			setGame(json.game);
			setPlayers(json.game.players);
			if (json.game.players.length == 2) {
				setGamePhase("canStart");
			}
		});

		socket.on("game_aborted", () => {
			alert("you won, he left!!");
		});

		socket.on("startGame", () => {
			setGamePhase("tossing");
		});

		socket.on("tossWinner", async ({winnerId}) => {
			console.log("i'll bat!");
			if (socket.id === winnerId) {
				alert("you won toss");
				setIsBatting(true);
			} else {
				alert("you loss toss");
				setIsBatting(false);
			}
			setGamePhase("handcricket");
		});

		socket.on("tossDraw", async () => {
			alert("it drew,choose again");

			setTossChoice(null);
		});

		socket.on("out", async ({targetScore}) => {
			setIsBatting((val) => !val);
			setTargetScore(targetScore);
		});

		socket.on("gameover", async ({result}) => {
			setGamePhase("result");
			console.log(result);
		});

		socket.on("updateGame", async ({game, move1, move2}) => {
			setCurrBall([move1, move2]);
			setPlayerMove(-1);
		});

		return () => socket.disconnect();
	}, []);

	const handleTossSelection = (choice) => {
		if (tossChoice === null) {
			setTossChoice(choice);
			socket.emit("playerTossMove", {roomCode: getRoomCode(), choice});
		}
	};

	const handleNumberSelection = (num) => {
		if (playerMove === -1) {
			setPlayerMove(num);

			socket.emit("playerMove", {roomCode: getRoomCode(), move: num});
		}
	};

	const getGame = async (num) => {
		const res = await fetch(url + "/api/game/" + getRoomCode(), {
			headers: {
				"Content-Type": "application/json",
			},
		});
		let json = await res.json();
		console.log(json.game);
	};

	const handleGameStart = () => {
		socket.emit("startGame", {roomCode: getRoomCode()});
	};

	const isRoomOwner = () => {
		return game.players[0].socketId === socket.id;
	};

	return (
		<div className="game">
			<h2>Room Code: {getRoomCode()}</h2>
			{players.length === 2 && (
				<div>
					<h3>Players: {players.map((p) => p.name).join(" vs ")}</h3>
				</div>
			)}
			{gamePhase === "waiting" ? <>Waiting</> : <></>}
			{gamePhase === "canStart" ? (
				<>
					<div>players</div>
					<ul>
						{players.map((p) => (
							<li key={p.socketId}>{p.name}</li>
						))}
					</ul>

					{players.length == 2 && isRoomOwner() ? (
						<>
							<button onClick={handleGameStart}>Start</button>
						</>
					) : (
						<>Waiting for Owner To Start</>
					)}
				</>
			) : (
				<></>
			)}
			{gamePhase === "tossing" ? (
				<div className="toss">
					<h3>Rock Paper Scissors</h3>
					<button onClick={() => handleTossSelection("rocks")}>
						Rock
					</button>
					<button onClick={() => handleTossSelection("paper")}>
						Paper
					</button>
					<button onClick={() => handleTossSelection("scissors")}>
						Scissors
					</button>
				</div>
			) : (
				<></>
			)}
			{gamePhase === "handcricket" ? (
				<>
					<div className="hand-cricket">
						<h3>Hand Cricket</h3>
						{isBatting ? "batting" : "bowling"}
						<p>Target: {targetScore || "N/A"}</p>
						<div>Your Turn: Choose a number</div>
						{[1, 2, 3, 4, 5, 6].map((num) => (
							<button
								key={num}
								style={{
									backgroundColor:
										playerMove != null && playerMove == num
											? "lime"
											: "grey",
								}}
								onClick={() => handleNumberSelection(num)}>
								{num}
							</button>
						))}
					</div>

					<p>
						<span>
							{" "}
							{currBall[0]} , {currBall[1]}
						</span>
					</p>
				</>
			) : (
				<></>
			)}
			{gamePhase === "result" ? (
				<>
					<h3>Game Over!</h3>
				</>
			) : (
				<></>
			)}
			{gamePhase === "aborted" ? (
				<>
					<h3>Player Left</h3>
				</>
			) : (
				<></>
			)}
			{/* <button onClick={() => console.log(getPlayerName())}>
				print player name
			</button>
			<button onClick={() => console.log(getSocket())}>
				print socket
			</button>
			<button onClick={() => console.log(getRoomCode())}>
				print room code
			</button>
			<button onClick={() => getGame()}>print game</button> */}
		</div>
	);
};

export default Game;
