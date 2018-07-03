const path = require('path')
const session = require(path.join(process.cwd(), 'res', 'data', 'session.json'));
const fetch = require('node-fetch');

var challongeCommand = TTBT.registerCommand("challonge", (msg, args) => {
	if(args.length === 0)
		return "Incorrect usage. Correct usage: **" + process.env['CLIENT_PREFIX'] + "challonge [SUBDOMAIN HERE]**";
	
	if (typeof(session.challonge.user.filter(function (user) {return user.id === msg.author.id})[0]) === 'undefined')
		session.challonge.user.push({"id": msg.author.id, "session": false});
	
	if (!session.challonge.user.filter(function (user) {return user.id === msg.author.id})[0].session) {
		session.challonge.user.filter(function (user) {return user.id === msg.author.id})[0].session = true;
		loadChallongeList(args.join(" "), msg);
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

function loadChallongeList(subdomain, msg) {
	async function getURL() {
		try {
			let response = await fetch('https://api.challonge.com/v1/tournaments.json?api_key=' + process.env['CHALLONGE_API_KEY'] + '&state=ended&subdomain=' + subdomain);
			return await response.json();
		}
		catch (err) {
			TTBT.createMessage(msg.channel.id, "Failed to load challonge.com");
			throw err;
		}
	}
	
	TTBT.sendChannelTyping(msg.channel.id);
		
	Promise.all([
		Promise.resolve(getURL()),
		Promise.resolve(msg)
	])
	.then(data => printChallongeList(data))
	.catch(err => {
		TTBT.createMessage(msg.channel.id, "If you are the owner, to set up this command, please refer to the README.");
		session.challonge.user.filter(function (user) {return user.id === msg.author.id})[0].session = false;
	})
}

function printChallongeList(promiseData) {
	let tournaments = "```Markdown\n"
	tournaments += promiseData[0].length === 0 ? 'No tournaments found with this search' 
		: " * Recent Tournaments for " + (promiseData[0][0].tournament.subdomain).toUpperCase() + " * \n\n";
	
	let listLength = promiseData[0].length < 9 ? promiseData[0].length - 1 : 9;
	let sortedList = promiseData[0].sort(function(a,b){return new Date(b.tournament.created_at) > new Date(a.tournament.created_at) ? 1 : -1});
		
	for (let i = 0; i <= listLength; i++)
		tournaments += "[" + (i + 1) + "] " + sortedList[i].tournament.name + " (Game: " + sortedList[i].tournament.game_name + ")\n";
	
	tournaments += "\n" + "> Type the number of your choice into chat OR type 'cancel' to exit the menu```";
	TTBT.createMessage(promiseData[1].channel.id, tournaments);
	
	Promise.all([
		Promise.resolve(sortedList),
		Promise.resolve(promiseData[1])
	])
	.then(data => getTournament(data))
	.catch(err => {
		TTBT.createMessage(promiseData[1].channel.id, "An error has occurred");
		session.challonge.user.filter(function (user) {return user.id === promiseData[1].author.id})[0].session = false;
	})
	
	delete(promiseData);
}

function getTournament(promiseData) {
	function waitForYourMessage (newMsg) {
		if (newMsg.author.id === promiseData[1].author.id && newMsg.channel.id === promiseData[1].channel.id) {
			if (!isNaN(newMsg.content) && newMsg.content != 0) {
				TTBT.removeListener('messageCreate', waitForYourMessage, true); 

				Promise.all([
				Promise.resolve(promiseData[0]),
				Promise.resolve(promiseData[1]),
				Promise.resolve([
					promiseData[0][Number(newMsg.content) - 1].tournament.url, 
					promiseData[0][Number(newMsg.content) - 1].tournament.name, 
					promiseData[0][Number(newMsg.content) - 1].tournament.full_challonge_url
				])
				])
				.then(data => loadTournament(data))
				.catch(err => {
					TTBT.createMessage(promiseData[1].channel.id, "You entered something invalid. The menu has been cancelled.");
					session.challonge.user.filter(function (user) {return user.id === promiseData[1].author.id})[0].session = false;
				})
			}
			else if (newMsg.content === 'exit') { 
				TTBT.createMessage(promiseData[1].channel.id, 'You have exited the menu');
				TTBT.removeListener('messageCreate', waitForYourMessage, true); 
				session.challonge.user.filter(function (user) {return user.id === promiseData[1].author.id})[0].session = false;
			}
		}
	}	
	
	TTBT.on('messageCreate', waitForYourMessage);
	
	setTimeout(() => {
		TTBT.removeListener('messageCreate', waitForYourMessage);
		session.challonge.user.filter(function (user) {return user.id === promiseData[1].author.id})[0].session = false;
	}, 30 * 1000)
	
	// delete(promiseData);
}

function loadTournament(promiseData) {
	async function getURL() {
		try {
			let response = await fetch('https://api.challonge.com/v1/tournaments/' + promiseData[0][0].tournament.subdomain + '-' + promiseData[2][0] + '/participants.json?api_key=' + process.env['CHALLONGE_API_KEY'] + '&subdomain=' + promiseData[0][0].tournament.subdomain);
			return await response.json();
		}
		catch (err) {
			TTBT.createMessage(promiseData[1].channel.id, "Failed to load challonge.com");
			throw err;
		}
	}
	
	Promise.all([
		Promise.resolve(promiseData[1]),
		Promise.resolve(getURL()),
		Promise.resolve([promiseData[2][1], promiseData[2][2]])
	])
	.then(data => printResults(data))
	.catch(err => {
		TTBT.createMessage(promiseData[1].channel.id, "Something went wrong :/");
		session.challonge.user.filter(function (user) {return user.id === promiseData[1].author.id})[0].session = false;
	})
	
	delete(promiseData);
}

function printResults(promiseData) {
	let ranks = {'rank': []};
	let results = "```Markdown\n" 
		+ " * Results for " + promiseData[2][0] + " (up to top 8) * \n\n";
		
	for (let i = 0; i < promiseData[1].length; i++) {
		if (promiseData[1][0].participant.final_rank !== null) {
			ranks.rank.push({
				placing: promiseData[1][i].participant.final_rank,
				player: promiseData[1][i].participant.name
			});
		}
	}
	
	if (ranks.rank.length > 0) {
		let range = ranks.rank.length < 8 ? ranks.rank.length : 8;
		
		let sortedRanks = ranks.rank.sort(function(a, b){return a.placing - b.placing});
		
		for (let i = 0; i < range; i++)
			results += "[" + sortedRanks[i].placing + "] " + sortedRanks[i].player + "\n";
		
		TTBT.createMessage(promiseData[0].channel.id, results + "```\n" 
			+ "**Bracket Link: " + promiseData[2][1] + " **");
	}
	else
		TTBT.createMessage(promiseData[0].channel.id, "This tournament is still ongoing\n```\n" 
			+ "**Bracket Link: " + promiseData[2][1] + " **");
	
	session.challonge.user.filter(function (user) {return user.id === promiseData[0].author.id})[0].session = false;
	delete(promiseData);
}