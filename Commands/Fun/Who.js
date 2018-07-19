//'use strict';

TTBT.registerCommand("who", (msg, args) => {
	if(args.length === 0)
		return "Incorrect usage. Correct usage: **" + process.env['CLIENT_PREFIX'] + "who [QUESTION HERE]**";
	
	if (!msg.channel.guild)
		return "This command only works in a server";
	
	let randomUser = msg.channel.guild.members.filter(member => member.user)[Math.random() * msg.channel.guild.members.filter(member => member.user).length | 0];
	return "**" + msg.author.username + "** asked:" + "*\"Who " + args.join(" ") + "?\"* \n"
		+ ":point_right: | **" + randomUser.username + "**";
},	{
		cooldown: 3000,
		caseInsensitive: true,
		cooldownMessage: "Slow down buddy! This command has a **3 second cooldown!**",
		requirements: {
			"manageMessages": true
		}
	}
);