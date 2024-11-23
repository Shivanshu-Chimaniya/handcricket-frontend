import React, {useState} from "react";
import PlayerResult from "./PlayerResult";
import {Crown, Copy, Loader2} from "lucide-react";

const ResultsModal = ({
	game,
	isLeader,
	handleHomeButtonClick,
	handleRematchButtonClick,
}) => {
	let [wantToRematch, setWantToRematch] = useState(false);
	let didIWin =
		(isLeader && game.gameWinner == 0) ||
		(!isLeader && game.gameWinner == 1);
	let firstBattingTurn = (game.battingTurn + 1) % 2;
	let lastBattingTurn = game.battingTurn;
	let isDraw = game.gameWinner == -1;
	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
			<div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 m-4">
				{/* Header */}
				{isDraw ? (
					<div className="text-center mb-6">
						<h2 className="text-3xl font-bold mb-2 text-red-600">
							It's a Draw! 🤝
						</h2>
						<p className="text-gray-600">
							What a thrilling match! Both sides played
							exceptionally well.
						</p>
					</div>
				) : (
					<div className="text-center mb-6">
						<h2
							className={`text-3xl font-bold mb-2 ${
								didIWin ? "text-green-600" : "text-red-600"
							}`}>
							{didIWin
								? "Congratulations! 🎉"
								: "Better Luck Next Time! 🎯"}
						</h2>
						<p className="text-gray-600">
							{didIWin
								? "You won the match!"
								: "Get better and try again!"}
						</p>
					</div>
				)}
				{/*  */}

				{/* Stats Section */}
				<div className="bg-gray-50 rounded-lg p-4 mb-6">
					<h3 className="text-lg font-semibold mb-4">
						Match Statistics
					</h3>
					<h4 className="text-lg font-semibold mb-4">First Inning</h4>
					{/* Player Stats */}

					<PlayerResult
						Inning={game.firstInning}
						battingTurn={firstBattingTurn}
						playerName={game.players[firstBattingTurn].playerName}
						playerScore={game.scores[firstBattingTurn]}
						playerSpan={game.spans[firstBattingTurn]}
					/>

					<h4 className="text-lg font-semibold mb-4">
						Second Inning
					</h4>
					{/* Player Stats */}

					<PlayerResult
						Inning={game.secondInning}
						battingTurn={lastBattingTurn}
						playerName={game.players[lastBattingTurn].playerName}
						playerScore={game.scores[lastBattingTurn]}
						playerSpan={game.spans[lastBattingTurn]}
					/>
				</div>

				{/* Action Buttons */}
				<div className="flex gap-4">
					<button
						onClick={handleHomeButtonClick}
						className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 rounded-lg font-semibold transition-colors">
						Home
					</button>
					<button
						onClick={() => {
							setWantToRematch(true);
							handleRematchButtonClick();
						}}
						className={`flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors ${
							wantToRematch && "bg-blue-700"
						}`}>
						{wantToRematch ? (
							<span className="flex gap-4 justify-center">
								Waiting
								<Loader2 className="animate-spin animate-fade-in" />
							</span>
						) : (
							"Rematch"
						)}
					</button>
				</div>
			</div>
		</div>
	);
};

export default ResultsModal;
