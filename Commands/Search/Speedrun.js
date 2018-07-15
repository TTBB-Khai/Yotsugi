//'use strict';

const path = require('path')
const session = require(path.join(process.cwd(), 'res', 'data', 'session.json'));
const fetch = require('node-fetch');
global.Promise = require('bluebird');

var speedrunCommand = TTBT.registerCommand("speedrun", (msg, args) => {
	if(args.length === 0)
		return "Incorrect usage. Correct usage: **" + process.env['CLIENT_PREFIX'] + "speedrun [GAME HERE]**";
	
	if (typeof(session.speedrun.user.filter((user) => {return user.id === msg.author.id})[0]) === 'undefined')
		session.speedrun.user.push({"id": msg.author.id, "session": false});
	
	if (!session.speedrun.user.filter((user) => {return user.id === msg.author.id})[0].session) {
		let game = args.join(" ").replace(/\s/g, "%20");
		session.speedrun.user.filter((user) => {return user.id === msg.author.id})[0].session = true;
		loadGameList(game, msg);
	}
	else
		return ":x: | You already have a menu open! Type 'exit' to cancel it.";

},	{
		cooldown: 5000,
		caseInsensitive: true,
		cooldownMessage: "Slow down buddy! This command has a **5 second cooldown!**",
		requirements: {
			"manageMessages": true
		}
	}
);

function loadGameList(game, msg) {
	
	TTBT.sendChannelTyping(msg.channel.id);
		
	fetch('https://www.speedrun.com/api/v1/games?orderby=released&direction=asc&name=' + game + '&max=10')
	.then((response, err) => {
		if (response.ok)
			return response.json();
		else {
			session.speedrun.user.filter((user) => {return user.id === msg.author.id})[0].session = false;
			throw new TypeError("No JSON to parse!");
		}
	})
	.then(response => {
		printGameList(response, msg);
		return response;
	})
	.then(response => {
		if (response.data.length !== 0) 
			getGame(response, msg);
		else
			session.speedrun.user.filter((user) => {return user.id === msg.author.id})[0].session = false;
	})
	.catch(err => {
		session.speedrun.user.filter((user) => {return user.id === msg.author.id})[0].session = false;
		TTBT.createMessage(msg.channel.id, "No games found with this search.");
	})
}

function printGameList(srData, msg) {
	let games = '```Markdown\n';
	games += srData.data.length === 0 ? 'No games found with this search' : ' * Related Games * \n\n';
		
	for (let i = 0; i <= srData.data.length - 1; i++)
		games += '[' + (i + 1) + '] ' + srData.data[i].names.international + '\n';
	
	if (srData.data.length !== 0)
		games += '\n' + '> Type the number of your choice into chat OR type "exit" to exit the menu';
	else
		session.speedrun.user.filter((user) => {return user.id === msg.author.id})[0].session = false;
	
	TTBT.createMessage(msg.channel.id, games + '```');
	
}

function getGame(srData, msg) {
	function waitForYourMessage (newMsg) {
		if (newMsg.author.id === msg.author.id && newMsg.channel.id === msg.channel.id) {
			if (!isNaN(newMsg.content) && newMsg.content != 0 && Number(newMsg.content) <= srData.data.length) {
				TTBT.removeListener('messageCreate', waitForYourMessage, true); 
				loadGame(srData.data[Number(newMsg.content) - 1], msg);
			}
			else if (newMsg.content === 'exit') { 
				TTBT.createMessage(msg.channel.id, 'You have exited the menu');
				TTBT.removeListener('messageCreate', waitForYourMessage, true); 
				session.speedrun.user.filter((user) => {return user.id === msg.author.id})[0].session = false;
			}
		}
	}	
	
	TTBT.on('messageCreate', waitForYourMessage);
	
	setTimeout(() => {
		TTBT.removeListener('messageCreate', waitForYourMessage);
		session.speedrun.user.filter((user) => {return user.id === msg.author.id})[0].session = false;
	}, 30 * 1000)
	
}

function loadGame(game, msg) {

	TTBT.sendChannelTyping(msg.channel.id);
	
	fetch('https://www.speedrun.com/api/v1/games/' + game.id + '/categories?type=per-game')
	.then((response, err) => {
		if (response.ok)
			return response.json();
		else {
			session.speedrun.user.filter((user) => {return user.id === msg.author.id})[0].session = false;
			throw new TypeError("No JSON to parse!");
		}
	})
	.then(response => {
		printCategories(response, msg);
		return response;
	})
	.then(response => {
		getCategory(response, msg, game);
	})
	.catch(err => {
		session.speedrun.user.filter((user) => {return user.id === msg.author.id})[0].session = false;
		TTBT.createMessage(msg.channel.id, 'Something went wrong :/');
	})
}

function printCategories(categoryData, msg) {
	let categories = '```Markdown\n'
		+ ' * Categories * \n\n';
		
	for (let i = 0; i <= categoryData.data.length - 1; i++)
		categories += '[' + (i + 1) + '] ' + categoryData.data[i].name + '\n';
	
	categories += '\n' + '> Type the number of your choice into chat OR type anything else to exit the menu```';
	TTBT.createMessage(msg.channel.id, categories);
}

function getCategory(categoryData, msg, game) {
	function waitForYourMessage (newMsg) {
		if (newMsg.author.id === msg.author.id && newMsg.channel.id === msg.channel.id) {
			if (!isNaN(newMsg.content) && newMsg.content != 0 && Number(newMsg.content) <= categoryData.data.length) {
				TTBT.removeListener('messageCreate', waitForYourMessage, true);
				loadLeaderBoard(categoryData.data[Number(newMsg.content) - 1], msg, game);			
			}
			else if (newMsg.content === 'exit') { 
				TTBT.createMessage(msg.channel.id, 'You have exited the menu');
				TTBT.removeListener('messageCreate', waitForYourMessage, true); 
				session.speedrun.user.filter((user) => {return user.id === msg.author.id})[0].session = false;
			}
		}
	}	
	
	TTBT.on('messageCreate', waitForYourMessage);
	
	setTimeout(() => {
		TTBT.removeListener('messageCreate', waitForYourMessage);
		session.speedrun.user.filter((user) => {return user.id === msg.author.id})[0].session = false;
	}, 30 * 1000)
}

function loadLeaderBoard(category, msg, game) {

	TTBT.sendChannelTyping(msg.channel.id);
	
	fetch('https://www.speedrun.com/api/v1/leaderboards/' + game.id + '/category/' + category.id + '?top=3&embed=players')
	.then((response, err) => {
		if (response.ok)
			return response.json();
		else {
			session.speedrun.user.filter((user) => {return user.id === msg.author.id})[0].session = false;
			throw new TypeError("No JSON to parse!");
		}
	})
	.then(response => printLeaderBoard(response, msg, game, category))
	.catch(err => {
		TTBT.createMessage(msg.channel.id, ':x: | Per-level speedrun leaderboards are not yet available');
		session.speedrun.user.filter((user) => {return user.id === msg.author.id})[0].session = false;
	})
}

function printLeaderBoard(lbData, msg, game, category) {
	let runners = '```Markdown\n';
	runners += lbData.data.players.data.length === 0 ? 'There are no runs for this category yet' 
		: ' * Top 3 Speedrunners for ' + game.names.international + ', ' + category.name + ' * \n\n';

	for (let i = 0; i <= lbData.data.players.data.length - 1; i++) {
		let time = lbData.data.runs[i].run.times.primary;
		let formattedTime = time.replace('PT','').replace('H','h ').replace('M','m ').replace('S','s');
		runners += '[' + (i + 1) + '] ' + lbData.data.players.data[i].names.international + ' (' + formattedTime + ')\n';
	}
	
	TTBT.createMessage(msg.channel.id, runners + '```');
	session.speedrun.user.filter((user) => {return user.id === msg.author.id})[0].session = false;
}

TTBT.registerCommandAlias("sr", "speedrun");