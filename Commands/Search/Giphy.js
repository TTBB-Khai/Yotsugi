//'use strict';

const fetch = require('node-fetch');
global.Promise = require('bluebird');

var giphyCommand = TTBT.registerCommand("gif", (msg, args) => {
	if(args.length === 0)
		return "Incorrect usage. Correct usage: **" + process.env['CLIENT_PREFIX'] + "gif [SEARCH TAG(S) HERE]**";
	
	let tags = args.join(" ").replace(' ', '+');
	
	TTBT.sendChannelTyping(msg.channel.id);
	
	fetch('https://api.giphy.com/v1/gifs/search?q=' + tags + '&api_key=' + process.env['GIPHY_API_KEY'] + '&fmt=json')
	.then((response, err) => {
		if (response.ok)
			return response.json();
		else 	
			throw new TypeError("No JSON to parse!");
	})
	.then(response => {
		if (response.pagination.total_count > 0) {
			let randomImage = ~~(Math.random() * (response.data.length - 0 + 0)) + 0;
			let output = response.data[randomImage].rating === "r" || response.data[randomImage].rating == undefined ?
			"This gif cannot be shown due to it being NSFW" 
				: response.data.length > 0 ? response.data[randomImage].url 
					: "No gifs found";

			TTBT.createMessage(msg.channel.id, output);
		}
		else
			TTBT.createMessage(msg.channel.id, "No gifs found");
	})
	.catch(err => {
		if (msg.author.id === process.env['CLIENT_OWNERID'])
			TTBT.createMessage(msg.channel.id, "You have not set up this command! To do so, please refer to the README.");
		else
			TTBT.createMessage(msg.channel.id, "The owner of this bot does not have this command enabled yet!");
		throw err;
	})
	
}, {
		cooldown: 3000,
		caseInsensitive: true,
		cooldownMessage: "Slow down buddy! This command has a **3 second cooldown!**",
		requirements: {
			"manageMessages": true
		}
	}
);

TTBT.registerCommandAlias("giphy", "gif");