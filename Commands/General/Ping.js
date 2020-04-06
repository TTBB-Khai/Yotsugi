const path = require('path');
const badge = require(path.join(process.cwd(), 'res', 'data', 'badges.json'));
const output = require(path.join(process.cwd(), 'res', 'messages', 'output.json'));
const fs = require('fs');
const { responder: responder } = require(path.join(process.cwd(), 'Utils', 'Responder.js'));

TTBT.registerCommand("ping", (msg) => {
	
	if (typeof(badge.user.filter(user => user.id === msg.author.id)[0]) === 'undefined') {
		badge.user.push({"id": msg.author.id, "badges": [":name_badge:"]});
		fs.writeFile((path.join(process.cwd(), 'res', 'data', 'badges.json')), JSON.stringify(badge), err => {
			if (err) console.log(err);
		});
	}
	
	TTBT.createMessage(msg.channel.id, ":desktop: | **Pong!**").then(function (message) {
		message.channel.editMessage(message.id, ":desktop: | **Pong!** - " + (message.timestamp - msg.timestamp) + "ms")
	});
	
	if (!badge.user.filter(user => user.id === msg.author.id)[0].badges.find(badge => badge === ":desktop:")) {
		TTBT.createMessage(msg.channel.id, responder({user: msg.author.mention, badge: ":desktop:"}, output.badge.message));
		badge.user.filter(user => user.id === msg.author.id)[0].badges.push(":desktop:");
		fs.writeFile((path.join(process.cwd(), 'res', 'data', 'badges.json')), JSON.stringify(badge), err => {
			if (err) console.log(err);
		});
	}
	
},	{
		caseInsensitive: true
	}
);