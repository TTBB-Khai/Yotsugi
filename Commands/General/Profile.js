//'use strict';

TTBT.registerCommand("profile", (msg, args) => {
	if (!msg.channel.guild)
		return "This command only works in a server.";
	
	let getUser = msg.channel.guild.members.filter((mems) => { 
		return (mems.username.toLowerCase() === args.join(" ").toLowerCase()) || (mems.id === args.join(" "))
	});
	
	let user = args.length > 0 ?	// If there's an argument
		msg.mentions.length > 0 ? 	// If there's a mention
			msg.mentions[0] 		// user = first mention
		: getUser.length > 0 ? 		// If there's not a mention
			getUser[0].user 		// user = getUser
		: "No user found." 			// Else, no user found
		: msg.author;				// If there's no arguement, user = author

	if (user !== "No user found.") {
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
	}
	
	return user;
},	{
		caseInsensitive: true,
		cooldown: 3000,
		cooldownMessage: "Slow down! This command has a **3 second cooldown!**",
		requirements: {
			"manageMessages": true
		}
	}
);