import React from "react";
import PlayerResult from "./PlayerResult";

const ResultsModal = ({
	game,
	isLeader,
	handleHomeButtonClick,
	handleRematchButtonClick,
}) => {
	let didIWin =
		(isLeader && game.gameWinner == 0) ||
		(!isLeader && game.gameWinner == 1);
	let firstBattingTurn = (game.battingTurn + 1) % 2;
	let lastBattingTurn = game.battingTurn;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
			<div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 m-4">
				{/* Header */}
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
						onClick={handleRematchButtonClick}
						className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors">
						Rematch
					</button>
				</div>
			</div>
		</div>
	);
};

export default ResultsModal;
