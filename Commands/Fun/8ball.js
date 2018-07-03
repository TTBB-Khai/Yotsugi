var eightballCommand = TTBT.registerCommand("8ball", (msg, args) => {
	if(args.length === 0) {
		return "Incorrect usage. Correct usage: **" + process.env['CLIENT_PREFIX'] + "8ball [QUESTION HERE]**";
	}
	
	let roll = ~~(Math.random() * (10 - 1 + 1)) + 1; // Generates random number from 1-10
	switch(roll) {
		case 1:
			return ":8ball: " + msg.author.mention + " **| Yes**";
			break;
		case 2:
			return ":8ball: " + msg.author.mention + " **| No**";
			break;
		case 3:
			return ":8ball: " + msg.author.mention + " **| Absolutely**";
			break;
		case 4:
			return ":8ball: " + msg.author.mention + " **| Absolutely not**";
			break;
		case 5:
			return ":8ball: " + msg.author.mention + " **| Probably**";
			break;
		case 6:
			return ":8ball: " + msg.author.mention + " **| Most likely**";
			break;
		case 7:
			return ":8ball: " + msg.author.mention + " **| Eh...sure why not**";
			break;
		case 8:
			return ":8ball: " + msg.author.mention + " **| Don't count on it**";
			break;
		case 9:
			return ":8ball: " + msg.author.mention + " **| Maybe**";
			break;
		case 10:
			return ":8ball: " + msg.author.mention + " **| IDK OKAY!? I QUIT THIS STUPID JOB!**";
			break;
		default:
			return "¯\_(ツ)_/¯";
	}
},	{
		cooldown: 3000,
		caseInsensitive: true,
		cooldownMessage: "Slow down buddy! This command has a **3 second cooldown!**",
		requirements: {
			"manageMessages": true
		}
	}
);