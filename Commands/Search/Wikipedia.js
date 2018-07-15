//'use strict';

const fetch = require('node-fetch');
const path = require('path')
const session = require(path.join(process.cwd(), 'res', 'data', 'session.json'));

global.Promise = require('bluebird');

var wikiCommand = TTBT.registerCommand("wikipedia", (msg, args) => {
	if(args.length === 0)
		return "Incorrect usage. Correct usage: **" + process.env['CLIENT_PREFIX'] + "wikipedia [SEARCH QUERY HERE]**";
	
	if (typeof(session.wiki.user.filter((user) => {return user.id === msg.author.id})[0]) === 'undefined')
		session.wiki.user.push({"id": msg.author.id, "session": false});
	
	if (!session.wiki.user.filter((user) => {return user.id === msg.author.id})[0].session) {
		let search = args.join(" ").replace(/\s/g, "%20");
		session.wiki.user.filter((user) => {return user.id === msg.author.id})[0].session = true;
		loadWikiList(search, msg);
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

function loadWikiList(search, msg) {

	TTBT.sendChannelTyping(msg.channel.id);
	
	fetch('https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=' + search +'&srwhat=text&srprop=timestamp&format=json')
	.then((response, err) => {
		if (response.ok)
			return response.json();
		else 
			throw new TypeError("No JSON to parse!");
	})
	.then(data => {
		printWikiList(data, msg);
		return data;
	})
	.then(data => {
		if (data.query.search.length !== 0) 
			getArticle(data, msg);
	})
	.catch(err => {
		TTBT.createMessage(msg.channel.id, "No articles found with this search.");
		session.wiki.user.filter((user) => {return user.id === msg.author.id})[0].session = false;
	})
}

function printWikiList(wikiData, msg) {
	let list = '```Markdown\n';
	list += wikiData.query.search.length === 0 ? 'No articles found with this search' : ' * Related Articles * \n\n';
		
	for (let i = 0; i <= wikiData.query.search.length - 1; i++)
		list += '[' + (i + 1) + '] ' + wikiData.query.search[i].title + '\n';
	
	if (wikiData.query.search.length !== 0)
		list += '\n' + '> Type the number of your choice into chat OR type "exit" to exit the menu';
	else
		session.wiki.user.filter((user) => {return user.id === msg.author.id})[0].session = false;
	
	TTBT.createMessage(msg.channel.id, list + '```');
}

function getArticle(wikiData, msg) {
	function waitForYourMessage (newMsg) {
		try {
			if (newMsg.author.id === msg.author.id && newMsg.channel.id === msg.channel.id) {
				if (!isNaN(newMsg.content) && newMsg.content != 0) {
					TTBT.removeListener('messageCreate', waitForYourMessage, true);

					TTBT.createMessage(msg.channel.id, 
					'**Here is your Wikipedia article on ' + wikiData.query.search[Number(newMsg.content) - 1].title + 
					': __https://en.wikipedia.org/wiki/' + wikiData.query.search[Number(newMsg.content) - 1].title.replace(/\s/g, "_") + '__ **');
					
					session.wiki.user.filter((user) => {return user.id === msg.author.id})[0].session = false;
				}
				else if (newMsg.content === 'exit') { 
					TTBT.createMessage(msg.channel.id, 'You have exited the menu');
					TTBT.removeListener('messageCreate', waitForYourMessage, true); 
					session.wiki.user.filter((user) => {return user.id === msg.author.id})[0].session = false;
				}
			}
				
			setTimeout(() => {
				TTBT.removeListener('messageCreate', waitForYourMessage, true);
				session.wiki.user.filter((user) => {return user.id === msg.author.id})[0].session = false;
			}, 30 * 1000)
			
		}
		catch (err) {
			TTBT.createMessage(msg.channel.id, 'You have exited the menu');
			TTBT.removeListener('messageCreate', waitForYourMessage, true); 
			session.wiki.user.filter((user) => {return user.id === msg.author.id})[0].session = false;
		}
	}	
	
	TTBT.on('messageCreate', waitForYourMessage);
}

TTBT.registerCommandAlias("wiki", "wikipedia");