const path = require('path');
const badge = require(path.join(process.cwd(), 'res', 'data', 'badges.json'));
const output = require(path.join(process.cwd(), 'res', 'messages', 'output.json'));
const fs = require('fs');
const { responder: responder } = require(path.join(process.cwd(), 'Utils', 'Responder.js'));

TTBT.registerCommand("info", (msg) => {
	
	if (typeof(badge.user.filter(user => user.id === msg.author.id)[0]) === 'undefined') {
		badge.user.push({"id": msg.author.id, "badges": [":name_badge:"]});
		fs.writeFile((path.join(process.cwd(), 'res', 'data', 'badges.json')), JSON.stringify(badge), err => {
			if (err) console.log(err);
		});
	}
	
	if (!badge.user.filter(user => user.id === msg.author.id)[0].badges.find(badge => badge === ":information_source:")) {
		TTBT.createMessage(msg.channel.id, responder({user: msg.author.mention, badge: ":information_source:"}, output.badge.message));
		badge.user.filter(user => user.id === msg.author.id)[0].badges.push(":information_source:");
		fs.writeFile((path.join(process.cwd(), 'res', 'data', 'badges.json')), JSON.stringify(badge), err => {
			if (err) console.log(err);
		});
	}
	
	return "```Markdown\n * "
			+ "BOT INFO *\n"
			+ "- Bot Creator: TTBB#8359\n"
			+ "- Bot Creator ID: 124640179313967104\n\n"
			+ "- Bot Owner: " + process.env['CLIENT_OWNER'] + "\n"
			+ "- Bot Owner ID: " + process.env['CLIENT_OWNERID'] + "\n\n"
			+ "- Bot Description: " + process.env['CLIENT_DESCRIPTION'] + "\n"
			+ "- Language: node.js\n"
			+ "- Library: Eris.js by abalabahaha\n"
			+ "- Version: 0.0.1 (ALPHA) \n\n```"
},	{
		caseInsensitive: true,
		cooldown: 3000,
		cooldownMessage: "Slow down! This command has a **3 second cooldown!**",
		requirements: {
			"manageMessages": true
		}
	}
);