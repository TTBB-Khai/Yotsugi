const path = require('path');
const badge = require(path.join(process.cwd(), 'res', 'data', 'badges.json'));
const fs = require('fs');
const { responder: responder } = require(path.join(process.cwd(), 'Utils', 'Responder.js'));

TTBT.registerCommand("drink", (msg, args) => {
	
	let user = "";
	let random = ~~(Math.random() * (9 - 0 + 1)) + 0;
	
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
	
	if (typeof(badge.user.filter(user => user.id === msg.author.id)[0]) === 'undefined') {
		badge.user.push({"id": msg.author.id, "badges": [":name_badge:"]});
		fs.writeFile((path.join(process.cwd(), 'res', 'data', 'badges.json')), JSON.stringify(badge), err => {
			if (err) console.log(err);
		});
	}
	
	if (msg.mentions.length > 0) {
		user = msg.mentions[0].username;
		
		if (typeof(badge.user.filter(user => user.id === msg.mentions[0].id)[0]) === 'undefined') {
			badge.user.push({"id": msg.mentions[0].id, "badges": [":name_badge:"]});
			fs.writeFile((path.join(process.cwd(), 'res', 'data', 'badges.json')), JSON.stringify(badge), err => {
				if (err) console.log(err);
			});
		}
		
		if (random === 9 && msg.mentions[0].id !== '408250314282500096'
			&& !badge.user.filter(user => user.id === msg.mentions[0].id)[0].badges.find(badge => badge === ":beers:")) 
		{
			TTBT.getDMChannel(msg.mentions[0].id).then(channel => {
				TTBT.createMessage(channel.id, responder({badge: ":beers:"}, badge.message));
			});
			badge.user.filter(user => user.id === msg.mentions[0].id)[0].badges.push(":beers:");
			fs.writeFile((path.join(process.cwd(), 'res', 'data', 'badges.json')), JSON.stringify(badge), err => {
				if (err) console.log(err);
			});
		}
	
	}
	else
		user = msg.author.mention;
	
	if (random === 7 && user === msg.author.mention && !badge.user.filter(user => user.id === msg.author.id)[0].badges.find(badge => badge === ":tea:")) {
		TTBT.getDMChannel(msg.author.id).then(channel => {
			TTBT.createMessage(channel.id, responder({badge: ":tea:"}, badge.message));
		});
		badge.user.filter(user => user.id === msg.author.id)[0].badges.push(":tea:");
		fs.writeFile((path.join(process.cwd(), 'res', 'data', 'badges.json')), JSON.stringify(badge), err => {
			if (err) console.log(err);
		});
	}
	
	return `**${user}** Drink some ${lookupDrink[random]}`;
	
},	{
		cooldown: 3000,
		caseInsensitive: true,
		cooldownMessage: "Slow down buddy! This command has a **3 second cooldown!**",
		requirements: {
			"manageMessages": true
		}
	}
);