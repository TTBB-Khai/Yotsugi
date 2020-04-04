const path = require('path');
const badge = require(path.join(process.cwd(), 'res', 'data', 'badges.json'));
const fs = require('fs');
const { responder: responder } = require(path.join(process.cwd(), 'Utils', 'Responder.js'));

TTBT.registerCommand("reverse", (msg, args) => {
	
	if (typeof(badge.user.filter(user => user.id === msg.author.id)[0]) === 'undefined') {
		badge.user.push({"id": msg.author.id, "badges": [":name_badge:"]});
		fs.writeFile((path.join(process.cwd(), 'res', 'data', 'badges.json')), JSON.stringify(badge), err => {
			if (err) {
				console.log(err);
			}
		});
	}
	
	if (args.join(" ") === args.join(" ").split("").reverse().join("")
		&& !badge.user.filter(user => user.id === msg.author.id)[0].badges.find(badge => badge === ":race_car:")) 
	{
		TTBT.getDMChannel(msg.author.id).then(channel => {
			TTBT.createMessage(channel.id, responder({badge: ":race_car:"}, badge.message));
		});
		badge.user.filter(user => user.id === msg.author.id)[0].badges.push(":race_car:");
		fs.writeFile((path.join(process.cwd(), 'res', 'data', 'badges.json')), JSON.stringify(badge), err => {
			if (err) {
				console.log(err);
			}
		});
	}
	
	return args.length === 0 ? 
		"Incorrect usage. Correct usage: **" + process.env['CLIENT_PREFIX'] + "reverse [STRING HERE]**" 
		: args.join(" ").split("").reverse().join("");
},	{
		cooldown: 3000,
		caseInsensitive: true,
		cooldownMessage: "Slow down buddy! This command has a **3 second cooldown!**",
		requirements: {
			"manageMessages": true
		}
	}
);