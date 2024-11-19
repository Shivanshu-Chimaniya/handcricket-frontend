import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import "./GameRoom.css";
import HandCricket from "./HandCricket";
import Tossing from "./Tossing";
import WaitingRoom from "./WaitingRoom";
import ResultsModal from "./ResultsModal";

const Game = ({socket, getPlayerName, getRoomCode}) => {
	const [gamePhase, setGamePhase] = useState("waiting"); // waiting, tossing, handCricket, results

	const navigate = useNavigate();

	let URL = import.meta.env.VITE_BACKENDURL;

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
			const res = await fetch(URL + "/api/game/" + getRoomCode(), {
				headers: {
					"Content-Type": "application/json",
				},
			});
			let game = await res.json();
		};
		// fn();

		socket.on("startGame", () => {
			setGamePhase("tossing");
		});
		socket.on("startHandCricket", () => {
			setGamePhase("handCricket");
		});

		return () => socket.disconnect();
	}, []);

	return (
		<>
			{gamePhase === "waiting" && (
				<WaitingRoom getRoomCode={getRoomCode} socket={socket} />
			)}
			{gamePhase === "tossing" && (
				<Tossing getRoomCode={getRoomCode} socket={socket} />
			)}

			{gamePhase == "handCricket" && (
				<HandCricket getRoomCode={getRoomCode} socket={socket} />
			)}
		</>
	);
};

export default Game;
