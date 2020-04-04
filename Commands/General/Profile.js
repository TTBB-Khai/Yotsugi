//'use strict';

TTBT.registerCommand("profile", (msg, args) => {
	if (!msg.channel.guild)
		return "This command only works in a server.";
	
	let getUser = msg.channel.guild.members.filter((mems) => { 
		return (mems.username.toLowerCase() === args.join(" ").toLowerCase()) || (mems.id === args.join(" "))
	});
	
	let user = "";
	
	if (args.length > 0) {
		if (msg.mentions.length > 0)
			user = msg.mentions[0]
		else if (getUser.length > 0)
			user = getUser[0].user
		else {
			return "No user found.";
		}
	}
	else
		user = msg.author;

	let onlineStatus = msg.channel.guild.members.get(user.id).status;
	let creationDate = new Date(user.createdAt);
	let joinDate = new Date(msg.channel.guild.members.get(user.id).joinedAt);
	let nickname = msg.channel.guild.members.get(user.id).nick != null ? msg.channel.guild.members.get(user.id).nick : user.username;
	let playing = msg.channel.guild.members.get(user.id).game != null ? msg.channel.guild.members.get(user.id).game.name : "nothing";
				
	return "```Markdown\n"
			+ " * USER INFO *\n"
			+ "Username: " + user.username + '#' + user.discriminator + "\n"
			+ "Nickname: " + nickname + "\n"
			+ "ID: " + user.id + "\n"
			+ "Status: " + onlineStatus + "\n"
			+ "Playing: " + playing + "\n\n"
				
			+ " * TIME *\n"
			+ "Account Creation Date: " + creationDate + "\n"
			+ "Server Join Date: " + joinDate + "\n\n"
			+ "```";
},	{
		caseInsensitive: true,
		cooldown: 3000,
		cooldownMessage: "Slow down! This command has a **3 second cooldown!**",
		requirements: {
			"manageMessages": true
		}
	}
);