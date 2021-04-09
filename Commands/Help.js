const path = require('path');
const badge = require(path.join(process.cwd(), 'res', 'data', 'badges.json'));
const output = require(path.join(process.cwd(), 'res', 'messages', 'output.json'));
const fs = require('fs');
const { responder: responder } = require(path.join(process.cwd(), 'Utils', 'Responder.js'));

var helpCommand = TTBT.registerCommand("help", (msg) => {
	
	if (typeof(badge.user.filter(user => user.id === msg.author.id)[0]) === 'undefined') {
		badge.user.push({"id": msg.author.id, "badges": [":name_badge:"]});
		fs.writeFile((path.join(process.cwd(), 'res', 'data', 'badges.json')), JSON.stringify(badge), err => {
			if (err) console.log(err);
		});
	}
	
	if (!badge.user.filter(user => user.id === msg.author.id)[0].badges.find(badge => badge === ":beginner:")) {
		TTBT.createMessage(msg.channel.id, responder({user: msg.author.mention, badge: ":beginner:"}, output.badge.message));
		badge.user.filter(user => user.id === msg.author.id)[0].badges.push(":beginner:");
		fs.writeFile((path.join(process.cwd(), 'res', 'data', 'badges.json')), JSON.stringify(badge), err => {
			if (err) console.log(err);
		});
	}
	
	TTBT.getDMChannel(msg.author.id).then(channel => {
		  TTBT.createMessage(channel.id, "```Markdown\n"
				+ "**Prefix**\n"
				+ process.env['CLIENT_PREFIX'] + "\n\n"
				+ "**Commands**\n"
				+ " * General *\n"
				+ "<help - Brings up this message>\n"
				+ "<info - My information>\n"
				+ "<stats - My stats>\n"
				+ "<avatar - Brings up a user\'s avatar>\n"
				+ "<icon - Brings up the current server icon>\n"
				+ "<profile - Brings up a user\'s information>\n"
				+ "<server - Brings up the current server info>\n"
				+ "<channel - Brings up the current channel info>\n"
				+ "<ping - Tests my ping>\n\n"
				+ " * Moderation *\n"
				+ "<delete - Bulk deletes messages in a channel[WIP]>\n"
				+ "<ban - Bans a user in the server>\n"
				+ "<hackban - Bans a user who is not in the current server>\n"
				+ "<unban - Unbans a user in the current server>\n"
				+ "<kick - Kicks a user in the current server>\n\n"
				+ " * Fun *\n"
				+ "<roll - Rolls a 6 sided die>\n"
				+ "<flip - Flips a coin>\n"
				+ "<fortune - Outputs a random fortune>\n"
				+ "<drink - Gives you or a mentioned user a random drink>\n"
				+ "<8ball - Ask me a yes or no question>\n"
				+ "<who - Picks a random user in the server based on a given question>\n"
				+ "<karaoke - Starts a karaoke session>\n"
				+ "<rps - Plays rock,paper,scissors with me>\n\n"
				+ " * Gaming *\n"
				+ "<osu - Searches a Standard osu! profile>\n"
				+ "<taiko Searches a Taiko profile>\n"
				+ "<ctb Searches a Catch the Beat profile>\n"
				+ "<mania Searches an osu!mania profile>\n\n"
				+ " * Search *\n"
				+ "<challonge - Searches tournament information from challonge.com>\n"
				+ "<lmgtfy - Searches a query on lmgtfy.com>\n"
				+ "<lyrics - Searches song lyrics from genius.com>\n"
				+ "<wikipedia - Searches an article from wikipedia.com>\n"
				+ "<urban - Searches the definition of a word on urbandictionary.com>\n\n"
				+ "```");
				
			TTBT.createMessage(channel.id, "```Markdown\n"
				+ " * Utility *\n"
				+ "<choose - Chooses from a selection of options>\n"
				+ "<raffle - Starts a raffle in a server>\n"
				+ "<say - Makes me repeat what you say>\n"
				+ "<reverse - Reverses a given string>\n"
				+ "<temperature - Converts celsius to fahrenheit or vice versa>\n"
				+ "<distance - Converts kilometers to miles or vice versa>\n\n"
				+ " * Images *\n"
				+ "<joseph - \"Next you'll say...\">\n"
				+ "<kill - Yotsuba shoots someone>\n\n"
				+ " * Collections *\n"
				+ "<badge - Shows your badges>\n\n"
				+ "Type " + process.env['CLIENT_PREFIX'] + "<help command> for more information on a command\n"
				+ "Example: " + process.env['CLIENT_PREFIX'] + "help ping"
				+ "```");
	})
	
	if (msg.channel.guild) 
		return ":inbox_tray: | **" + msg.author.username + "**, DM sent!";
},	{
		caseInsensitive: true,
		cooldown: 3000,
		cooldownMessage: "Slow down! This command has a **3 second cooldown!**",
		requirements: {
			"manageMessages": true
		}
	}
);

helpCommand.registerSubcommand("help", (msg) => {
	
	if (typeof(badge.user.filter(user => user.id === msg.author.id)[0]) === 'undefined') {
		badge.user.push({"id": msg.author.id, "badges": [":name_badge:"]});
		fs.writeFile((path.join(process.cwd(), 'res', 'data', 'badges.json')), JSON.stringify(badge), err => {
			if (err) console.log(err);
		});
	}
	
	if (!badge.user.filter(user => user.id === msg.author.id)[0].badges.find(badge => badge === ":pretzel:")) {
		TTBT.createMessage(msg.channel.id, ":frowning: | Okay, I really can't help you any more than this....\n Is there something you need, like a :pretzel:? I can give you a :pretzel:!\n");
		TTBT.getDMChannel(msg.author.id).then(channel => {
			TTBT.createMessage(channel.id, responder({user: "You", badge: ":pretzel:"}, output.badge.message));
		});
		badge.user.filter(user => user.id === msg.author.id)[0].badges.push(":pretzel:");
		fs.writeFile((path.join(process.cwd(), 'res', 'data', 'badges.json')), JSON.stringify(badge), err => {
			if (err) console.log(err);
		});
	} else {
		return "Okay, now I'm out of pretzels, so you're on your own.";
	}
	
},	{
		caseInsensitive: true,
		cooldown: 3000,
		cooldownMessage: "Slow down! This command has a **3 second cooldown!**",
		requirements: {
			"manageMessages": true
		}
	}
);

helpCommand.registerSubcommand("info", (msg) => {
	return "```Markdown\n"
			+ "**Info**\n\n"
			+ " * Description *\n"
			+ "Checks my information.\n"
			+ " * Arguments *\n"
			+ "<none>\n"
			+ " * Examples *\n"
			+ process.env['CLIENT_PREFIX'] + "info\n"
			+ "```";
},	{
		caseInsensitive: true,
		cooldown: 3000,
		cooldownMessage: "Slow down! This command has a **3 second cooldown!**",
		requirements: {
			"manageMessages": true
		}
	}
);

helpCommand.registerSubcommand("badge", (msg) => {
	return "```Markdown\n"
			+ "**Badge**\n\n"
			+ " * Description *\n"
			+ "Brings up your badges.\n"
			+ " * Subcommands *\n"
			+ "<list - Brings up the list of available badges>\n"
			+ "<hints - Brings up hints to unlock the more secret badges>\n"
			+ " * Examples *\n"
			+ process.env['CLIENT_PREFIX'] + "badge OR " + process.env['CLIENT_PREFIX'] + "badge list OR " + process.env['CLIENT_PREFIX'] + "badge hints\n"
			+ "```";
},	{
		caseInsensitive: true,
		cooldown: 3000,
		cooldownMessage: "Slow down! This command has a **3 second cooldown!**",
		requirements: {
			"manageMessages": true
		}
	}
);

helpCommand.registerSubcommandAlias("badges", "badge");

helpCommand.registerSubcommand("avatar", (msg) => {
	return "```Markdown\n"
			+ "**Avatar**\n\n"
			+ " * Description *\n"
			+ "Brings up a user\'s avatar.\n"
			+ " * Arguments *\n"
			+ "<mentioned user> OR <user id> OR <username> OR <none>.\n"
			+ " * Examples *\n"
			+ process.env['CLIENT_PREFIX'] + "avatar @TTBT OR " + process.env['CLIENT_PREFIX'] + "avatar 408250314282500096 OR " + process.env['CLIENT_PREFIX'] + "avatar TTBT OR " + process.env['CLIENT_PREFIX'] + "avatar\n"
			+ "```";
},	{
		caseInsensitive: true,
		cooldown: 3000,
		cooldownMessage: "Slow down! This command has a **3 second cooldown!**",
		requirements: {
			"manageMessages": true
		}
	}
);

helpCommand.registerSubcommand("icon", (msg) => {
	return "```Markdown\n"
			+ "**Icon**\n\n"
			+ " * Description *\n"
			+ "Brings up the current server icon\n"
			+ " * Arguments *\n"
			+ "<none>\n"
			+ " * Examples *\n"
			+ process.env['CLIENT_PREFIX'] + "icon\n"
			+ "```";
},	{
		caseInsensitive: true,
		cooldown: 3000,
		cooldownMessage: "Slow down! This command has a **3 second cooldown!**",
		requirements: {
			"manageMessages": true
		}
	}
);

helpCommand.registerSubcommand("profile", (msg) => {
	return "```Markdown\n"
			+ "**Profile**\n\n"
			+ " * Description *\n"
			+ "Brings up a user\'s information.\n"
			+ " * Arguments *\n"
			+ "<mentioned user> OR <user id> OR <username> OR <none>.\n"
			+ " * Examples *\n"
			+ process.env['CLIENT_PREFIX'] + "profile @TTBT OR " + process.env['CLIENT_PREFIX'] + "profile 408250314282500096 OR " + process.env['CLIENT_PREFIX'] + "profile TTBT OR " + process.env['CLIENT_PREFIX'] + "profile\n"
			+ "```";
},	{
		caseInsensitive: true,
		cooldown: 3000,
		cooldownMessage: "Slow down! This command has a **3 second cooldown!**",
		requirements: {
			"manageMessages": true
		}
	}
);

helpCommand.registerSubcommand("server", (msg) => {
	return "```Markdown\n"
			+ "**Server**\n\n"
			+ " * Description *\n"
			+ "Brings up information on the current server\n"
			+ " * Arguments *\n"
			+ "<none>\n"
			+ " * Examples *\n"
			+ process.env['CLIENT_PREFIX'] + "server\n"
			+ "```";
},	{
		caseInsensitive: true,
		cooldown: 3000,
		cooldownMessage: "Slow down! This command has a **3 second cooldown!**",
		requirements: {
			"manageMessages": true
		}
	}
);

helpCommand.registerSubcommand("channel", (msg) => {
	return "```Markdown\n"
			+ "**Channel**\n\n"
			+ " * Description *\n"
			+ "Brings up information on the current channel\n"
			+ " * Arguments *\n"
			+ "<none>\n"
			+ " * Examples *\n"
			+ process.env['CLIENT_PREFIX'] + "channel\n"
			+ "```";
},	{
		caseInsensitive: true,
		cooldown: 3000,
		cooldownMessage: "Slow down! This command has a **3 second cooldown!**",
		requirements: {
			"manageMessages": true
		}
	}
);
	
helpCommand.registerSubcommand("delete", (msg) => {
	return "```Markdown\n"
			+ "**Delete**\n\n"
			+ " * Description *\n"
			+ "Bulk deletes messages in a channel with optional filters.\n"
			+ "NOTE: Messages older than 2 weeks cannot be deleted.\n"
			+ " * Arguments *\n"
			+ "<number of messages> AND <filter>\n"
			+ " * List of Filters *\n"
			+ "<bot - Deletes bot messages>\n"
			+ "<command - Deletes messages starting with " + process.env['CLIENT_PREFIX'] + ">\n"
			+ "<file - Deletes messages containing uploaded files>\n"
			+ "<embed - Deletes messages containing embeds>\n"
			+ "<image - Deletes messages containing images>\n"
			+ "<link - Deletes messages containing links>\n"
			+ "<unpinned - Deletes messages that aren't pinned>\n"
			+ "<@mentionedUser - Deletes messages from the mentioned user>\n"
			+ "<other - Deletes messages containing the given word or sentence (case sensitive)>\n"
			+ " * Examples *\n"
			+ process.env['CLIENT_PREFIX'] + "delete 5 OR " + process.env['CLIENT_PREFIX'] + "delete 5 bots OR " + process.env['CLIENT_PREFIX'] + "delete 5 @TTBT OR " + process.env['CLIENT_PREFIX'] + "delete 5 potato\n"
			+ "```";
},	{
		caseInsensitive: true,
		cooldown: 3000,
		cooldownMessage: "Slow down! This command has a **3 second cooldown!**",
		requirements: {
			"manageMessages": true
		}
	}
);
	
helpCommand.registerSubcommand("ban", (msg) => {
	return "```Markdown\n"
			+ "**Ban**\n\n"
			+ " * Description *\n"
			+ "Bans a user in the server. Use the word 'for' to provide a reason (optional).\n"
			+ " * Arguments *\n"
			+ "[<mentioned user> OR <user id> OR <username>] AND <reason>\n"
			+ " * Examples (without reason) *\n"
			+ process.env['CLIENT_PREFIX'] + "ban @TTBT OR " + process.env['CLIENT_PREFIX'] + "ban 408250314282500096 OR " + process.env['CLIENT_PREFIX'] + "ban TTBT\n"
			+ " * Examples (with reason) *\n"
			+ process.env['CLIENT_PREFIX'] + "ban @TTBT for being bad OR " + process.env['CLIENT_PREFIX'] + "ban 408250314282500096 for being bad OR " + process.env['CLIENT_PREFIX'] + "ban TTBT for being bad\n"
			+ "```";
},	{
		caseInsensitive: true,
		cooldown: 3000,
		cooldownMessage: "Slow down! This command has a **3 second cooldown!**",
		requirements: {
			"manageMessages": true
		}
	}
);
	
helpCommand.registerSubcommand("hackban", (msg) => {
	return "```Markdown\n"
			+ "**Hackban**\n\n"
			+ " * Description *\n"
			+ "Bans a user who is not in the server. Use the word 'for' to provide a reason (optional).\n"
			+ " * Arguments *\n"
			+ "<user id>\n"
			+ " * Example (without reason) *\n"
			+ process.env['CLIENT_PREFIX'] + "ban 408250314282500096\n"
			+ " * Example (with reason) *\n"
			+ process.env['CLIENT_PREFIX'] + "ban 408250314282500096 for being bad\n"
			+ "```";
},	{
		caseInsensitive: true,
		cooldown: 3000,
		cooldownMessage: "Slow down! This command has a **3 second cooldown!**",
		requirements: {
			"manageMessages": true
		}
	}
);

helpCommand.registerSubcommand("unban", (msg) => {
	return "```Markdown\n"
			+ "**Unban**\n\n"
			+ " * Description *\n"
			+ "Unbans a user who is not in the server. Use the word 'for' to provide a reason (optional).\n"
			+ " * Arguments *\n"
			+ "<user id>\n"
			+ " * Example (without reason) *\n"
			+ process.env['CLIENT_PREFIX'] + "ban 408250314282500096\n"
			+ " * Example (with reason) *\n"
			+ process.env['CLIENT_PREFIX'] + "ban 408250314282500096 for being bad\n"
			+ "```";
},	{
		caseInsensitive: true,
		cooldown: 3000,
		cooldownMessage: "Slow down! This command has a **3 second cooldown!**",
		requirements: {
			"manageMessages": true
		}
	}
);
	
helpCommand.registerSubcommand("kick", (msg) => {
	return "```Markdown\n"
			+ "**Kick**\n\n"
			+ " * Description *\n"
			+ "Kicks a user in the server.\n"
			+ " * Arguments *\n"
			+ "<mentioned user> OR <user id> OR <username>\n"
			+ " * Examples *\n"
			+ process.env['CLIENT_PREFIX'] + "kick @TTBT OR " + process.env['CLIENT_PREFIX'] + "kick 408250314282500096 OR " + process.env['CLIENT_PREFIX'] + "kick TTBT\n"
			+ "```";
},	{
		caseInsensitive: true,
		cooldown: 3000,
		cooldownMessage: "Slow down! This command has a **3 second cooldown!**",
		requirements: {
			"manageMessages": true
		}
	}
);

helpCommand.registerSubcommand("ping", (msg) => {
	return "```Markdown\n"
			+ "**Ping**\n\n"
			+ " * Description *\n"
			+ "Tests my ping\n"
			+ " * Arguments *\n"
			+ "<none>\n"
			+ " * Examples *\n"
			+ process.env['CLIENT_PREFIX'] + "ping\n"
			+ "```";
},	{
		cooldown: 3000,
		caseInsensitive: true,
		cooldownMessage: "Slow down buddy! This command has a **3 second cooldown!**",
		requirements: {
			"manageMessages": true
		}
	}
);

helpCommand.registerSubcommand("roll", (msg) => {
	return "```Markdown\n"
			+ "**Roll**\n\n"
			+ " * Description *\n"
			+ "Rolls a 6 sided die.\n"
			+ " * Arguments *\n"
			+ "<none>\n"
			+ " * Examples *\n"
			+ process.env['CLIENT_PREFIX'] + "roll\n"
			+ "```";
},	{
		caseInsensitive: true,
		cooldown: 3000,
		cooldownMessage: "Slow down! This command has a **3 second cooldown!**",
		requirements: {
			"manageMessages": true
		}
	}
);

helpCommand.registerSubcommand("flip", (msg) => {
	return "```Markdown\n"
			+ "**Flip**\n\n"
			+ " * Description *\n"
			+ "Flips a coin\n"
			+ " * Arguments *\n"
			+ "<none>\n"
			+ " * Examples *\n"
			+ process.env['CLIENT_PREFIX'] + "flip\n"
			+ "```";
},	{
		caseInsensitive: true,
		cooldown: 3000,
		cooldownMessage: "Slow down! This command has a **3 second cooldown!**",
		requirements: {
			"manageMessages": true
		}
	}
);

helpCommand.registerSubcommand("fortune", (msg) => {
	return "```Markdown\n"
			+ "**Fortune**\n\n"
			+ " * Description *\n"
			+ "Searches a random fortune from yerkee.com\n"
			+ " * Arguments *\n"
			+ "<none>\n"
			+ " * Examples *\n"
			+ process.env['CLIENT_PREFIX'] + "fortune\n"
			+ "```";
},	{
		caseInsensitive: true,
		cooldown: 3000,
		cooldownMessage: "Slow down! This command has a **3 second cooldown!**",
		requirements: {
			"manageMessages": true
		}
	}
);

helpCommand.registerSubcommand("drink", (msg) => {
	return "```Markdown\n"
			+ "**Drink**\n\n"
			+ " * Description *\n"
			+ "Gives you or a mentioned user a random drink.\n"
			+ " * Arguments *\n"
			+ "<mentioned user> OR <none>\n"
			+ " * Examples *\n"
			+ process.env['CLIENT_PREFIX'] + "drink @TTBT OR " + process.env['CLIENT_PREFIX'] + "drink\n"
			+ "```";
},	{
		caseInsensitive: true,
		cooldown: 3000,
		cooldownMessage: "Slow down! This command has a **3 second cooldown!**",
		requirements: {
			"manageMessages": true
		}
	}
);

helpCommand.registerSubcommand("8ball", (msg) => {
	return "```Markdown\n"
			+ "**8ball**\n\n"
			+ " * Description *\n"
			+ "Ask me a yes or no question and receive a random answer.\n"
			+ " * Arguments *\n"
			+ "<question>\n"
			+ " * Examples *\n"
			+ process.env['CLIENT_PREFIX'] + "8ball is TTBB the greatest of all time\n"
			+ "```";
},	{
		caseInsensitive: true,
		cooldown: 3000,
		cooldownMessage: "Slow down! This command has a **3 second cooldown!**",
		requirements: {
			"manageMessages": true
		}
	}
);

helpCommand.registerSubcommand("who", (msg) => {
	return "```Markdown\n"
			+ "**Who**\n\n"
			+ " * Description *\n"
			+ "Ask a \"who\" question and I will answer by naming a random user in this server\n"
			+ " * Arguments *\n"
			+ "<question>\n"
			+ " * Examples *\n"
			+ process.env['CLIENT_PREFIX'] + "who is the greatest of all time\n"
			+ "```";
},	{
		caseInsensitive: true,
		cooldown: 3000,
		cooldownMessage: "Slow down! This command has a **3 second cooldown!**",
		requirements: {
			"manageMessages": true
		}
	}
);

helpCommand.registerSubcommand("karaoke", (msg) => {
	return "```Markdown\n"
			+ "**Karaoke**\n\n"
			+ " * Description *\n"
			+ "Begins a karaoke session in the current channel\n"
			+ " * Sub Commands *\n"
			+ "Type '🎤' to join.\n"
			+ "Type 'queue' to peek at the current queue.\n"
			+ "Type 'start' to allow the next person in queue to sing.\n"
			+ "Type 'skip' to skip the next person in queue.\n"
			+ "Type 'end' to end the current session.\n"
			+ " * Arguments *\n"
			+ "<none>\n"
			+ " * Examples *\n"
			+ process.env['CLIENT_PREFIX'] + "karaoke\n"
			+ "```";
},	{
		caseInsensitive: true,
		cooldown: 3000,
		cooldownMessage: "Slow down! This command has a **3 second cooldown!**",
		requirements: {
			"manageMessages": true
		}
	}
);

helpCommand.registerSubcommand("rps", (msg) => {
	return "```Markdown\n"
			+ "**RPS**\n\n"
			+ " * Description *\n"
			+ "Plays rock,paper,scissors with me! All of my choices are completely random.\n"
			+ " * Arguments *\n"
			+ "<r> OR <p> OR <s>\n"
			+ " * Examples *\n"
			+ process.env['CLIENT_PREFIX'] + "rps r OR " + process.env['CLIENT_PREFIX'] + "rps p OR " + process.env['CLIENT_PREFIX'] + "rps s\n"
			+ "```";
},	{
		caseInsensitive: true,
		cooldown: 3000,
		cooldownMessage: "Slow down! This command has a **3 second cooldown!**",
		requirements: {
			"manageMessages": true
		}
	}
);

helpCommand.registerSubcommand("joseph", (msg) => {
	return "```Markdown\n"
			+ "**Kill**\n\n"
			+ " * Description *\n"
			+ "Sends an image of Joseph Joestar saying his signature phrase (Accepts 58 characters total).\n"
			+ " * Arguments *\n"
			+ "<anything>\n"
			+ " * Examples *\n"
			+ process.env['CLIENT_PREFIX'] + "joseph test"
			+ "```";
},	{
		caseInsensitive: true,
		cooldown: 3000,
		cooldownMessage: "Slow down! This command has a **3 second cooldown!**",
		requirements: {
			"manageMessages": true
		}
	}
)

helpCommand.registerSubcommand("kill", (msg) => {
	return "```Markdown\n"
			+ "**Kill**\n\n"
			+ " * Description *\n"
			+ "Sends an image of Yotsuba with a gun. Author of the command is the target if no arguements are passed.\n"
			+ "If the arguement is greater than 7 characters, it will split at the 5th character and add \"-san\".\n"
			+ "If there are spaces from the 2nd to 4th characters and the string is under 7 characters, it will split at the first space.\n"
			+ " * Arguments *\n"
			+ "<anything> OR <none>\n"
			+ " * Examples *\n"
			+ process.env['CLIENT_PREFIX'] + "kill OR " + process.env['CLIENT_PREFIX'] + "kill someone"
			+ "```";
},	{
		caseInsensitive: true,
		cooldown: 3000,
		cooldownMessage: "Slow down! This command has a **3 second cooldown!**",
		requirements: {
			"manageMessages": true
		}
	}
);

helpCommand.registerSubcommand("osu", (msg) => {
	return "```Markdown\n"
			+ "**Osu**\n\n"
			+ " * Description *\n"
			+ "Searches a Standard osu! profile\n"
			+ " * Arguments *\n"
			+ "<osu username>\n"
			+ " * Examples *\n"
			+ process.env['CLIENT_PREFIX'] + "osu cookiezi\n"
			+ "```";
},	{
		caseInsensitive: true,
		cooldown: 3000,
		cooldownMessage: "Slow down! This command has a **3 second cooldown!**",
		requirements: {
			"manageMessages": true
		}
	}
);

helpCommand.registerSubcommand("taiko", (msg) => {
	return "```Markdown\n"
			+ "**Taiko**\n\n"
			+ " * Description *\n"
			+ "Searches a Taiko profile\n"
			+ " * Arguments *\n"
			+ "<osu username>\n"
			+ " * Examples *\n"
			+ process.env['CLIENT_PREFIX'] + "taiko _yu68\n"
			+ "```";
},	{
		caseInsensitive: true,
		cooldown: 3000,
		cooldownMessage: "Slow down! This command has a **3 second cooldown!**",
		requirements: {
			"manageMessages": true
		}
	}
);

helpCommand.registerSubcommand("ctb", (msg) => {
	return "```Markdown\n"
			+ "**CTB**\n\n"
			+ " * Description *\n"
			+ "Searches a Catch the Beat profile\n"
			+ " * Arguments *\n"
			+ "<osu username>\n"
			+ " * Examples *\n"
			+ process.env['CLIENT_PREFIX'] + "ctb Motion\n"
			+ "```";
},	{
		caseInsensitive: true,
		cooldown: 3000,
		cooldownMessage: "Slow down! This command has a **3 second cooldown!**",
		requirements: {
			"manageMessages": true
		}
	}
);

helpCommand.registerSubcommand("mania", (msg) => {
	return "```Markdown\n"
			+ "**Mania**\n\n"
			+ " * Description *\n"
			+ "Searches an osu!mania profile\n"
			+ " * Arguments *\n"
			+ "<osu username>\n"
			+ " * Aliases *\n"
			+ "om\n"
			+ " * Examples *\n"
			+ process.env['CLIENT_PREFIX'] + "mania jakads\n"
			+ "```";
},	{
		caseInsensitive: true,
		cooldown: 3000,
		cooldownMessage: "Slow down! This command has a **3 second cooldown!**",
		requirements: {
			"manageMessages": true
		}
	}
);

helpCommand.registerSubcommandAlias("om", "mania");
	
helpCommand.registerSubcommand("challonge", (msg) => {
	return "```Markdown\n"
			+ "**Challonge**\n\n"
			+ " * Description *\n"
			+ "Searches tournament information from challonge.com under a subdomain\n"
			+ " * Arguments *\n"
			+ "<subdomain>\n"
			+ " * Examples *\n"
			+ process.env['CLIENT_PREFIX'] + "challonge wega \n"
			+ "```";
},	{
		caseInsensitive: true,
		cooldown: 3000,
		cooldownMessage: "Slow down! This command has a **3 second cooldown!**",
		requirements: {
			"manageMessages": true
		}
	}
);

helpCommand.registerSubcommand("lmgtfy", (msg) => {
	return "```Markdown\n"
			+ "**Lmgtfy**\n\n"
			+ " * Description *\n"
			+ "Searches a query on lmgtfy.com (Let me google that for you)\n"
			+ " * Arguments *\n"
			+ "<search query>\n"
			+ " * Examples *\n"
			+ process.env['CLIENT_PREFIX'] + "lmgtfy google\n"
			+ "```";
},	{
		caseInsensitive: true,
		cooldown: 3000,
		cooldownMessage: "Slow down! This command has a **3 second cooldown!**",
		requirements: {
			"manageMessages": true
		}
	}
);

helpCommand.registerSubcommand("lyrics", (msg) => {
	return "```Markdown\n"
			+ "**Lyrics**\n\n"
			+ " * Description *\n"
			+ "Searches song lyrics from genius.com\n"
			+ " * Arguments *\n"
			+ "<song name> AND/OR <lyric> AND/OR <artist>\n"
			+ " * Aliases *\n"
			+ "lyric\n"
			+ " * Examples *\n"
			+ process.env['CLIENT_PREFIX'] + "lyrics opium mili \n"
			+ "```";
},	{
		caseInsensitive: true,
		cooldown: 3000,
		cooldownMessage: "Slow down! This command has a **3 second cooldown!**",
		requirements: {
			"manageMessages": true
		}
	}
);

helpCommand.registerSubcommandAlias("lyric", "lyrics");
	
helpCommand.registerSubcommand("wikipedia", (msg) => {
	return "```Markdown\n"
			+ "**Wikipedia**\n\n"
			+ " * Description *\n"
			+ "Searches an article from wikipedia.com\n"
			+ " * Arguments *\n"
			+ "<search query>\n"
			+ " * Aliases *\n"
			+ "wiki\n"
			+ " * Examples *\n"
			+ process.env['CLIENT_PREFIX'] + "wikipedia test\n"
			+ "```";
},	{
		caseInsensitive: true,
		cooldown: 3000,
		cooldownMessage: "Slow down! This command has a **3 second cooldown!**",
		requirements: {
			"manageMessages": true
		}
	}
);
	
helpCommand.registerSubcommandAlias("wiki", "wikipedia");

helpCommand.registerSubcommand("urban", (msg) => {
	return "```Markdown\n"
			+ "**Urban**\n\n"
			+ " * Description *\n"
			+ "Searches the top definition of a word on urbandictionary.com\n"
			+ " * Arguments *\n"
			+ "<word>\n"
			+ " * Aliases *\n"
			+ "ub\n"
			+ " * Examples *\n"
			+ process.env['CLIENT_PREFIX'] + "urban test\n"
			+ "```";
},	{
		caseInsensitive: true,
		cooldown: 3000,
		cooldownMessage: "Slow down! This command has a **3 second cooldown!**",
		requirements: {
			"manageMessages": true
		}
	}
);

helpCommand.registerSubcommandAlias("ub", "urban");
	
helpCommand.registerSubcommand("choose", (msg) => {
	return "```Markdown\n"
			+ "**Choose**\n\n"
			+ " * Description *\n"
			+ "Chooses a random option from a selection of given choices\n"
			+ " * Arguments *\n"
			+ "<choices>\n"
			+ " * Examples *\n"
			+ process.env['CLIENT_PREFIX'] + "choose this | that | here | there\n"
			+ "```";
},	{
		caseInsensitive: true,
		cooldown: 3000,
		cooldownMessage: "Slow down! This command has a **3 second cooldown!**",
		requirements: {
			"manageMessages": true
		}
	}
);

helpCommand.registerSubcommand("raffle", (msg) => {
	return "```Markdown\n"
			+ "**Raffle**\n\n"
			+ " * Description *\n"
			+ "Starts a raffle in a server\n"
			+ " * Sub Commands *\n"
			+ "Type 'raffle' to join.\n"
			+ "Type '" + process.env['CLIENT_PREFIX'] + "r [USER HERE]' to enter someone else into the raffle (mod-only)\n"
			+ " * Arguments *\n"
			+ "<none>\n"
			+ " * Examples *\n"
			+ process.env['CLIENT_PREFIX'] + "raffle\n"
			+ "```";
},	{
		caseInsensitive: true,
		cooldown: 3000,
		cooldownMessage: "Slow down! This command has a **3 second cooldown!**",
		requirements: {
			"manageMessages": true
		}
	}
);

helpCommand.registerSubcommand("say", (msg) => {
	return "```Markdown\n"
			+ "**Say**\n\n"
			+ " * Description *\n"
			+ "Makes me repeat what you say\n"
			+ " * Arguments *\n"
			+ "<string>\n"
			+ " * Examples *\n"
			+ process.env['CLIENT_PREFIX'] + "say Hello World\n"
			+ "```";
},	{
		caseInsensitive: true,
		cooldown: 3000,
		cooldownMessage: "Slow down! This command has a **3 second cooldown!**",
		requirements: {
			"manageMessages": true
		}
	}
);

helpCommand.registerSubcommand("reverse", (msg) => {
	return "```Markdown\n"
			+ "**Reverse**\n\n"
			+ " * Description *\n"
			+ "Reverses a given string\n"
			+ " * Arguments *\n"
			+ "<string>\n"
			+ " * Examples *\n"
			+ process.env['CLIENT_PREFIX'] + "reverse Hello World\n"
			+ "```";
},	{
		caseInsensitive: true,
		cooldown: 3000,
		cooldownMessage: "Slow down! This command has a **3 second cooldown!**",
		requirements: {
			"manageMessages": true
		}
	}
);

helpCommand.registerSubcommand("temperature", (msg) => {
	return "```Markdown\n"
			+ "**Temperature**\n\n"
			+ " * Description *\n"
			+ "Converts celsius to fahrenheit, or fahrenheit to celsius\n"
			+ " * Arguments *\n"
			+ "<number> <c/f>\n"
			+ " * Aliases *\n"
			+ "temp\n"
			+ " * Examples *\n"
			+ process.env['CLIENT_PREFIX'] + "temperature 10 c OR " + process.env['CLIENT_PREFIX'] + "temperature 50 f\n"
			+ "```";
},	{
		caseInsensitive: true,
		cooldown: 3000,
		cooldownMessage: "Slow down! This command has a **3 second cooldown!**",
		requirements: {
			"manageMessages": true
		}
	}
);

helpCommand.registerSubcommandAlias("temp", "temperature");

helpCommand.registerSubcommand("distance", (msg) => {
	return "```Markdown\n"
			+ "**Distance**\n\n"
			+ " * Description *\n"
			+ "Converts kilometers to miles, or miles to kilometers\n"
			+ " * Arguments *\n"
			+ "<number> <k/m>\n"
			+ " * Aliases *\n"
			+ "dist\n"
			+ " * Examples *\n"
			+ process.env['CLIENT_PREFIX'] + "distance 10 k OR " + process.env['CLIENT_PREFIX'] + "distance 6.25 m\n"
			+ "```";
},	{
		caseInsensitive: true,
		cooldown: 3000,
		cooldownMessage: "Slow down! This command has a **3 second cooldown!**",
		requirements: {
			"manageMessages": true
		}
	}
);

helpCommand.registerSubcommandAlias("dist", "distance");