// const HalfTimeModal = ({runs, totalRuns, timer, switchedInning}) => {
// 	const totalScore = totalRuns;
// 	const totalBalls = runs.length;

// 	useEffect(() => {
// 		const countdown = setInterval(() => {
// 			setTimeLeft((prev) => {
// 				if (prev <= 1) {
// 					clearInterval(countdown);
// 					setIsOpen(false);
// 					switchedInning();
// 					return 0;
// 				}
// 				return prev - 1;
// 			});
// 		}, 1000);

// 		return () => {
// 			clearInterval(countdown);
// 		};
// 	}, []);

// 	return (
// 		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
// 			<div className="bg-white p-6 rounded-lg shadow-xl w-96">
// 				<div className="flex justify-between items-center mb-4">
// 					<h2 className="text-xl font-bold">Batsmen Performance</h2>
// 					<span className="text-red-500 font-bold">{timeLeft}s</span>
// 				</div>
// 				<div
// 					style={{scrollbarWidth: "none"}}
// 					className="flex flex-row justify-center gap-1 mb-4 overflow-scroll">
// 					{runs.map((run, index) => (
// 						<div
// 							key={index}
// 							className="text-center p-2 bg-blue-100 rounded">
// 							{run.player1}
// 						</div>
// 					))}
// 				</div>
// 				<div
// 					style={{scrollbarWidth: "none"}}
// 					className="flex flex-row justify-center gap-1 mb-4 overflow-scroll">
// 					{runs.map((run, index) => (
// 						<div
// 							key={index}
// 							className="text-center p-2 bg-blue-100 rounded">
// 							{run.player2}
// 						</div>
// 					))}
// 				</div>
// 				<div className="border-t pt-4">
// 					<div className="flex justify-between">
// 						<span>Total Score:</span>
// 						<span className="font-bold">{totalScore}</span>
// 					</div>
// 					<div className="flex justify-between">
// 						<span>Balls Played:</span>
// 						<span className="font-bold">{totalBalls}</span>
// 					</div>
// 				</div>
// 			</div>
// 		</div>
// 	);
// };

// export default HalfTimeModal;
import React, {useState, useEffect} from "react";

const HalfTimeModal = ({players, game, isPlayer1, timer, switchedInning}) => {
	const [timeLeft, setTimeLeft] = useState(timer);
	const [isOpen, setIsOpen] = useState(true);

	useEffect(() => {
		const countdown = setInterval(() => {
			setTimeLeft((prev) => {
				if (prev <= 1) {
					clearInterval(countdown);
					setIsOpen(false);
					switchedInning();
					return 0;
				}
				return prev - 1;
			});
		}, 1000);

		return () => {
			clearInterval(countdown);
		};
	}, []);
	if (!isOpen) return null;
	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
			<div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 m-4">
				{/* Header */}
				<div className="text-center mb-6">
					<h2
						className={`text-3xl font-bold mb-2 ${
							(isPlayer1 && game.battingTurn == 0) ||
							(!isPlayer1 && game.battingTurn == 1)
								? "text-green-600"
								: "text-red-600"
						}`}>
						{(isPlayer1 && game.battingTurn == 0) ||
						(!isPlayer1 && game.battingTurn == 1)
							? "Your Time to Shine! 🎉"
							: "Great Job at the Crease! 🎯"}
					</h2>
					<p className="text-gray-600">
						{(isPlayer1 && game.battingTurn == 0) ||
						(!isPlayer1 && game.battingTurn == 1)
							? `${
									players[(game.battingTurn + 1) % 2].name
							  } has set a target of ${
									game.scores[(game.battingTurn + 1) % 2]
							  } runs. It's time to step up and chase it down!`
							: `Don't let ${
									players[game.battingTurn].name
							  } chase it down! Every ball counts. Bring your best!`}
					</p>
				</div>

				{/* Stats Section */}
				<div className="bg-gray-50 rounded-lg p-4 mb-6">
					<h3 className="text-lg font-semibold mb-4">Summary</h3>
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

					{/* Total Stats */}
					<div className="border-t border-gray-200 mt-4 pt-4">
						<div className="flex justify-between text-lg font-semibold">
							<span>Target Score:</span>
							<span>
								{game.scores[(game.battingTurn + 1) % 2]}
							</span>
						</div>
					</div>
				</div>

				{/* Action Buttons */}
				<div className="flex gap-4">
					<button className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 rounded-lg font-semibold transition-colors">
						Second Inning Begins in {timeLeft} seconds.
					</button>
					{/* <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors">
						Rematch
					</button> */}
				</div>
			</div>
		</div>
	);
};

export default HalfTimeModal;
