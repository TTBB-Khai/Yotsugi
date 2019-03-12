//'use strict';

const path = require('path')
const session = require(path.join(process.cwd(), 'res', 'data', 'session.json'));
const fetch = require('node-fetch');

global.Promise = require('bluebird');

TTBT.registerCommand("challonge", (msg, args) => {
	if(args.length === 0)
		return `Incorrect usage. Correct usage: **${process.env['CLIENT_PREFIX']}challonge [SUBDOMAIN HERE]**`;
	
	if (typeof(session.challonge.user.filter((user) => {return user.id === msg.author.id})[0]) === 'undefined')
		session.challonge.user.push({"id": msg.author.id, "session": false});
	
	if (!session.challonge.user.filter((user) => {return user.id === msg.author.id})[0].session) {
		session.challonge.user.filter((user) => {return user.id === msg.author.id})[0].session = true;
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
	
	TTBT.sendChannelTyping(msg.channel.id);
	
	fetch(`https://api.challonge.com/v1/tournaments.json?api_key=${process.env['CHALLONGE_API_KEY']}&state=ended&subdomain=${subdomain}`)
	.then((response, err) => {
		if (response.ok)
			return response.json();
		else {
			session.challonge.user.filter((user) => {return user.id === msg.author.id})[0].session = false;
			throw new TypeError("No JSON to parse!");
		}
	})
	.then((response) => {
		if (!response.hasOwnProperty('errors'))
			printChallongeList(response, msg)
		else {
			TTBT.createMessage(msg.channel.id, "No tournaments found with this search");
			session.challonge.user.filter((user) => {return user.id === msg.author.id})[0].session = false;
		}
	})
	.catch((err) => {
		if (msg.author.id === process.env['CLIENT_OWNERID'])
			TTBT.createMessage(msg.channel.id, "You have not set up this command! To do so, please refer to the README.");
		else
			TTBT.createMessage(msg.channel.id, "The owner of this bot does not have this command enabled yet!");
		session.challonge.user.filter((user) => {return user.id === msg.author.id})[0].session = false;
		return Promise.reject();
	})
}

function printChallongeList(challongeData, msg) {
	let tournaments = "```Markdown\n"
	tournaments += challongeData.length === 0 ? 'No tournaments found with this subdomain' 
		: " * Recent Tournaments for " + (challongeData[0].tournament.subdomain).toUpperCase() + " * \n\n";
	
	let listLength = challongeData.length < 9 ? challongeData.length - 1 : 9;
	let sortedList = challongeData.sort((a,b) => {return new Date(b.tournament.created_at) > new Date(a.tournament.created_at) ? 1 : -1});
		
	for (let i = 0; i <= listLength; i++)
		tournaments += "[" + (i + 1) + "] " + sortedList[i].tournament.name + " (Game: " + sortedList[i].tournament.game_name + ")\n";
	
	tournaments += "\n" + "> Type the number of your choice into chat OR type 'exit' to exit the menu```";
	TTBT.createMessage(msg.channel.id, tournaments);
	
	getTournament(sortedList, msg);
}

function getTournament(sortedList, msg) {
	function waitMessage (newMsg) {
		if (newMsg.author.id === msg.author.id && newMsg.channel.id === msg.channel.id) {
			if (!isNaN(newMsg.content) && newMsg.content != 0) {
				TTBT.removeListener('messageCreate', waitMessage, true); 

				loadTournament(sortedList, sortedList[Number(newMsg.content) - 1], msg);
			}
			else if (newMsg.content === 'exit') { 
				TTBT.createMessage(msg.channel.id, 'You have exited the menu');
				TTBT.removeListener('messageCreate', waitMessage, true); 
				session.challonge.user.filter((user) => {return user.id === msg.author.id})[0].session = false;
			}
		}
	}	
	
	TTBT.on('messageCreate', waitMessage);
	
	setTimeout(() => {
		TTBT.removeListener('messageCreate', waitMessage);
		session.challonge.user.filter((user) => {return user.id === msg.author.id})[0].session = false;
	}, 30 * 1000)
}

function loadTournament(sortedList, challongeData, msg) {
	
	fetch('https://api.challonge.com/v1/tournaments/' + sortedList[0].tournament.subdomain + '-' + challongeData.tournament.url + '/participants.json?api_key=' + process.env['CHALLONGE_API_KEY'] + '&subdomain=' + sortedList[0].tournament.subdomain)
	.then((response, err) => {
		if (response.ok)
			return response.json();
		else {
			session.challonge.user.filter((user) => {return user.id === msg.author.id})[0].session = false;
			throw new TypeError("No JSON to parse!");
		}
	})
	.then(response => printResults(response, challongeData, msg))
	.catch(err => {
		TTBT.createMessage(msg.channel.id, "Something went wrong :/");
		session.challonge.user.filter((user) => {return user.id === msg.author.id})[0].session = false;
	})
}

function printResults(lbData, challongeData, msg) {
	let ranks = {'rank': []};
	let results = "```Markdown\n*Results for " + challongeData.tournament.name + " (up to top 8)*\n\n";
		
	for (let i = 0; i < lbData.length; i++) {
		if (lbData[0].participant.final_rank !== null) {
			ranks.rank.push({
				placing: lbData[i].participant.final_rank,
				player: lbData[i].participant.name
			});
		}
	}
	
	if (ranks.rank.length > 0) {
		let range = ranks.rank.length < 8 ? ranks.rank.length : 8;
		
		let sortedRanks = ranks.rank.sort((a, b) => {return a.placing - b.placing});
		
		for (let i = 0; i < range; i++)
			results += "[" + sortedRanks[i].placing + "] " + sortedRanks[i].player + "\n";
		
		TTBT.createMessage(msg.channel.id, results + "```\n**Bracket Link: " + challongeData.tournament.full_challonge_url + " **");
	}
	else
		TTBT.createMessage(msg.channel.id, "This tournament is still ongoing\n```\n**Bracket Link: " + challongeData.tournament.full_challonge_url + "**");
	
	session.challonge.user.filter((user) => {return user.id === msg.author.id})[0].session = false;
}