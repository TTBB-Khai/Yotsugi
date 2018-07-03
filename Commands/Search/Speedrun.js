const path = require('path')
const session = require(path.join(process.cwd(), 'res', 'data', 'session.json'));
const fetch = require('node-fetch');

var speedrunCommand = TTBT.registerCommand("speedrun", (msg, args) => {
	if(args.length === 0)
		return "Incorrect usage. Correct usage: **" + process.env['CLIENT_PREFIX'] + "speedrun [GAME HERE]**";
	
	if (typeof(session.speedrun.user.filter(function (user) {return user.id === msg.author.id})[0]) === 'undefined')
		session.speedrun.user.push({"id": msg.author.id, "session": false});
	
	if (!session.speedrun.user.filter(function (user) {return user.id === msg.author.id})[0].session) {
		let game = args.join(" ").replace(/\s/g, "%20");
		session.speedrun.user.filter(function (user) {return user.id === msg.author.id})[0].session = true;
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
	async function getURL() {
		try {
			let response = await fetch('https://www.speedrun.com/api/v1/games?orderby=released&direction=asc&name=' + game + '&max=10');
			return await response.json();
		}
		catch (err) {
			TTBT.createMessage(msg.channel.id, "Failed to load speedrun.com");
			throw err;
		}
	}
		
	TTBT.sendChannelTyping(msg.channel.id);
		
	Promise.all([
		Promise.resolve(getURL()),
		Promise.resolve(msg)
	])
	.then(data => {
		printGameList(data);
		return data;
	})
	.then(data => {
		if (data[0].data.length !== 0) 
			getGame(data);
	})
	.catch(err => TTBT.createMessage(msg.channel.id, "No games found with this search."))
}

function printGameList(promiseData) {
	let games = '```Markdown\n';
	games += promiseData[0].data.length === 0 ? 'No games found with this search' : ' * Related Games * \n\n';
		
	for (let i = 0; i <= promiseData[0].data.length - 1; i++)
		games += '[' + (i + 1) + '] ' + promiseData[0].data[i].names.international + '\n';
	
	if (promiseData[0].data.length !== 0)
		games += '\n' + '> Type the number of your choice into chat OR type "exit" to exit the menu';
	
	TTBT.createMessage(promiseData[1].channel.id, games + '```');
	
	delete(promiseData);
}

function getGame(promiseData) {
	function waitForYourMessage (newMsg) {
		if (newMsg.author.id === promiseData[1].author.id && newMsg.channel.id === promiseData[1].channel.id) {
			if (!isNaN(newMsg.content) && newMsg.content != 0 && Number(newMsg.content) <= promiseData[0].data.length) {
				TTBT.removeListener('messageCreate', waitForYourMessage, true); 

				Promise.all([
					Promise.resolve(promiseData[0].data[Number(newMsg.content) - 1]),
					Promise.resolve(promiseData[1])
				])
				.then(data => loadGame(data))
				.catch(err => TTBT.createMessage(promiseData[1].channel.id, 'You entered something invalid. The menu has been cancelled.'))
			}
			else if (newMsg.content === 'exit') { 
				TTBT.createMessage(promiseData[1].channel.id, 'You have exited the menu');
				TTBT.removeListener('messageCreate', waitForYourMessage, true); 
				session.speedrun.user.filter(function (user) {return user.id === promiseData[1].author.id})[0].session = false;
			}
		}
	}	
	
	TTBT.on('messageCreate', waitForYourMessage);
	
	setTimeout(() => {
		TTBT.removeListener('messageCreate', waitForYourMessage);
		session.speedrun.user.filter(function (user) {return user.id === promiseData[1].author.id})[0].session = false;
	}, 30 * 1000)
	
	delete(promiseData);
}

function loadGame(promiseData) {
	async function getURL() {
		try {
			let response = await fetch('https://www.speedrun.com/api/v1/games/' + promiseData[0].id + '/categories?type=per-game');
			return await response.json();
		}
		catch (err) {
			TTBT.createMessage(promiseData[1].channel.id, 'Failed to load speedrun.com');
			session.speedrun.user.filter(function (user) {return user.id === promiseData[1].author.id})[0].session = false;
			throw err;
		}
	}
	
	Promise.all([
		Promise.resolve(getURL()),
		Promise.resolve(promiseData[1]),
		Promise.resolve(promiseData[0])
	])
	.then(data => {
		printCategories(data);
		return data;
	})
	.then(data => {
		getCategory(data);
		return data;
	})
	.catch(err => TTBT.createMessage(promiseData[1].channel.id, 'Something went wrong :/'))
	
	delete(promiseData);
}

function printCategories(promiseData) {
	let categories = '```Markdown\n'
		+ ' * Categories * \n\n';
		
	for (let i = 0; i <= promiseData[0].data.length - 1; i++)
		categories += '[' + (i + 1) + '] ' + promiseData[0].data[i].name + '\n';
	
	categories += '\n' + '> Type the number of your choice into chat OR type anything else to exit the menu```';
	TTBT.createMessage(promiseData[1].channel.id, categories);
	
	delete(promiseData);
}

function getCategory(promiseData) {
	function waitForYourMessage (newMsg) {
		if (newMsg.author.id === promiseData[1].author.id && newMsg.channel.id === promiseData[1].channel.id) {
			if (!isNaN(newMsg.content) && newMsg.content != 0 && Number(newMsg.content) <= promiseData[0].data.length) {
				TTBT.removeListener('messageCreate', waitForYourMessage, true); 

				Promise.all([
					Promise.resolve(promiseData[0].data[Number(newMsg.content) - 1]),
					Promise.resolve(promiseData[1]),
					Promise.resolve(promiseData[2])
				])
				.then(data => loadLeaderBoard(data))
				.catch(err => TTBT.createMessage(promiseData[1].channel.id, 'You entered something invalid. The menu has been cancelled.'))
			}
			else if (newMsg.content === 'exit') { 
				TTBT.createMessage(promiseData[1].channel.id, 'You have exited the menu');
				TTBT.removeListener('messageCreate', waitForYourMessage, true); 
				session.speedrun.user.filter(function (user) {return user.id === promiseData[1].author.id})[0].session = false;
			}
		}
	}	
	
	TTBT.on('messageCreate', waitForYourMessage);
	
	setTimeout(() => {
		TTBT.removeListener('messageCreate', waitForYourMessage);
		session.speedrun.user.filter(function (user) {return user.id === promiseData[1].author.id})[0].session = false;
	}, 30 * 1000)
	
	delete(promiseData);
}

function loadLeaderBoard(promiseData) {
	async function getURL() {
		try {
			let response = await fetch('https://www.speedrun.com/api/v1/leaderboards/' + promiseData[2].id + '/category/' + promiseData[0].id + '?top=3&embed=players');
			return await response.json();
		}
		catch (err) {
			TTBT.createMessage(promiseData[1].channel.id, 'Failed to load speedrun.com');
			session.speedrun.user.filter(function (user) {return user.id === promiseData[1].author.id})[0].session = false;
			throw err;
		}
	}
	
	Promise.all([
		Promise.resolve(getURL()),
		Promise.resolve(promiseData[1]),
		Promise.resolve([promiseData[2], promiseData[0]])
	])
	.then(data => printLeaderBoard(data))
	.catch(err => {
		TTBT.createMessage(promiseData[1].channel.id, ':x: | Per-level speedrun leaderboards are not yet available');
		session.speedrun.user.filter(function (user) {return user.id === promiseData[1].author.id})[0].session = false;
	})
	
	delete(promiseData);
}

function printLeaderBoard(promiseData) {
	let runners = '```Markdown\n';
	runners += promiseData[0].data.players.data.length === 0 ? 'There are no runs for this category yet' 
		: ' * Top 3 Speedrunners for ' + promiseData[2][0].names.international + ', ' + promiseData[2][1].name + ' * \n\n';

	for (let i = 0; i <= promiseData[0].data.players.data.length - 1; i++) {
		let time = promiseData[0].data.runs[i].run.times.primary;
		let formattedTime = time.replace('PT','').replace('H','h ').replace('M','m ').replace('S','s');
		runners += '[' + (i + 1) + '] ' + promiseData[0].data.players.data[i].names.international + ' (' + formattedTime + ')\n';
	}
	
	TTBT.createMessage(promiseData[1].channel.id, runners + '```');
	
	delete(promiseData);
	session.speedrun.user.filter(function (user) {return user.id === promiseData[1].author.id})[0].session = false;
}

TTBT.registerCommandAlias("sr", "speedrun");