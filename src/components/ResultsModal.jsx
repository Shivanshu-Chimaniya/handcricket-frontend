import React from "react";

const ResultsModal = ({players, game, isPlayer1}) => {
	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
			<div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 m-4">
				{/* Header */}
				<div className="text-center mb-6">
					<h2
						className={`text-3xl font-bold mb-2 ${
							(isPlayer1 && game.gameWinner == 0) ||
							(!isPlayer1 && game.gameWinner == 1)
								? "text-green-600"
								: "text-red-600"
						}`}>
						{(isPlayer1 && game.gameWinner == 0) ||
						(!isPlayer1 && game.gameWinner == 1)
							? "Congratulations! 🎉"
							: "Better Luck Next Time! 🎯"}
					</h2>
					<p className="text-gray-600">
						{(isPlayer1 && game.gameWinner == 0) ||
						(!isPlayer1 && game.gameWinner == 1)
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

					<div className="mb-4 last:mb-0">
						<div className="flex justify-between items-center mb-2">
							<span className="font-medium">
								{players[(game.battingTurn + 1) % 2].name}
							</span>

							<span className="text-blue-600 font-bold">
								{game.scores[(game.battingTurn + 1) % 2]} runs
							</span>
						</div>

						{/* Runs Array */}
						<div className="flex flex-wrap gap-2 mb-2">
							{game.firstInning.map((run, runIndex) => (
								<span
									key={runIndex}
									className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
									{run.player1}
								</span>
							))}
						</div>
						<div
							style={{scrollbarWidth: "none"}}
							className="flex overflow-scroll gap-2 mb-2">
							{game.firstInning.map((run, runIndex) => (
								<span
									key={runIndex}
									className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
									{run.player2}
								</span>
							))}
						</div>

						<div className="text-sm text-gray-600">
							Balls played:{" "}
							{game.spans[(game.battingTurn + 1) % 2]}
						</div>
					</div>

					<h4 className="text-lg font-semibold mb-4">
						Second Inning
					</h4>
					{/* Player Stats */}

					<div className="mb-4 last:mb-0">
						<div className="flex justify-between items-center mb-2">
							<span className="font-medium">
								{players[game.battingTurn].name}
							</span>

							<span className="text-blue-600 font-bold">
								{game.scores[game.battingTurn]} runs
							</span>
						</div>

						{/* Runs Array */}
						<div className="flex flex-wrap gap-2 mb-2">
							{game.secondInning.map((run, runIndex) => (
								<span
									key={runIndex}
									className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
									{run.player1}
								</span>
							))}
						</div>
						<div className="flex flex-wrap gap-2 mb-2">
							{game.secondInning.map((run, runIndex) => (
								<span
									key={runIndex}
									className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
									{run.player2}
								</span>
							))}
						</div>

						<div className="text-sm text-gray-600">
							Balls played: {game.spans[game.battingTurn]}
						</div>
					</div>

					{/* Total Stats */}
					{/* <div className="border-t border-gray-200 mt-4 pt-4">
						<div className="flex justify-between text-lg font-semibold">
							<span>Total Runs:</span>
							<span>{totalRuns}</span>
						</div>
						<div className="flex justify-between text-lg font-semibold">
							<span>Total Balls:</span>
							<span>{totalBalls}</span>
						</div>
					</div> */}
				</div>

				{/* Action Buttons */}
				<div className="flex gap-4">
					<button className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 rounded-lg font-semibold transition-colors">
						Home
					</button>
					<button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors">
						Rematch
					</button>
				</div>
			</div>
		</div>
	);
};

export default ResultsModal;
