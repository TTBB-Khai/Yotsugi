//'use strict';

TTBT.registerCommand("8ball", (msg, args) => {
	if(args.length === 0)
		return "Incorrect usage. Correct usage: **" + process.env['CLIENT_PREFIX'] + "8ball [QUESTION HERE]**";

	let random = ~~(Math.random() * (9 - 0 + 1)) + 0;
	const lookupBall = {
		0: "Yes",
		1: "No",
		2: "Absolutely",
		3: "Absolutely not",
		4: "Probably",
		5: "Most Likely",
		6: "Eh...sure why not",
		7: "Don't count on it",
		8: "Maybe",
		9: "IDK OKAY!? I QUIT THIS STUPID JOB!"
	}
	
	return ":8ball: " + msg.author.mention + " **| " + lookupBall[random] + "**";
	
},	{
		cooldown: 3000,
		caseInsensitive: true,
		cooldownMessage: "Slow down buddy! This command has a **3 second cooldown!**",
		requirements: {
			"manageMessages": true
		}
	}
);