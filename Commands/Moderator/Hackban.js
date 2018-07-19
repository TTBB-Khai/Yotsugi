//'use strict';

TTBT.registerCommand("hackban", (msg, args) => {
	if (args.length === 0)
		return "Incorrect usage. Correct usage: **" + process.env['CLIENT_PREFIX'] + "hackban [USER ID]**";
	
	let banPerms = msg.channel.guild.members.get(TTBT.user.id).permission.has("banMembers");
	if (!banPerms) return "I do not have permission to ban users in this server."
	
	let member = args.join(" ").substr(0, args.join(" ").indexOf(' '));
	let reason = args.join(" ").substr(args.join(" ").indexOf(' for ') + 1);
	
	let userToBan = member.length === 0 ? args.join(" ") : member;
	let reasonToBan = reason === userToBan ? "" : reason;
	
	if (reasonToBan.length > 450) return "Your reason must be under 450 characters."
	
	if (!userToBan.match(/^\d{17,21}$/)) return "Invalid ID";
	
	let displayUser = TTBT.users.has(userToBan) ? TTBT.users.get(userToBan).mention : `\<@${userToBan}\>`;
	
	msg.channel.guild.banMember(userToBan, 0, reasonToBan)
	.then(() => TTBT.createMessage(msg.channel.id, displayUser + " has been banned" + reasonToBan + "."))
	.catch(err => TTBT.createMessage(msg.channel.id, "This user could not be banned."))
	
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