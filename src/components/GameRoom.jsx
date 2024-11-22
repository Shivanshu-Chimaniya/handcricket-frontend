import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import "./GameRoom.css";
import HandCricket from "./HandCricket";
import Tossing from "./Tossing";
import WaitingRoom from "./WaitingRoom";
import ResultsModal from "./ResultsModal";

const GameRoom = ({socket, game, getRoomCode}) => {
	const [gameCopy, setGameCopy] = useState(game);
	const [gamePhase, setGamePhase] = useState("waiting"); // waiting, tossing, handCricket

	const navigate = useNavigate();

	if (getRoomCode() == undefined) {
		navigate("/");
		return;
	}
	if (socket == null) {
		navigate("/");
		return;
	}
	console.log("gameROom");
	useEffect(() => {
		socket.on("StartTossing", ({game}) => {
			setGameCopy(game);
			setGamePhase("tossing");
		});
		socket.on("startHandCricket", ({game}) => {
			setGameCopy(game);
			setGamePhase("handCricket");
		});

		socket.on("GameAborted", () => {
			alert("you won, he left!!");
			navigate("/");
			return;
		});
	}, []);

	const changeGameCopy = (newGame) => {
		setGameCopy(newGame);
	};

	return (
		<>
			{gamePhase === "waiting" && (
				<WaitingRoom
					getRoomCode={getRoomCode}
					gameCopy={gameCopy}
					socket={socket}
				/>
			)}
			{gamePhase === "tossing" && (
				<Tossing
					getRoomCode={getRoomCode}
					socket={socket}
					gameCopy={gameCopy}
				/>
			)}

			{gamePhase == "handCricket" && (
				<HandCricket
					getRoomCode={getRoomCode}
					socket={socket}
					gameCopy={gameCopy}
				/>
			)}
		</>
	);
};

export default GameRoom;
