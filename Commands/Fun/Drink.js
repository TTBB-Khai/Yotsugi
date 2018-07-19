//'use strict';

var drinkCommand = TTBT.registerCommand("drink", (msg, args) => {
	let random = ~~(Math.random() * (10 - 1 + 1)) + 1; // Generates random number from 1-10
	let user = msg.mentions.length > 0 ? msg.mentions[0].mention : msg.author.mention;
	const lookupDrink = {
		1: ":beer:",
		2: ":milk:",
		3: ":sake:",
		4: ":whisky:",
		5: ":cocktail:",
		6: ":tropical_drink:",
		7: ":champagne:",
		8: ":tea:",
		9: ":coffee:",
		10: ":beers:"
	}
	
	return "**" + user + " Drink some** " + lookupDrink[random];
},	{
		cooldown: 3000,
		caseInsensitive: true,
		cooldownMessage: "Slow down buddy! This command has a **3 second cooldown!**",
		requirements: {
			"manageMessages": true
		}
	}
);