import React from "react";
import ball from "../assets/ball.png";
import bat from "../assets/bat.png";
import "./PlayerResult.css";

const PlayerResult = ({
	Inning,
	battingTurn,
	playerName,
	playerScore,
	playerSpan,
}) => {
	return (
		<div className="PlayerResult mb-4">
			<div className="flex justify-between items-center mb-2">
				<span className="font-medium">{playerName}</span>

				<span className="text-blue-600 font-bold">
					{playerScore}&nbsp;runs
				</span>
			</div>

			<div className="flex gap-2 mb-2">
				<div className="flex-col ">
					<div key={0} className="cell">
						<img className="icon" src={bat} alt="batting:" />
					</div>
					<div key={1} className="cell">
						<img className="icon" src={ball} alt="balling:" />
					</div>
				</div>
				<div
					style={{
						scrollbarWidth: "none",
						overflowX: "scroll",
					}}
					className="flex ">
					{Inning.map((run, index) => (
						<>
							<div key={index} className="flex-col mx-1">
								<div
									key={0}
									style={{backgroundColor: "#D9EAD3"}}
									className="cell">
									{battingTurn == 0
										? run.player1
										: run.player2}
								</div>
								<div
									key={1}
									style={{backgroundColor: "#D9d9d93"}}
									className="cell">
									{battingTurn == 0
										? run.player2
										: run.player1}
								</div>
							</div>
						</>
					))}
				</div>
			</div>

			<div className="text-sm text-gray-600">
				Balls played: {playerSpan}
			</div>
		</div>
	);
};

export default PlayerResult;
