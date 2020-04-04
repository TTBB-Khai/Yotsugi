const path = require('path');
const badge = require(path.join(process.cwd(), 'res', 'data', 'badges.json'));
const fs = require('fs');
const { responder: responder } = require(path.join(process.cwd(), 'Utils', 'Responder.js'));

TTBT.registerCommand("temperature", (msg, args) => {
	
	if (typeof(badge.user.filter(user => user.id === msg.author.id)[0]) === 'undefined') {
		badge.user.push({"id": msg.author.id, "badges": [":name_badge:"]});
		fs.writeFile((path.join(process.cwd(), 'res', 'data', 'badges.json')), JSON.stringify(badge), err => {
			if (err) console.log(err);
		});
	}
	
	if(args.length === 0)
		return "Incorrect usage. Correct usage: **" + process.env['CLIENT_PREFIX'] + "temperature [NUMBER HERE] [C/F]**";
	
	let [measure, unit] = args.join(" ").split(' ');
	let result = 0.0;
	
	if (isNaN(measure))
		return  "``" + measure + "`` is not a number";
	
	if (typeof(unit) == 'undefined')
		return "``" + unit + "`` is not a unit. Use C or F instead";
	
	if (unit.charAt(0).toLowerCase() === 'c') {
		result = (measure * 1.8) + 32;
		result = Math.round(result * 100) / 100;
		
		if (result === -459.67 && !badge.user.filter(user => user.id === msg.author.id)[0].badges.find(badge => badge === ":thermometer:")) {
			TTBT.getDMChannel(msg.author.id).then(channel => {
				TTBT.createMessage(channel.id, responder({badge: ":thermometer:"}, badge.message));
			});
			badge.user.filter(user => user.id === msg.author.id)[0].badges.push(":thermometer:");
			fs.writeFile((path.join(process.cwd(), 'res', 'data', 'badges.json')), JSON.stringify(badge), err => {
				if (err) console.log(err);
			});
		}
	
		return ":thermometer: | **" + result + "°F**";
	}
	else if (unit.charAt(0).toLowerCase() === 'f') {
		result = (measure - 32) / 1.8;
		result = Math.round(result * 100) / 100;
		
		if (result === -273.15 && !badge.user.filter(user => user.id === msg.author.id)[0].badges.find(badge => badge === ":thermometer:")) {
			TTBT.getDMChannel(msg.author.id).then(channel => {
				TTBT.createMessage(channel.id, responder({badge: ":thermometer:"}, badge.message));
			});
			badge.user.filter(user => user.id === msg.author.id)[0].badges.push(":thermometer:");
			fs.writeFile((path.join(process.cwd(), 'res', 'data', 'badges.json')), JSON.stringify(badge), err => {
				if (err) console.log(err);
			});
		}
		
		return ":thermometer: | **" + result + "°C**";
	}
		
	return "Incorrect usage. Correct usage: **" + process.env['CLIENT_PREFIX'] + "temperature [NUMBER HERE] [C/F]**";
},	{
		cooldown: 3000,
		caseInsensitive: true,
		cooldownMessage: "Slow down buddy! This command has a **3 second cooldown!**",
		requirements: {
			"manageMessages": true
		}
	}
);

TTBT.registerCommandAlias("temp", "temperature");