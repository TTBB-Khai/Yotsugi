//'use strict';

const fetch = require('node-fetch');
global.Promise = require('bluebird');

TTBT.registerCommand("osu", (msg, args) => {
	if(args.length === 0)
		return "Incorrect usage. Correct usage: **" + process.env['CLIENT_PREFIX'] + "osu [OSU USERNAME HERE]**";
	
	let user = args.join(" ");	
	getData(user, msg);
	
},	{
		cooldown: 3000,
		caseInsensitive: true,
		cooldownMessage: "Slow down buddy! This command has a **3 second cooldown!**",
		requirements: {
			"manageMessages": true
		}
	}
);

const getData = (user, msg) => {
	
	TTBT.sendChannelTyping(msg.channel.id);

	fetch('https://osu.ppy.sh/api/get_user?u=' + user + '&k=' + process.env['OSU_API_KEY'] + '&m=0')
	.then((response, err) => {
		if (response.ok)
			return response.json();
		else 
			throw new TypeError("No JSON to parse!");
	})
	.then(data => {
		if (data.length > 0) {
			TTBT.createMessage(msg.channel.id, "```Markdown\n" 
				+ " * USER INFO *\n" 
				+ "User: " + data[0].username + "\n" 
				+ "ID: " + data[0].user_id + "\n\n"

				+ " * COUNTRY INFO *\n" 
				+ "Country: " + data[0].country + "\n" 
				+ "Country Rank: " + data[0].pp_country_rank + "\n\n"

				+ " * RANK INFO *\n" 
				+ "Ranked Score: " + data[0].ranked_score + "\n" 
				+ "PP Rank: " + data[0].pp_rank + "\n" 
				+ "Total Score: " + data[0].total_score + "\n\n"

				+ " * PLAY INFO *\n" 
				+ "Play Count: " + data[0].playcount + "\n" 
				+ "Level: " + data[0].level + "\n" 
				+ "Accuracy: " + data[0].accuracy + "\n\n"

				+ " * GRADE INFO *\n" 
				+ "SS: " + data[0].count_rank_ss + " | " 
				+ "S: " + data[0].count_rank_s + " | " 
				+ "A: " + data[0].count_rank_a + "\n"
				+ "```");
		}
		else
			TTBT.createMessage(msg.channel.id, "**User not found!**");
	})
	.catch(err => {
		if (msg.author.id === process.env['CLIENT_OWNERID'])
			TTBT.createMessage(msg.channel.id, "You have not set up this command! To do so, please refer to the README.");
		else
			TTBT.createMessage(msg.channel.id, "The owner of this bot does not have this command enabled yet!");
		throw err;
	})
}