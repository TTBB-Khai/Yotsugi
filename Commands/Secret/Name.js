//'use strict';

TTBT.registerCommand("name", (msg, args) => {	

	if (msg.author.id !== process.env['CLIENT_OWNERID'])
		return "This is an owner only command!";
	
	if (args.length === 0)
		return "Incorrect usage. Correct usage: **" + process.env['CLIENT_PREFIX'] + "name [NEW USERNAME]**";
	
	TTBT.editSelf({
		username: `{args.join(" ")}`
	})
	.then(() => "My name is now " + args.join(" "))
	
},	{
		cooldown: 5000,
		caseInsensitive: true,
		cooldownMessage: "Slow down buddy! This command has a **5 second cooldown!**",
		requirements: {
			"manageMessages": true
		}
	}
);
