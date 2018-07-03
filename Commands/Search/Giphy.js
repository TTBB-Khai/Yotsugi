const fetch = require('node-fetch');

var giphyCommand = TTBT.registerCommand("gif", (msg, args) => {
	if(args.length === 0) {
		return "Incorrect usage. Correct usage: **" + process.env['CLIENT_PREFIX'] + "gif [SEARCH TAG(S) HERE]**";
	}
	
	let tags = args.join(" ").replace(' ', '+');
	
	fetch('https://api.giphy.com/v1/gifs/search?q=' + tags + '&api_key=' + process.env['GIPHY_API_KEY'] + '&fmt=json')
        .then(function (channel) {
            channel.text().then(giphy => {
                let giphyData = JSON.parse(giphy);
				let randomImage = ~~(Math.random() * (giphyData.data.length - 0 + 0)) + 0;
				let output = '';
				
				output = giphyData.data[randomImage].rating === "r" || giphyData.data[randomImage].rating == undefined ?
				"This gif cannot be shown due to it being NSFW" 
					: giphyData.data.length > 0 ? giphyData.data[randomImage].url 
						: "**No gifs found**";

				TTBT.createMessage(msg.channel.id, output);					
            });
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