//'use strict';

var clapCommand = TTBT.registerCommand("clap", (msg, args) => {
	return args.length !== 0 ? "** :clap: " + args.join(" ").replace(/(?!^)\s+/g, ' :clap: ') + " :clap: **" : ":clap:";
},	{
		cooldown: 3000,
		caseInsensitive: true,
		cooldownMessage: "Slow down buddy! This command has a **3 second cooldown!**",
		requirements: {
			"manageMessages": true
		}
	}
);