const prefixes = [
	"Cricket",
	"Batsman",
	"Bowler",
	"Captain",
	"AllRounder",
	"Striker",
	"Pitch",
	"Wicket",
	"Sixer",
	"Boundary",
	"Power",
	"Ace",
	"Spin",
	"Pace",
	"Yorker",
	"Thunder",
	"Blaze",
	"Blade",
	"Knight",
	"Titan",
	"Panther",
	"Blaster",
	"Fusion",
	"Maverick",
	"Flame",
	"Warrior",
	"Charger",
	"Comet",
	"Cyclone",
	"Phantom",
	"Dynamo",
	"Gladiator",
	"Hammer",
	"Inferno",
	"Lightning",
	"Shadow",
	"Vanguard",
	"Predator",
	"Sentinel",
	"Storm",
	"Guardian",
	"Falcon",
	"Tracker",
	"Eagle",
	"Sonic",
	"Trailblazer",
	"Phoenix",
	"Rebel",
	"Commander",
	"Phantom",
	"Enigma",
	"Alpha",
	"Bolt",
	"Apex",
	"Jet",
];
const suffixes = [
	"Hero",
	"Pro",
	"Master",
	"Champ",
	"Star",
	"King",
	"Legend",
	"Wizard",
	"Giant",
	"Blaze",
	"Savage",
	"Slayer",
	"Beast",
	"Daredevil",
	"Invincible",
	"Magician",
	"Hunter",
	"Warrior",
	"Conqueror",
	"Dominator",
	"Specialist",
	"Maestro",
	"Sniper",
	"Star",
	"Charger",
	"Blazer",
	"Ace",
	"Rider",
	"Tactician",
	"Pioneer",
	"Agent",
	"Vanguard",
	"Shogun",
	"Prodigy",
	"Overlord",
	"Architect",
	"Explorer",
	"Raider",
	"Seeker",
	"Scout",
	"Judge",
	"Stalker",
	"Defender",
	"Challenger",
	"Chief",
	"Elite",
	"Commander",
	"Admiral",
	"Enforcer",
	"Titan",
	"Beast",
	"Champion",
	"Gladiator",
	"Warlord",
	"Guardian",
];
const generateRandomName = () => {
	const number = Math.floor(Math.random() * 99) + 1;
	const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
	const randomSuffix = suffixes[Math.floor(Math.random() * suffixes.length)];

	return `${randomPrefix}${randomSuffix}${number}`;
};

export default generateRandomName;
