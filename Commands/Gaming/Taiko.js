const fetch = require('node-fetch');

var taikoCommand = TTBT.registerCommand("taiko", (msg, args) => {
	if(args.length === 0)
		return "Incorrect usage. Correct usage: **" + process.env['CLIENT_PREFIX'] + "taiko [OSU USERNAME HERE]**";
	
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

function getData(user, msg) {
	
	async function getURL() {
		try {
			let response = await fetch('https://osu.ppy.sh/api/get_user?u=' + user + '&k=' + process.env['OSU_API_KEY'] + '&m=1');
			return await response.json();
		}
		catch(err) {
			TTBT.createMessage(msg.channel.id, "Failed to load osu.ppy.sh");
			throw err;
		}
	}
	
	Promise.resolve(getURL()).then(data => {
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
		TTBT.createMessage(msg.channel.id, "If you are the owner, to set up this command, please refer to the README.");
	})
}