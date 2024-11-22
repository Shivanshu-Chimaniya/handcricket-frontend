import BattingIcon from "../assets/bat.png";
import "./ScoreBarPlayerDetails.css";

import React from "react";
// import {BattingIcon} from "lucide-react";

// 	isLeader,
// 	battingTurn,
// 	player1,
// 	player2,
// 	score1,
// 	score2,
// 	span1,
// 	span2

const ScoreBarPlayerDetails = ({
	player1,
	player2,
	battingPlayer,
	currentInnings,
	runs,
	runsLeft,
	lastFiveBalls,
}) => {
	return (
		<div className="ScoreBarPlayerDetails flex w-full bg-white/40 backdrop-blur-sm border-y-8 border-white/20 p-2 md:p-4 items-center justify-between relative">
			{/* Left Section - Player Details */}
			<div className="flex flex-col items-center">
				<div
					className={`${
						battingPlayer == 0 && "show"
					} playerDetail  flex-row max-[600px]:flex-col`}>
					<div
						className={`flex items-center ${
							battingPlayer === 0 ? "font-bold" : ""
						}`}>
						{battingPlayer === 0 && (
							<img
								className="mr-2 w-5 h-5"
								src={BattingIcon}
								alt="*"
							/>
						)}
						{player1.name}
					</div>
					<div className="text-sm text-gray-600 mx-5">
						{`${player1.score} (${player1.ballsPlayed})`}
					</div>
				</div>
				<div
					className={`${
						battingPlayer == 1 && "show"
					} playerDetail  flex-row max-[600px]:flex-col`}>
					<div
						className={`flex items-center ${
							battingPlayer === 1 ? "font-bold" : ""
						}`}>
						{battingPlayer === 1 && (
							<img
								className="mr-2 w-5 h-5 "
								src={BattingIcon}
								alt="*"
							/>
						)}
						{player2.name}
					</div>
					<div className="text-sm text-gray-600  mx-5">
						{`${player2.score} (${player2.ballsPlayed})`}
					</div>
				</div>
			</div>

			{/* Center - Runs/Target Badge */}
			<div className="central-badge">
				<div className="background bg-red-600/100 backdrop-blur-sm border-4 border-white/20"></div>
				<div className="foreground">
					{currentInnings == 0 ? (
						<>
							<span className="supplimentText">
								Runs&nbsp;Scored
							</span>
							<div className="runs">{runs}</div>
						</>
					) : (
						<>
							<span className="supplimentText">
								Runs&nbsp;left
							</span>
							<div className="runs">{runsLeft}</div>
						</>
					)}
				</div>
			</div>

			{/* Right - Last 5 Balls */}
			<div className="flex space-x-1 md:space-x-2">
				{lastFiveBalls.map((ball, index) => (
					<div key={index} className="flex flex-col gap-2">
						<div
							key={0}
							className="w-6 h-6 
            rounded-full bg-gray-200 
            flex items-center justify-center 
            text-xs md:text-sm">
							{ball.player1}
						</div>
						<div
							key={1}
							className="w-6 h-6 
            rounded-full bg-gray-200 
            flex items-center justify-center 
            text-xs md:text-sm">
							{ball.player2}
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default ScoreBarPlayerDetails;

{
	/* <div className="relative z-10 w-full flex justify-between items-center bg-white/40 backdrop-blur-sm border-y-8 border-white/20 h-20 max-[600px]:text-xs">
				<div className="ps-2 text-gray-800 font-bold flex w-1/2 pe-12">
					<p className="shrink-0">
						{game.battingTurn == 0 && (
							<img
								className="BattingBallingSymbol2"
								src={bat}
								alt="*"
							/>
						)}
						<br />
						{game.battingTurn == 1 && (
							<img
								className="BattingBallingSymbol2"
								src={bat}
								alt="*"
							/>
						)}
					</p>
					<p className="shrink-1 px-2 ">
						{game.players[0].playerName} <br />
						{game.players[1].playerName}
					</p>
					<p className="shrink-0 px-2">
						{game.scores[0]} <br /> {game.scores[1]}
					</p>
					<p className="shrink-0 px-2 font-semibold ">
						{game.spans[0]} <br /> {game.spans[1]}
					</p>
				</div>
				<div
					className="grow-0"
					style={{
						position: "absolute",
						top: "50%",
						left: "50%",
						background: "red",
					}}>
					<div
						className="bg-red-600/100 backdrop-blur-sm border-4 border-white/20"
						style={{
							position: "absolute",
							width: "100px",
							aspectRatio: "1/1",
							transform: "translate(-50%, -50%) rotate(45deg)",
							borderRadius: "1rem",
						}}></div>
					<div
						style={{
							position: "absolute",
							transform: "translate(-50%, -50%)",
							top: "50%",
							left: "50%",
							textAlign: "center",
							color: "white",
							fontWeight: "600",
						}}>
						{game.isFirstInnings ? (
							<>
								<span style={{fontSize: "0.75rem"}}>
									Runs&nbsp;Scored
								</span>
								<div style={{fontSize: "1.25rem"}}>
									{game.scores[game.battingTurn]}
								</div>
							</>
						) : (
							<>
								<span style={{fontSize: "0.75rem"}}>
									Runs&nbsp;left
								</span>
								<div style={{fontSize: "1.25rem"}}>
									{game.scores[game.battingTurn] <
									game.targetScore
										? game.targetScore -
										  game.scores[game.battingTurn]
										: 0}
								</div>
							</>
						)}
					</div>
				</div>
				<div className="py-1 pe-3 text-gray-800 font-bold w-1/2 flex flex-row justify-end">
					{last10Balls.length > 0 &&
						last10Balls.map((el, index) => (
							<p
								key={index}
								className={`ps-1 gap-1 flex flex-col`}>
								<span className="Balls">{el.player1}</span>
								<span className="Balls">{el.player2}</span>
							</p>
						))}
				</div>
			</div> */
}
