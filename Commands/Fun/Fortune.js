//'use strict';

const fetch = require('node-fetch');
global.Promise = require('bluebird');

var fortuneCommand = TTBT.registerCommand("fortune", (msg) => {
	
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