const fetch = require('node-fetch');

var taikoCommand = TTBT.registerCommand("taiko", (msg, args) => {
	if(args.length === 0) {
		return "Incorrect usage. Correct usage: **" + process.env['CLIENT_PREFIX'] + "taiko [OSU USERNAME HERE]**";
	}
	
	fetch('https://osu.ppy.sh/api/get_user?u=' + args.join(" ") + '&k=' + process.env['OSU_API_KEY'] + '&m=1')
        .then(function (channel) {
            channel.text().then(taiko => {
                let taikoData = JSON.parse(taiko);
				if (taikoData.length > 0) {
					TTBT.createMessage(msg.channel.id, "```Markdown\n" 
									+ " * USER INFO *\n" 
									+ "User: " + taikoData[0].username + "\n" 
									+ "ID: " + taikoData[0].user_id + "\n\n"

									+ " * COUNTRY INFO *\n" 
									+ "Country: " + taikoData[0].country + "\n" 
									+ "Country Rank: " + taikoData[0].pp_country_rank + "\n\n"

									+ " * RANK INFO *\n" 
									+ "Ranked Score: " + taikoData[0].ranked_score + "\n" 
									+ "PP Rank: " + taikoData[0].pp_rank + "\n" 
									+ "Total Score: " + taikoData[0].total_score + "\n\n"

									+ " * PLAY INFO *\n" 
									+ "Play Count: " + taikoData[0].playcount + "\n" 
									+ "Level: " + taikoData[0].level + "\n" 
									+ "Accuracy: " + taikoData[0].accuracy + "\n\n"

									+ " * GRADE INFO *\n" 
									+ "SS: " + taikoData[0].count_rank_ss
									+ " | " + "S: " + taikoData[0].count_rank_s + " | " + "A: "
									+ taikoData[0].count_rank_a + "\n"
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