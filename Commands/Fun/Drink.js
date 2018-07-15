//'use strict';

var drinkCommand = TTBT.registerCommand("drink", (msg, args) => {
	let drink = ~~(Math.random() * (10 - 1 + 1)) + 1; // Generates random number from 1-10
	let user = msg.mentions.length > 0 ? msg.mentions[0].mention : msg.author.mention;
		
	switch(drink) {
		case 1:
			return "**" + user + " Drink some** :beer:";
			break;
		case 2:
			return "**" + user + " Drink some** :milk:";
			break;
		case 3:
			return "**" + user + " Drink some** :sake:";
			break;
		case 4:
			return "**" + user + " Drink some** whisky:";
			break;
		case 5:
			return "**" + user + " Drink some** :cocktail:";
			break;
		case 6:
			return "**" + user + " Drink some** :tropical_drink:";
			break;
		case 7:
			return "**" + user + " Drink some** :champagne:";
			break;
		case 8:
			return "**" + user + " Drink some** :tea:";
			break;
		case 9:
			return "**" + user + " Drink some** :coffee:";
			break;
		case 10:
			return "**" + user + " Drink some** :beers:";
			break;
		default:
			return "¯\_(ツ)_/¯";
	}
},	{
		cooldown: 3000,
		caseInsensitive: true,
		cooldownMessage: "Slow down buddy! This command has a **3 second cooldown!**",
		requirements: {
			"manageMessages": true
		}
	}
);