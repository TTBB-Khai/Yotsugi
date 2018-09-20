//'use strict';

const path = require('path');
const fetch = require('node-fetch');
global.Promise = require('bluebird');

TTBT.registerCommand("lmgtfy", (msg, args) => {
	if (args.length === 0)
		return "Incorrect usage. Correct usage: **" + process.env['CLIENT_PREFIX'] + "lmgtfy [SEARCH HERE]**";
	
	TTBT.sendChannelTyping(msg.channel.id);
	
	fetch('https://tinyurl.com/api-create.php?url=https://lmgtfy.com/?q=' + args.join(" "))
	.then((response, err) => {
		if (response.ok)
			return response.text();
		else 	
			throw new TypeError("No JSON to parse!");
	})
	.then(response => {
		TTBT.createMessage(msg.channel.id, response);
	})
	.catch(err => TTBT.createMessage(msg.channel.id, "An error has occured."))
	
},	{
		cooldown: 3000,
		caseInsensitive: true,
		cooldownMessage: "Slow down buddy! This command has a **3 second cooldown!**",
		requirements: {
			"manageMessages": true
		}
	}
);