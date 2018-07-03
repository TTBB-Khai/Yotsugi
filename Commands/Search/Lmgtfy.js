const gm = require('gm');
const path = require('path');
const fetch = require('node-fetch');

var lmgtfyCommand = TTBT.registerCommand("lmgtfy", (msg, args) => {
	if (args.length === 0)
		return "Incorrect usage. Correct usage: **" + process.env['CLIENT_PREFIX'] + "lmgtfy [SEARCH HERE]**";
	
	let search = args.join(" ").replace(" ", "+").replace("+", "%2B");
	
	// .replace("\"", "%22").replace("#", "%23").replace("$", "%24").replace("%", "%25").replace("'", "%27")
	// .replace("*", "%2A").replace(",", "%2C").replace("/", "%2F").replace("@", "%40").replace("^", "5E").replace("\\","%5C")
	// .replace(":", "%3A").replace(";", "%3B")

	async function getURL() {
		try {
			let response = await fetch('https://tinyurl.com/api-create.php?url=https://lmgtfy.com/?q=' + search);
			return await response.text();
		}
		catch (err) {
			TTBT.createMessage(msg.channel.id, "Failed to load lmgtfy.com");
			throw err;
		}
	}
	
	TTBT.sendChannelTyping(msg.channel.id);
	
	Promise.resolve(getURL()).then(data => {
		TTBT.createMessage(msg.channel.id, data);
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