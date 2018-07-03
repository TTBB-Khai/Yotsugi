const fetch = require('node-fetch');

var ctbCommand = TTBT.registerCommand("ctb", (msg, args) => {
	if(args.length === 0) {
		return "Incorrect usage. Correct usage: **" + process.env['CLIENT_PREFIX'] + "ctb [OSU USERNAME HERE]**";
	}
	
	fetch('https://osu.ppy.sh/api/get_user?u=' + args.join(" ") + '&k=' + process.env['OSU_API_KEY'] + '&m=2')
        .then(function (channel) {
            channel.text().then(ctb => {
                let ctbData = JSON.parse(ctb);
				if (ctbData.length > 0) {
					TTBT.createMessage(msg.channel.id, "```Markdown\n" 
									+ " * USER INFO *\n" 
									+ "User: " + ctbData[0].username + "\n" 
									+ "ID: " + ctbData[0].user_id + "\n\n"

									+ " * COUNTRY INFO *\n" 
									+ "Country: " + ctbData[0].country + "\n" 
									+ "Country Rank: " + ctbData[0].pp_country_rank + "\n\n"

									+ " * RANK INFO *\n" 
									+ "Ranked Score: " + ctbData[0].ranked_score + "\n" 
									+ "PP Rank: " + ctbData[0].pp_rank + "\n" 
									+ "Total Score: " + ctbData[0].total_score + "\n\n"

									+ " * PLAY INFO *\n" 
									+ "Play Count: " + ctbData[0].playcount + "\n" 
									+ "Level: " + ctbData[0].level + "\n" 
									+ "Accuracy: " + ctbData[0].accuracy + "\n\n"

									+ " * GRADE INFO *\n" 
									+ "SS: " + ctbData[0].count_rank_ss
									+ " | " + "S: " + ctbData[0].count_rank_s + " | " + "A: "
									+ ctbData[0].count_rank_a + "\n"
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