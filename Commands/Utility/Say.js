//'use strict';

TTBT.registerCommand("say", (msg, args) => {
	msg.delete();
	if (msg.author.id === process.env['CLIENT_OWNERID'])
		return args.length === 0 ? "Incorrect usage. Correct usage: **" + process.env['CLIENT_PREFIX'] + "say [STRING HERE]**" : args.join(" ");
},	{
		cooldown: 3000,
		caseInsensitive: true,
		cooldownMessage: "Slow down buddy! This command has a **3 second cooldown!**",
		requirements: {
			"manageMessages": true
		}
	}
);