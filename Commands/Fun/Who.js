const path = require('path');
const badge = require(path.join(process.cwd(), 'res', 'data', 'badges.json'));
const output = require(path.join(process.cwd(), 'res', 'messages', 'output.json'));
const fs = require('fs');
const { responder: responder } = require(path.join(process.cwd(), 'Utils', 'Responder.js'));

TTBT.registerCommand("who", (msg, args) => {
	
	if (typeof(badge.user.filter(user => user.id === msg.author.id)[0]) === 'undefined') {
		badge.user.push({"id": msg.author.id, "badges": [":name_badge:"]});
		fs.writeFile((path.join(process.cwd(), 'res', 'data', 'badges.json')), JSON.stringify(badge), err => {
			if (err) console.log(err);
		});
	}
	
	if(args.length === 0)
		return "Incorrect usage. Correct usage: **" + process.env['CLIENT_PREFIX'] + "who [QUESTION HERE]**";
	
	if (!msg.channel.guild)
		return "This command only works in a server";
	
	let randomUser = msg.channel.guild.members.filter(member => member.user)[Math.random() * msg.channel.guild.members.filter(member => member.user).length | 0];
	
	if (randomUser.username === msg.author.username && !badge.user.filter(user => user.id === msg.author.id)[0].badges.find(badge => badge === ":point_left:")) {
		TTBT.getDMChannel(msg.author.id).then(channel => {
			TTBT.createMessage(channel.id, responder({user: "You", badge: ":point_left:"}, output.badge.message));
		});
		badge.user.filter(user => user.id === msg.author.id)[0].badges.push(":point_left:");
		fs.writeFile((path.join(process.cwd(), 'res', 'data', 'badges.json')), JSON.stringify(badge), err => {
			if (err) console.log(err);
		});
	}
		
	return "**" + msg.author.username + "** asked:" + "*\"Who " + args.join(" ") + "?\"* \n"
		+ (randomUser.username === msg.author.username ? ":point_left:" : ":point_right:") + "| **" + randomUser.username + "**";
},	{
		cooldown: 3000,
		caseInsensitive: true,
		cooldownMessage: "Slow down buddy! This command has a **3 second cooldown!**",
		requirements: {
			"manageMessages": true
		}
	}
);