//'use strict';

TTBT.registerCommand("drink", (msg, args) => {
	let random = ~~(Math.random() * (9 - 0 + 1)) + 0;
	let user = msg.mentions.length > 0 ? msg.mentions[0].mention : msg.author.mention;
	const lookupDrink = {
		0: ":beer:",
		1: ":milk:",
		2: ":sake:",
		3: ":whisky:",
		4: ":cocktail:",
		5: ":tropical_drink:",
		6: ":champagne:",
		7: ":tea:",
		8: ":coffee:",
		9: ":beers:"
	}
	
	return `**${user} Drink some **${lookupDrink[random]}`;
},	{
		cooldown: 3000,
		caseInsensitive: true,
		cooldownMessage: "Slow down buddy! This command has a **3 second cooldown!**",
		requirements: {
			"manageMessages": true
		}
	}
);