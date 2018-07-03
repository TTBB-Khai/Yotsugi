var serverCommand = TTBT.registerCommand("channel", (msg) => {
	if (!msg.channel.guild)
		return "This command only works in a server.";
	
	let channelDate = new Date(msg.channel.createdAt);
			
	return "```Markdown\n"
		+ " * CHANNEL INFO *\n"
		+ "Channel: " + msg.channel.name + "\n"
		+ "ID: " + msg.channel.id + "\n"
		+ "Topic: " + msg.channel.topic + "\n"
		+ "Creation Date: " + channelDate.toLocaleString('en-GB', { timeZone: 'UTC' }) + "\n\n"
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