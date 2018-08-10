//'use strict';

TTBT.registerCommand("flip", (msg) => {
	let flip = ~~(Math.random() * (1 - 0 + 1)) + 0;
	let coin = flip === 1 ? "**Heads!**" : "**Tails!**";
	return msg.author.username + "'s flip: " + coin;
},	{
		caseInsensitive: true,
		cooldown: 3000,
		cooldownMessage: "Slow down! This command has a **3 second cooldown!**",
		requirements: {
			"manageMessages": true
		}
	}
);