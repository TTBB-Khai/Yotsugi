const path = require('path');
const badge = require(path.join(process.cwd(), 'res', 'data', 'badges.json'));
const output = require(path.join(process.cwd(), 'res', 'messages', 'output.json'));
const fs = require('fs');
const { responder: responder } = require(path.join(process.cwd(), 'Utils', 'Responder.js'));

TTBT.registerCommand("channel", (msg) => {
	
	if (typeof(badge.user.filter(user => user.id === msg.author.id)[0]) === 'undefined') {
		badge.user.push({"id": msg.author.id, "badges": [":name_badge:"]});
		fs.writeFile((path.join(process.cwd(), 'res', 'data', 'badges.json')), JSON.stringify(badge), err => {
			if (err) console.log(err);
		});
	}
	
	if (!msg.channel.guild)
		return "This command only works in a server.";
	
	let channelDate = new Date(msg.channel.createdAt);
	
	if (!badge.user.filter(user => user.id === msg.author.id)[0].badges.find(badge => badge === ":tv:")) {
		TTBT.createMessage(msg.channel.id, responder({user: msg.author.mention, badge: ":tv:"}, output.badge.message));
		badge.user.filter(user => user.id === msg.author.id)[0].badges.push(":tv:");
		fs.writeFile((path.join(process.cwd(), 'res', 'data', 'badges.json')), JSON.stringify(badge), err => {
			if (err) console.log(err);
		});
	}
			
	return "```Markdown\n"
		+ " * CHANNEL INFO *\n"
		+ "Channel: " + msg.channel.name + "\n"
		+ "ID: " + msg.channel.id + "\n"
		+ "Topic: " + msg.channel.topic + "\n"
		+ "Creation Date: " + channelDate.toLocaleString('en-GB', { timeZone: 'UTC' }) + "\n\n"
		+ "```";
		
},	{
		caseInsensitive: true,
		cooldown: 3000,
		cooldownMessage: "Slow down! This command has a **3 second cooldown!**",
		requirements: {
			"manageMessages": true
		}
	}
);