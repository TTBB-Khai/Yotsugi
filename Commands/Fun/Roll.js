//'use strict';

TTBT.registerCommand("roll", (msg) => {
	let roll = ~~(Math.random() * (6 - 1 + 1)) + 1; // Generates random number from 1-6
    return ":game_die: |  " + msg.author.username + "'s roll: " + "**" + roll + "**";
},	{
		caseInsensitive: true,
		cooldown: 3000,
		cooldownMessage: "Slow down! This command has a **3 second cooldown!**",
		requirements: {
			"manageMessages": true
		}	
	}
);