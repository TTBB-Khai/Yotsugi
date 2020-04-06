const path = require('path');
const badge = require(path.join(process.cwd(), 'res', 'data', 'badges.json'));
const output = require(path.join(process.cwd(), 'res', 'messages', 'output.json'));
const fs = require('fs');
const { responder: responder } = require(path.join(process.cwd(), 'Utils', 'Responder.js'));

TTBT.registerCommand("distance", (msg, args) => {
	
	if (typeof(badge.user.filter(user => user.id === msg.author.id)[0]) === 'undefined') {
		badge.user.push({"id": msg.author.id, "badges": [":name_badge:"]});
		fs.writeFile((path.join(process.cwd(), 'res', 'data', 'badges.json')), JSON.stringify(badge), err => {
			if (err) console.log(err);
		});
	}
	
	let [measure, unit] = args.join(" ").split(' ');
	let result = 0.0;
	
	if (args.length === 0 || typeof(unit) == 'undefined') 
		return "Incorrect usage. Correct usage: **" + process.env['CLIENT_PREFIX'] + "distance [NUMBER HERE] [K/M]**";
	
	if (isNaN(measure)) 
		return "``" + measure + "`` is not a number";
	
	if (unit.charAt(0).toLowerCase() === 'k') {
		result = (measure / 2) + ((measure / 2) / 4);
		result = Math.round(result * 100) / 100;
		
		if (result === 240250 && !badge.user.filter(user => user.id === msg.author.id)[0].badges.find(badge => badge === ":rocket:")) {
			TTBT.getDMChannel(msg.author.id).then(channel => {
				TTBT.createMessage(channel.id, responder({user: "You", badge: ":rocket:"}, output.badge.message));
			});
			badge.user.filter(user => user.id === msg.author.id)[0].badges.push(":rocket:");
			fs.writeFile((path.join(process.cwd(), 'res', 'data', 'badges.json')), JSON.stringify(badge), err => {
				if (err) console.log(err);
			});
		}	
		
		return ":rocket: | **" + result + " MILES**";
	}
	else if (unit.charAt(0).toLowerCase() === 'm') {
		result = (measure / 5) * 8
		result = Math.round(result * 100) / 100;
		
		if (result === 384400 && !badge.user.filter(user => user.id === msg.author.id)[0].badges.find(badge => badge === ":rocket:")) {
			TTBT.getDMChannel(msg.author.id).then(channel => {
				TTBT.createMessage(channel.id, responder({user: "You", badge: ":rocket:"}, output.badge.message));
			});
			badge.user.filter(user => user.id === msg.author.id)[0].badges.push(":rocket:");
			fs.writeFile((path.join(process.cwd(), 'res', 'data', 'badges.json')), JSON.stringify(badge), err => {
				if (err) console.log(err);
			});
		}
		
		return ":rocket: | **" + result + " KM**";
	}
	
	return "Incorrect usage. Correct usage: **" + process.env['CLIENT_PREFIX'] + "distance [NUMBER HERE] [K/M]**";
},	{
		cooldown: 3000,
		caseInsensitive: true,
		cooldownMessage: "Slow down buddy! This command has a **3 second cooldown!**",
		requirements: {
			"manageMessages": true
		}
	}
);

TTBT.registerCommandAlias("dist", "distance");