var avatarCommand = TTBT.registerCommand("avatar", (msg, args) => {
	if (!msg.channel.guild)
		return msg.mentions.length > 0 ? msg.mentions[0].avatarURL : msg.author.avatarURL;
	
	let getAvatar = msg.channel.guild.members.filter((mems) => { 
		return (mems.username.toLowerCase() === args.join(" ").toLowerCase()) || (mems.id === args.join(" "));
	});
	
	let avatar = args.length > 0 ?		// If there's an argument
		msg.mentions.length > 0 ? 		// If there's a mention
			msg.mentions[0].avatarURL 	// avatar = first mention
		: getAvatar.length > 0 ? 		// If there's not a mention
			getAvatar[0].avatarURL 		// avatar = getUser
		: "No user found." 				// Else, no user found
		: msg.author.avatarURL;			// If there's no arguement, avatar = author
		
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