var banCommand = TTBT.registerCommand("ban", (msg, args) => {
	if (args.length === 0)
		return "Incorrect usage. Correct usage: **" + process.env['CLIENT_PREFIX'] + "ban [USER]**";
	
	let banPerms = msg.channel.guild.members.get(TTBT.user.id).permission.has("banMembers");
	if (!banPerms) 
		return "I do not have permission to ban users in this server."
	
	let member = args.join(" ").substr(0, args.join(" ").indexOf(' '));
	let reason = args.join(" ").substr(args.join(" ").indexOf(' for ') + 1);
	
	let userToBan = member.length === 0 ? args.join(" ") : member;
	let reasonToBan = reason === userToBan ? "" : reason;
	
	if (reasonToBan.length > 450) 
		return "Your reason must be under 450 characters."
	
	let getUser = msg.channel.guild.members.filter((mems) => { 
		return (mems.username.toLowerCase() === userToBan.toLowerCase()) || (mems.id === userToBan)
	});
	let user = "No user found";

	user = msg.mentions.length > 0 ? msg.mentions[0] : getUser.length > 0 ? getUser[0].user : "No user found.";
	
	if (user === "No user found.")
		return user;
	else {
		TTBT.banGuildMember(msg.channel.guild.id, user.id, 0, reasonToBan)
		.then(() => TTBT.createMessage(msg.channel.id, user.mention + " has been banned" + reasonToBan + "."))
		.catch(err => TTBT.createMessage(msg.channel.id, "This user could not be banned."))	
	}
	
},	{
		caseInsensitive: true,
		guildOnly: true,
		requirements: {
			permissions: {
				"banMembers": true
			},
			"manageMessages": true	
		}
	}
);