//'use strict';

TTBT.registerCommand("avatar", (msg, args) => {
	if (!msg.channel.guild)
		return msg.mentions.length > 0 ? msg.mentions[0].avatarURL : msg.author.avatarURL;
	
	let getAvatar = msg.channel.guild.members.filter((mems) => { 
		return (mems.username.toLowerCase() === args.join(" ").toLowerCase()) || (mems.id === args.join(" "));
	});
	
	let avatar = "";
	
	if (args.length > 0) {
		if (msg.mentions.length > 0)
			avatar = msg.mentions[0].avatarURL;
		else if (getAvatar.length > 0)
			avatar = getAvatar[0].avatarURL;
		else
			avatar = "No user found.";
	}
	else
		avatar = msg.author.avatarURL;
		
	return avatar;
	
},	{
		caseInsensitive: true,
		cooldown: 3000,
		cooldownMessage: "Slow down! This command has a **3 second cooldown!**",
		requirements: {
			"manageMessages": true
		}
	}
);