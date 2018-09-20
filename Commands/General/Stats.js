require('moment-duration-format');
const moment = require('moment');

TTBT.registerCommand("stats", (msg) => {
	
	if (!msg.channel.guild)
		return "This command only works in a server.";
	
	 return "```\n"
		+ "- Uptime: " + moment.duration(TTBT.uptime, 'milliseconds').format('h[h] m[m] s[s]') + "\n"
		+ "- Memory Usage: " + (process.memoryUsage().heapUsed / 1000000).toFixed(2) + " MB\n"
		+ "- Guilds: " + TTBT.guilds.size + "\n"
		+ "- Channels: " + Object.keys(TTBT.channelGuildMap).length + "\n"
		+ "- Users: " + TTBT.users.size + "\n"
		+ "- Shards: " + TTBT.shards.size
		+ "\n```";
},	{
		cooldown: 5000,
		caseInsensitive: true,
		cooldownMessage: "Slow down buddy! This command has a **5 second cooldown!**",
		requirements: {
			"manageMessages": true
		}
	}
);