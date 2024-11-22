import React from "react";
import Modal from "./Modal";

const LeaderboardModal = ({isOpen, onClose}) => (
	<Modal isOpen={isOpen} onClose={onClose} title="Example Leaderboard">
		<div className="space-y-4">Nothing to see here...</div>
	</Modal>
);

export default LeaderboardModal;
