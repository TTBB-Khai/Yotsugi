//'use strict';

var eightballCommand = TTBT.registerCommand("8ball", (msg, args) => {
	if(args.length === 0)
		return "Incorrect usage. Correct usage: **" + process.env['CLIENT_PREFIX'] + "8ball [QUESTION HERE]**";

	let random = ~~(Math.random() * (10 - 1 + 1)) + 1; // Generates random number from 1-10
	const lookupBall = {
		1: "Yes",
		2: "No",
		3: "Absolutely",
		4: "Absolutely not",
		5: "Probably",
		6: "Most Likely",
		7: "Eh...sure why not",
		8: "Don't count on it",
		9: "Maybe",
		10: "IDK OKAY!? I QUIT THIS STUPID JOB!"
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