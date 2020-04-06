require('moment-duration-format');
const moment = require('moment');
const path = require('path');
const badge = require(path.join(process.cwd(), 'res', 'data', 'badges.json'));
const output = require(path.join(process.cwd(), 'res', 'messages', 'output.json'));
const fs = require('fs');
const { responder: responder } = require(path.join(process.cwd(), 'Utils', 'Responder.js'));

TTBT.registerCommand("stats", (msg) => {
	
	if (typeof(badge.user.filter(user => user.id === msg.author.id)[0]) === 'undefined') {
		badge.user.push({"id": msg.author.id, "badges": [":name_badge:"]});
		fs.writeFile((path.join(process.cwd(), 'res', 'data', 'badges.json')), JSON.stringify(badge), err => {
			if (err) console.log(err);
		});
	}
	
	if (!msg.channel.guild)
		return "This command only works in a server.";
	
	if (!badge.user.filter(user => user.id === msg.author.id)[0].badges.find(badge => badge === ":bar_chart:")) {
		TTBT.createMessage(msg.channel.id, responder({user: msg.author.mention, badge: ":bar_chart:"}, output.badge.message));
		badge.user.filter(user => user.id === msg.author.id)[0].badges.push(":bar_chart:");
		fs.writeFile((path.join(process.cwd(), 'res', 'data', 'badges.json')), JSON.stringify(badge), err => {
			if (err) console.log(err);
		});
	}
	
	 return "```\n"
		+ "- Uptime: " + moment.duration(TTBT.uptime, 'milliseconds').format('h[h] m[m] s[s]') + "\n"
		+ "- Memory Usage: " + (process.memoryUsage().heapUsed / 1000000).toFixed(2) + " MB\n"
		+ "- Guilds: " + TTBT.guilds.size + "\n"
		+ "- Channels: " + Object.keys(TTBT.channelGuildMap).length + "\n"
		+ "- Users: " + TTBT.users.size + "\n"
		+ "- Shards: " + TTBT.shards.size
		+ "\n```";
},	{
		cooldown: 5000,
		caseInsensitive: true,
		cooldownMessage: "Slow down buddy! This command has a **5 second cooldown!**",
		requirements: {
			"manageMessages": true
		}
	}
);