//'use strict';

var unbanCommand = TTBT.registerCommand("unban", (msg, args) => {
	if (args.length === 0)
		return "Incorrect usage. Correct usage: **" + process.env['CLIENT_PREFIX'] + "unban [USER ID]**";
	
	let banPerms = msg.channel.guild.members.get(TTBT.user.id).permission.has("banMembers");
	if (!banPerms) return "I do not have permission to unban users in this server."
	
	let member = args.join(" ").substr(0, args.join(" ").indexOf(' '));
	let reason = args.join(" ").substr(args.join(" ").indexOf(' for ') + 1);
	
	let userToUnban = member.length === 0 ? args.join(" ") : member;
	let reasonToUnban = reason === userToUnban ? "" : reason;
	
	if (reasonToUnban.length > 450) return "Your reason must be under 450 characters."
	
	if (!userToUnban.match(/^\d{17,21}$/)) return "Invalid ID.";
	
	let displayUser = TTBT.users.has(userToUnban) ? TTBT.users.get(userToUnban).mention : `\<@${userToUnban}\>`;
	
	msg.channel.guild.unbanMember(userToUnban, reasonToUnban)
	.then(() => TTBT.createMessage(msg.channel.id, displayUser + " has been unbanned" + reasonToUnban + "."))
	.catch(err => TTBT.createMessage(msg.channel.id, "This user could not be unbanned."))
	
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