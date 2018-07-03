var iconCommand = TTBT.registerCommand("icon", (msg) => {
    return msg.channel.guild ? msg.channel.guild.iconURL : "This command only works in a server";
},	{
		caseInsensitive: true,
		cooldown: 3000,
		cooldownMessage: "Slow down! This command has a **3 second cooldown!**",
		requirements: {
			"manageMessages": true
		}
	}
);