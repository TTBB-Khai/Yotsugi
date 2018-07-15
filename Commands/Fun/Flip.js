//'use strict';

var flipCommand = TTBT.registerCommand("flip", (msg) => {
	let flip = ~~(Math.random() * (2 - 1 + 1)) + 1;
	let coin = flip === 2 ? "**Heads!**" : "**Tails!**";
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