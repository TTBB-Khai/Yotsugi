TTBT.registerCommand("test", (msg, args) => {
	return msg.channel.guild.id;
},
{ 	cooldown: 3000,
	caseInsensitive: true,
	cooldownMessage: "Slow down! This command has a **3 second cooldown!**",
    reactionButtons: [ 
        {
            emoji: "🚮",
            type: "edit",
            response: (msg) => { 
                return (msg.content - 1)
            }
        },
        {
            emoji: "💠",
            type: "edit", 
            response: (msg) => {
				return (Number(msg.content) + 1)
			}
        },
        {
            emoji: "😔",
            type: "cancel", 
			response: ["goodbye"]
        }
    ],
	requirements: {
			"manageMessages": true
	},
    reactionButtonTimeout: 30000 
});