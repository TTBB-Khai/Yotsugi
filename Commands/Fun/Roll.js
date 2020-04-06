const path = require('path');
const badge = require(path.join(process.cwd(), 'res', 'data', 'badges.json'));
const output = require(path.join(process.cwd(), 'res', 'messages', 'output.json'));
const fs = require('fs');
const { responder: responder } = require(path.join(process.cwd(), 'Utils', 'Responder.js'));

TTBT.registerCommand("roll", (msg, args) => {
	
	if (typeof(badge.user.filter(user => user.id === msg.author.id)[0]) === 'undefined') {
		badge.user.push({"id": msg.author.id, "badges": [":name_badge:"]});
		fs.writeFile((path.join(process.cwd(), 'res', 'data', 'badges.json')), JSON.stringify(badge), err => {
			if (err) console.log(err);
		});
	}
	
	let roll = ~~(Math.random() * (6 - 1 + 1)) + 1; // Generates random number from 1-6
	
	if (roll === 1 && !badge.user.filter(user => user.id === msg.author.id)[0].badges.find(badge => badge === ":game_die:")) {
		TTBT.getDMChannel(msg.author.id).then(channel => {
			TTBT.createMessage(channel.id, responder({user: "You", badge: ":game_die:"}, output.badge.message));
		});
		badge.user.filter(user => user.id === msg.author.id)[0].badges.push(":game_die:");
		fs.writeFile((path.join(process.cwd(), 'res', 'data', 'badges.json')), JSON.stringify(badge), err => {
			if (err) console.log(err);
		});
	}
	
    return ":game_die: |  " + msg.author.username + "'s roll: " + "**" + roll + "**";
},	{
		caseInsensitive: true,
		cooldown: 3000,
		cooldownMessage: "Slow down! This command has a **3 second cooldown!**",
		requirements: {
			"manageMessages": true
		}	
	}
);