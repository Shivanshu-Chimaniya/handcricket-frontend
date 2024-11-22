import React from "react";
import "./GameHeader.css";
import ball from "../assets/ball.png";
import bat from "../assets/bat.png";

export default function GameHeader({
	gamePhase,
	player1,
	player2,
	isLeader,
	isFirstInnings,
	targetScore,
	battingTurn,
}) {
	return (
		<div className="GameHeader">
			<div className="aboveGamePhase z-10 w-full py-1 text-xl pt-4 font-extrabold text-center">
				{gamePhase === "Tossing" && "Tossing"}
				{gamePhase === "HandCricket" &&
					(!isFirstInnings
						? `Inning-2, Target-${targetScore}`
						: "Inning-1")}
			</div>
			<div className="relative z-10 flex justify-between items-center pt-4 min-[600px]:pt-12">
				<div
					className={`py-4 pe-6 ps-0 rounded-r-md ${
						isLeader ? "bg-blue-500" : "bg-rose-600"
					} backdrop-blur-sm text-white font-bold max-w-40`}>
					<span className="ps-4 flex items-center overflow-scroll">
						{gamePhase == "HandCricket" && (
							<img
								className="BattingBallingSymbol"
								src={battingTurn == 0 ? bat : ball}
								alt={battingTurn == 0 ? "Batting" : "Balling"}
							/>
						)}
						&nbsp;
						{player1}
					</span>
				</div>

				<div className="inbetweenGamePhase">
					<p className="ps-4 pe-2 py-1 text-xl font-extrabold">
						{gamePhase === "Tossing" && "Tossing"}
						{gamePhase === "HandCricket" &&
							(!isFirstInnings
								? `Inning-2, Target-${targetScore}`
								: "Inning-1")}
					</p>
				</div>

				<div
					className={`py-4 ps-6 pe-0 rounded-l-md ${
						isLeader ? "bg-rose-600" : "bg-blue-500"
					} backdrop-blur-sm text-white font-bold max-w-40`}>
					<span className="pe-4 flex items-center overflow-scroll">
						{gamePhase == "HandCricket" && (
							<img
								className="BattingBallingSymbol"
								src={battingTurn == 1 ? bat : ball}
								alt={battingTurn == 1 ? "Batting" : "Balling"}
							/>
						)}
						&nbsp;{player2}
					</span>
				</div>
			</div>
		</div>
	);
}
