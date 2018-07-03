var reverseCommand = TTBT.registerCommand("reverse", (msg, args) => {
	return args.length === 0 ? "Incorrect usage. Correct usage: **" + process.env['CLIENT_PREFIX'] + "reverse [STRING HERE]**" : args.join(" ").split("").reverse().join("");
},	{
		cooldown: 3000,
		caseInsensitive: true,
		cooldownMessage: "Slow down buddy! This command has a **3 second cooldown!**",
		requirements: {
			"manageMessages": true
		}
	}
);