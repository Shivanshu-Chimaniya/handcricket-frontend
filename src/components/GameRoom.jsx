import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import "./GameRoom.css";
import HandCricket from "./HandCricket";
import Tossing from "./Tossing";
import WaitingRoom from "./WaitingRoom";

const Game = ({socket, getPlayerName, getRoomCode}) => {
	const [game, setGame] = useState({});
	const [players, setPlayers] = useState([]);
	const [gamePhase, setGamePhase] = useState("waiting"); // waiting, tossing, handCricket, results
	const [isLeader, setIsLeader] = useState(true);
	const navigate = useNavigate();
	let url = "http://localhost:3000";

	useEffect(() => {
		if (socket == null) {
			navigate("/");
			return;
		}
		if (getRoomCode() == "") {
			navigate("/");
			return;
		}
		const fn = async () => {
			const res = await fetch(url + "/api/game/" + getRoomCode(), {
				headers: {
					"Content-Type": "application/json",
				},
			});
			let json = await res.json();
			setIsLeader(json.game.leader === socket.id);
			setGame(game);
		};
		fn();

		socket.on("game_aborted", () => {
			alert("you won, he left!!");
		});

		socket.on("startGame", () => {
			setGamePhase("tossing");
		});
		socket.on("startHandCricket", () => {
			setGamePhase("handCricket");
		});

		return () => socket.disconnect();
	}, []);

	const handleChangePlayers = (players) => {
		setPlayers(players);
	};
	const handleStartHandCricket = () => {
		if (socket == null) {
			navigate("/");
			return;
		}
		if (getRoomCode() == "") {
			navigate("/");
			return;
		}
		if (isLeader)
			socket.emit("reqStartHandCricket", {roomCode: getRoomCode()});
	};
	return (
		<>
			{gamePhase === "waiting" && (
				<WaitingRoom
					handleChangePlayers={handleChangePlayers}
					players={players}
					getRoomCode={getRoomCode}
					socket={socket}
					game={game}
				/>
			)}
			{gamePhase === "tossing" && (
				<Tossing
					getRoomCode={getRoomCode}
					socket={socket}
					game={game}
					players={players}
					handleStartHandCricket={handleStartHandCricket}
				/>
			)}

			{gamePhase == "handCricket" && (
				<HandCricket
					getRoomCode={getRoomCode}
					socket={socket}
					game={game}
					players={players}
					handleStartHandCricket={handleStartHandCricket}
				/>
			)}
		</>
	);
};

export default Game;
