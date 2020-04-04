const fetch = require('node-fetch');
const path = require('path');
const badge = require(path.join(process.cwd(), 'res', 'data', 'badges.json'));
const fs = require('fs');
const { responder: responder } = require(path.join(process.cwd(), 'Utils', 'Responder.js'));
global.Promise = require('bluebird');

TTBT.registerCommand("fortune", (msg) => {
	
	if (typeof(badge.user.filter(user => user.id === msg.author.id)[0]) === 'undefined') {
		badge.user.push({"id": msg.author.id, "badges": [":name_badge:"]});
		fs.writeFile((path.join(process.cwd(), 'res', 'data', 'badges.json')), JSON.stringify(badge), err => {
			if (err) console.log(err);
		});
	}
	
	if (!badge.user.filter(user => user.id === msg.author.id)[0].badges.find(badge => badge === ":fortune_cookie:")) {
		TTBT.getDMChannel(msg.author.id).then(channel => {
			TTBT.createMessage(channel.id, responder({badge: ":fortune_cookie:"}, badge.message));
		});
		badge.user.filter(user => user.id === msg.author.id)[0].badges.push(":fortune_cookie:");
		fs.writeFile((path.join(process.cwd(), 'res', 'data', 'badges.json')), JSON.stringify(badge), err => {
			if (err) console.log(err);
		});
	}
	
	fetch('http://www.yerkee.com/api/fortune')
	.then((response, err) => {
		if (response.ok)
			return response.json();
		else 
			throw new TypeError("No JSON to parse!");
	})
	.then(response => {
		let output = '';
		output += '```fix\n' + response.fortune + '\n' + '```';

		TTBT.createMessage(msg.channel.id, output);
	})
	.catch(err => {
		TTBT.createMessage(msg.channel.id, "An error has occured.");
		throw err;
	})
}, 	{
		cooldown: 3000,
		caseInsensitive: true,
		cooldownMessage: "Slow down buddy! This command has a **3 second cooldown!**",
		requirements: {
			"manageMessages": true
		}
	}
);