//'use strict';

TTBT.registerCommand("kick", (msg, args) => {
	if (args.length === 0) return "Incorrect usage. Correct usage: **" + process.env['CLIENT_PREFIX'] + "kick [USER]**";
	
	let kickPerms = msg.channel.guild.members.get(TTBT.user.id).permission.has("kickMembers");
	if (!kickPerms) return "I do not have permission to kick users in this server."
	
	let getUser = msg.channel.guild.members.filter(mems => mems.username.toLowerCase() === args.join(" ").toLowerCase() || mems.id === args.join(" "));

	let user = msg.mentions.length > 0 ? msg.mentions[0] : getUser.length > 0 ? getUser[0].user : "No user found.";
	
	if (user === "No user found.") return user;
	
	TTBT.kickGuildMember(msg.channel.guild.id, user.id, "")
	.then(() => TTBT.createMessage(msg.channel.id, user.mention + " has been kicked."))
	.catch (err => TTBT.createMessage(msg.channel.id, "This user could not be kicked."))
	
},	{
		caseInsensitive: true,
		guildOnly: true,
		requirements: {
			permissions: {
				"kickMembers": true
			},
			"manageMessages": true	
		}
	}
);