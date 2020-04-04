const path = require('path');
const badge = require(path.join(process.cwd(), 'res', 'data', 'badges.json'));
const fs = require('fs');

var badgeCommand = TTBT.registerCommand("badge", (msg, args) => {
	
	let badges = "";
	let badgeArr = [];
	let user = "";
	
	if (!msg.channel.guild)
		return "This command only works in a server.";
	
	let getUser = msg.channel.guild.members.filter((mems) => { 
		return (mems.username.toLowerCase() === args.join(" ").toLowerCase()) || (mems.id === args.join(" "))
	});
	
	if (typeof(badge.user.filter(user => user.id === msg.author.id)[0]) === 'undefined') {
		badge.user.push({"id": msg.author.id, "badges": [":name_badge:"]});
		fs.writeFile((path.join(process.cwd(), 'res', 'data', 'badges.json')), JSON.stringify(badge), err => {
			if (err) console.log(err);
		});
	}
	
	if (args.length > 0) {
		if (msg.mentions.length > 0)
			user = msg.mentions[0];
		else if (getUser.length > 0)
			user = getUser[0].user;
		else {
			return "No user found.";
		}
	}
	else
		user = msg.author;
	
	if (typeof(badge.user.filter(usr => usr.id === user.id)[0]) === 'undefined') {
		foundUser = false;
		return "**This user has no badges**";
	}
	
	badge.user.filter(usr => usr.id === user.id)[0].badges.forEach(badge => {
		badges += badge;
		badgeArr.push(badge);
	})
		
	return `**${user.username}'s Badges (${badgeArr.length}/${badge.badges.length})\n`
		+`===================================**\n`
		+ `${badges}`;
	
},	{
		cooldown: 3000,
		caseInsensitive: true,
		cooldownMessage: "Slow down buddy! This command has a **3 second cooldown!**",
		requirements: {
			"manageMessages": true
		}
	}
);

TTBT.registerCommandAlias("badges", "badge");

badgeCommand.registerSubcommand("hint", (msg) => {
	
	if (typeof(badge.user.filter(user => user.id === msg.author.id)[0]) === 'undefined') {
		badge.user.push({"id": msg.author.id, "badges": [":name_badge:"]});
		fs.writeFile((path.join(process.cwd(), 'res', 'data', 'badges.json')), JSON.stringify(badge), err => {
			if (err) {
				console.log(err);
			}
		});
	}
	
	return "**__BADGE HINTS__**\n\n"
			+ "**NOTE: There are NO hidden commands! Every command is listed under " + process.env['CLIENT_PREFIX'] + "help.**\n\n"
			+ "**NORMAL COMMANDS + RNG**\n"
			+ ":game_die: - Snake eyes\n"
			+ ":cowboy: - It's high noon!\n"
			+ ":point_left: - Who is you?\n"
			+ ":tea: - ...*sips*\n"
			+ ":necktie: - *groans*...\n"
			+ ":beers: - Your friend really likes to party, huh?\n"
			+ ":8ball: - One can only answer so much...\n\n"
			+ "**NORMAL COMMANDS + SEARCH**\n"
			+ ":orange_book: - **Badges**? We don't need no stinkin' badges!\n"
			+ ":books: - What even is a **badge** anyways?\n"
			+ ":wolf: - *The autumn leaves, the summer breeze, your shiny hair like mahogany!*\n"
			+ ":mushroom: - YA-YA-YA-YA-YA-YA-YA-YA-YAHOO!\n\n"
			+ "**OTHERS**\n"
			+ ":race_car: - Ever heard of a palindrome?\n"
			+ ":thermometer: - Absolute zero\n"
			+ ":pretzel: - You seem lost...\n"
			+ ":rat: - _______, I choose you!\n"
			+ ":scarf: - NANIII!?\n"
			+ ":rocket: - Fly me to the **moon**. Let me play among the stars."
});

badgeCommand.registerSubcommandAlias("hints", "hint");

badgeCommand.registerSubcommand("list", (msg) => {
	
	if (typeof(badge.user.filter(user => user.id === msg.author.id)[0]) === 'undefined') {
		badge.user.push({"id": msg.author.id, "badges": [":name_badge:"]});
		fs.writeFile((path.join(process.cwd(), 'res', 'data', 'badges.json')), JSON.stringify(badge), err => {
			if (err) {
				console.log(err);
			}
		});
	}
	
	let badges = "";
	
	badge.badges.forEach(badge => {
		badges += badge;
	})
	
	return `**List of Available Badges (${badge.badges.length})\n`
		+ `===================================**\n`
		+ `${badges}`;
});