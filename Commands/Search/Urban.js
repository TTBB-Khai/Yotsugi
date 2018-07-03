const fetch = require('node-fetch');

var urbanCommand = TTBT.registerCommand("urban", (msg, args) => {
	if(args.length === 0) {
		return "Incorrect usage. Correct usage: **" + process.env['CLIENT_PREFIX'] + "urban [WORD HERE]**";
	}
	
	let term = args.join(" ").replace(' ', '+');
	
	fetch('http://api.urbandictionary.com/v0/define?term=' + term)
        .then(function (channel) {
            channel.text().then(urban => {
                let urbanData = JSON.parse(urban);
				let output = '';
				
				output += urbanData.list.length > 0 ?
					"**" + urbanData.list[0].word + "**\n\n"
					+ urbanData.list[0].definition + "\n\n"
					+ "*" + urbanData.list[0].example + "*\n\n"
					+ "**by: " + urbanData.list[0].author + "**\n\n"
					+ urbanData.list[0].thumbs_up + " :thumbup: 	" + urbanData.list[0].thumbs_down + " :thumbdown:"
					: "No results found";

				TTBT.createMessage(msg.channel.id, output);					
            });
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