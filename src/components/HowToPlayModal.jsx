import React from "react";
import Modal from "./Modal";
const HowToPlayModal = ({isOpen, onClose}) => (
	<Modal isOpen={isOpen} onClose={onClose} title="Example How to Play">
		<div className="space-y-4">
			<div>
				<h3 className="font-bold mb-2">1. Getting Started</h3>
				<p className="text-gray-600">
					First, players engage in Rock-Paper-Scissors to decide who
					bats first.
				</p>
			</div>
			<div>
				<h3 className="font-bold mb-2">2. Gameplay</h3>
				<p className="text-gray-600">
					Players choose numbers from 1 to 6. If the numbers match,
					the batting player is out!
				</p>
			</div>
			<div>
				<h3 className="font-bold mb-2">3. Scoring</h3>
				<p className="text-gray-600">
					The batting player scores runs equal to their chosen number
					if it doesn't match the bowler's number.
				</p>
			</div>
		</div>
	</Modal>
);

export default HowToPlayModal;
