const fetch = require('node-fetch');

var maniaCommand = TTBT.registerCommand("mania", (msg, args) => {
	if(args.length === 0) {
		return "Incorrect usage. Correct usage: **" + process.env['CLIENT_PREFIX'] + "mania [OSU USERNAME HERE]**";
	}
	
	fetch('https://osu.ppy.sh/api/get_user?u=' + args.join(" ") + '&k=' + process.env['OSU_API_KEY'] + '&m=3')
        .then(function (channel) {
            channel.text().then(mania => {
                let maniaData = JSON.parse(mania);
				if (maniaData.length > 0) {
					TTBT.createMessage(msg.channel.id, "```Markdown\n" 
									+ " * USER INFO *\n" 
									+ "User: " + maniaData[0].username + "\n" 
									+ "ID: " + maniaData[0].user_id + "\n\n"

									+ " * COUNTRY INFO *\n" 
									+ "Country: " + maniaData[0].country + "\n" 
									+ "Country Rank: " + maniaData[0].pp_country_rank + "\n\n"

									+ " * RANK INFO *\n" 
									+ "Ranked Score: " + maniaData[0].ranked_score + "\n" 
									+ "PP Rank: " + maniaData[0].pp_rank + "\n" 
									+ "Total Score: " + maniaData[0].total_score + "\n\n"

									+ " * PLAY INFO *\n" 
									+ "Play Count: " + maniaData[0].playcount + "\n" 
									+ "Level: " + maniaData[0].level + "\n" 
									+ "Accuracy: " + maniaData[0].accuracy + "\n\n"

									+ " * GRADE INFO *\n" 
									+ "SS: " + maniaData[0].count_rank_ss
									+ " | " + "S: " + maniaData[0].count_rank_s + " | " + "A: "
									+ maniaData[0].count_rank_a + "\n"
									+ "```");
				}
				else {
					TTBT.createMessage(msg.channel.id, "**User not found!**");
				}
            });
        })
},	{
		cooldown: 3000,
		caseInsensitive: true,
		cooldownMessage: "Slow down buddy! This command has a **3 second cooldown!**",
		requirements: {
			"manageMessages": true
		}
	}
);

TTBT.registerCommandAlias("om", "mania");