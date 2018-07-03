const fetch = require('node-fetch');

var osuCommand = TTBT.registerCommand("osu", (msg, args) => {
	if(args.length === 0) {
		return "Incorrect usage. Correct usage: **" + process.env['CLIENT_PREFIX'] + "osu [OSU USERNAME HERE]**";
	}
	
	fetch('https://osu.ppy.sh/api/get_user?u=' + args.join(" ") + '&k=' + process.env['OSU_API_KEY'] + '&m=0')
        .then(function (channel) {
            channel.text().then(osu => {
                let osuData = JSON.parse(osu);
				if (osuData.length > 0) {
					TTBT.createMessage(msg.channel.id, "```Markdown\n" 
									+ " * USER INFO *\n" 
									+ "User: " + osuData[0].username + "\n" 
									+ "ID: " + osuData[0].user_id + "\n\n"

									+ " * COUNTRY INFO *\n" 
									+ "Country: " + osuData[0].country + "\n" 
									+ "Country Rank: " + osuData[0].pp_country_rank + "\n\n"

									+ " * RANK INFO *\n" 
									+ "Ranked Score: " + osuData[0].ranked_score + "\n" 
									+ "PP Rank: " + osuData[0].pp_rank + "\n" 
									+ "Total Score: " + osuData[0].total_score + "\n\n"

									+ " * PLAY INFO *\n" 
									+ "Play Count: " + osuData[0].playcount + "\n" 
									+ "Level: " + osuData[0].level + "\n" 
									+ "Accuracy: " + osuData[0].accuracy + "\n\n"

									+ " * GRADE INFO *\n" 
									+ "SS: " + osuData[0].count_rank_ss
									+ " | " + "S: " + osuData[0].count_rank_s + " | " + "A: "
									+ osuData[0].count_rank_a + "\n"
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