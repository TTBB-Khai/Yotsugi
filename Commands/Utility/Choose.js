//'use strict';

TTBT.registerCommand("choose", (msg, args) => {
	if (args.length === 0 || args.join("").indexOf("|") < 0)
		return "Incorrect usage. Type **" + process.env['CLIENT_PREFIX'] + "help choose** for more info";
	
	let chooseArray = args.join(" ").split(" ").join("").split("|");
	let randomChoose = chooseArray[Math.random() * chooseArray.length | 0];
	
	return ":thinking: | I choose **" + randomChoose + "**";
	
},	{
		caseInsensitive: true,
		cooldown: 3000,
		cooldownMessage: "Slow down! This command has a **3 second cooldown!**",
		requirements: {
			"manageMessages": true
		}
	}
)