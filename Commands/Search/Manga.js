//'use strict';

const path = require('path')
const session = require(path.join(process.cwd(), 'res', 'data', 'session.json'));
const fetch = require('node-fetch');
const parseString = require('xml2js').parseString;
global.Promise = require('bluebird');

const userpass = process.env['MAL_USERNAME'] + ':' + process.env['MAL_PASSWORD'];
const basicAuth = 'Basic ' + Buffer.from(userpass).toString('base64');

TTBT.registerCommand("manga", (msg, args) => {
	if(args.length === 0)
		return "Incorrect usage. Correct usage: " + process.env['CLIENT_PREFIX'] + "**manga [manga TITLE HERE]**";
	
	if (typeof(session.mal.user.filter((user) => {return user.id === msg.author.id})[0]) === 'undefined')
		session.mal.user.push({"id": msg.author.id, "session": false});

	if (!session.mal.user.filter((user) => {return user.id === msg.author.id})[0].session) {
		let manga = args.join(" ").replace(/\s/g, "%20");
		session.mal.user.filter((user) => {return user.id === msg.author.id})[0].session = true;
		loadmangaList(manga, msg);
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

function loadmangaList(manga, msg) {	

	TTBT.sendChannelTyping(msg.channel.id);
	
	fetch('https://myanimelist.net/api/manga/search.xml?q=' + manga, { 
		method: 'GET', 
		headers: {
			'Authorization': basicAuth,
			'Content-Type': 'application/xml',
			'encoding': 'UTF-8',
			'version': '1.0'
		}
	})
	.then((response, err) => {
		if (response.ok)
			return response.text();
		else {
			session.mal.user.filter((user) => {return user.id === msg.author.id})[0].session = false;
			throw new TypeError("No XML to parse!");
		}
	})
	.then(response => {
		printmangaList(response, msg);
		return response;
	})
	.then(response => {
		if (response.length !== 0) 
			getmanga(response, msg);
	})
	.catch(err => {
		TTBT.createMessage(msg.channel.id, "MAL has their API disabled at the moment ):.");
		session.mal.user.filter((user) => {return user.id === msg.author.id})[0].session = false;
	})
}

function printmangaList(mangaData, msg) {
	parseString(mangaData, (err, results) => {
		let manga = '```Markdown\n';
		manga += results.manga.entry.length === 0 ? 'No manga found with this search' : ' * Related manga * \n\n';
		
		for (let i = 0; i <= results.manga.entry.length - 1; i++)
			manga += '[' + (i + 1) + '] ' + results.manga.entry[i].title + '\n';
	
		if (results.manga.entry.length !== 0)
			manga += '\n' + '> Type the number of your choice into chat OR type "exit" to exit the menu';
		else
			session.mal.user.filter((user) => {return user.id === msg.author.id})[0].session = false;
	
		TTBT.createMessage(msg.channel.id, manga + '```');
	});
}

function getmanga(mangaData, msg) {
	function waitForYourMessage (newMsg) {
		parseString(mangaData, (err, results) => {
			if (newMsg.author.id === msg.author.id && newMsg.channel.id === msg.channel.id) {
				if (!isNaN(newMsg.content) && newMsg.content != 0) {
					TTBT.removeListener('messageCreate', waitForYourMessage, true); 
						
					let synopsis = results.manga.entry[Number(newMsg.content) - 1].synopsis;
					synopsis = ("" + synopsis).replace(/&#039;|&rsquo;/ig, "'");
					synopsis = ("" + synopsis).replace(/&quot;/ig, "\"");
					synopsis = ("" + synopsis).replace(/&mdash;/ig, "—");
					// synopsis = ("" + synopsis).replace(/([/?i])/ig, "*");
					synopsis = ("" + synopsis).replace(/&eacute;/ig, "é");
					synopsis = ("" + synopsis).replace(/<br \/>/ig, "");

					TTBT.createMessage(msg.channel.id, "**" + results.manga.entry[Number(newMsg.content) - 1].title + "**\n\n"
						+ "**Chapters:** " + results.manga.entry[Number(newMsg.content) - 1].chapters + "\n"
						+ "**Volumes:** " + results.manga.entry[Number(newMsg.content) - 1].volumes + "\n"
						+ "**Score:** " + results.manga.entry[Number(newMsg.content) - 1].score + "\n"
						+ "**Type:** " + results.manga.entry[Number(newMsg.content) - 1].type + "\n" 
						+ "**Status:** " + results.manga.entry[Number(newMsg.content) - 1].status + "\n"
						+ "**Start Date:** " + results.manga.entry[Number(newMsg.content) - 1].start_date + "\n"
						+ "**End Date:** " + results.manga.entry[Number(newMsg.content) - 1].end_date + "\n\n" 
						+ "**Synopsis:** \n" + synopsis + "\n"
						+ results.manga.entry[Number(newMsg.content) - 1].image + "\n");
						
					session.mal.user.filter((user) => {return user.id === msg.author.id})[0].session = false;
				}
				else if (newMsg.content === 'exit') { 
					TTBT.createMessage(msg.channel.id, 'You have exited the menu');
					TTBT.removeListener('messageCreate', waitForYourMessage, true); 
					session.mal.user.filter((user) => {return user.id === msg.author.id})[0].session = false;
				}
			}
		})
	}
	
	TTBT.on('messageCreate', waitForYourMessage);
	
	setTimeout(() => {
		TTBT.removeListener('messageCreate', waitForYourMessage);
		session.mal.user.filter((user) => {return user.id === msg.author.id})[0].session = false;
	}, 30 * 1000)
}