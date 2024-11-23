import BattingIcon from "../assets/bat.png";
import "./ScoreBarPlayerDetails.css";

import React from "react";

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
