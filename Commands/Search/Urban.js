//'use strict';

const fetch = require('node-fetch');
global.Promise = require('bluebird');

TTBT.registerCommand("urban", (msg, args) => {
	if(args.length === 0) {
		return "Incorrect usage. Correct usage: **" + process.env['CLIENT_PREFIX'] + "urban [WORD HERE]**";
	}
	
	let term = args.join(" ").replace(' ', '+');
	
	TTBT.sendChannelTyping(msg.channel.id);
	
	fetch('http://api.urbandictionary.com/v0/define?term=' + term)
	.then((response, err) => {
		if (response.ok)
			return response.json();
		else 
			throw new TypeError("No JSON to parse!");
	})
	.then(response => {
		let output = '';
				
		output += response.list.length > 0 ?
			"**" + response.list[0].word + "**\n\n"
			+ response.list[0].definition + "\n\n"
			+ "*" + response.list[0].example + "*\n\n"
			+ "**by: " + response.list[0].author + "**\n\n"
			+ response.list[0].thumbs_up + " :thumbup: 	" + response.list[0].thumbs_down + " :thumbdown:"
		: "No results found";
		
		TTBT.createMessage(msg.channel.id, output);					
	})
	.catch(err => {
		TTBT.createMessage(msg.channel.id, "Something went wrong :/");	
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

TTBT.registerCommandAlias("ub", "urban");