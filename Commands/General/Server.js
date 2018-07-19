//'use strict';

TTBT.registerCommand("server", (msg) => {
	if (!msg.channel.guild)
		return "This command only works in a server.";
	
	let guildDate = new Date(msg.channel.guild.createdAt);
	let channelDate = new Date(msg.channel.createdAt);
			
	return "```Markdown\n"
		+ " * SERVER INFO *\n"
		+ "Server: " + msg.channel.guild.name + "\n"
		+ "ID: " + msg.channel.guild.id + "\n"
		+ "Owner: " + msg.channel.guild.members.get(msg.channel.guild.ownerID).user.username + "\n"
		+ "Region: " + msg.channel.guild.region + "\n"
		+ "Creation Date: " + guildDate.toLocaleString('en-GB', { timeZone: 'UTC' }) + "\n\n "
				
		+ " * CHANNEL STATS *\n"
		+ "Text: " + msg.channel.guild.channels.filter(channel => channel.type === 0).length + "\n"
		+ "Voice: " + msg.channel.guild.channels.filter(channel => channel.type === 2).length + "\n"
		+ "Total Channels: " 
		+ (msg.channel.guild.channels.filter(channel => channel.type === 0).length + msg.channel.guild.channels.filter(channel => channel.type === 2).length) + "\n\n"
						
		+ " * USER STATS *\n"
		+ "Total Members: " + msg.channel.guild.memberCount + "\n"
		+ "Humans: " + (msg.channel.guild.memberCount - msg.channel.guild.members.filter(member => member.user.bot).length) + "\n"
		+ "Bots: " + msg.channel.guild.members.filter(member => member.user.bot).length + "\n"
		+ "Online: " +  msg.channel.guild.members.filter(member => member.status === "online").length + "\n"
		+ "Idle: " +  msg.channel.guild.members.filter(member => member.status === "idle").length + "\n"
		+ "DnD: " +  msg.channel.guild.members.filter(member => member.status === "dnd").length + "\n"
		+ "Offline/Invisible: " + msg.channel.guild.members.filter(member => member.status === "offline").length + "\n"
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