const fetch = require('node-fetch');
const path = require('path')
const session = require(path.join(process.cwd(), 'res', 'data', 'session.json'));

var wikiCommand = TTBT.registerCommand("wikipedia", (msg, args) => {
	if(args.length === 0)
		return "Incorrect usage. Correct usage: **" + process.env['CLIENT_PREFIX'] + "wikipedia [SEARCH QUERY HERE]**";
	
	if (typeof(session.wiki.user.filter(function (user) {return user.id === msg.author.id})[0]) === 'undefined')
		session.wiki.user.push({"id": msg.author.id, "session": false});
	
	if (!session.wiki.user.filter(function (user) {return user.id === msg.author.id})[0].session) {
		let search = args.join(" ").replace(/\s/g, "%20");
		session.wiki.user.filter(function (user) {return user.id === msg.author.id})[0].session = true;
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
	async function getURL() {
		try {
			let response = await fetch('https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=' + search +'&srwhat=text&srprop=timestamp&format=json');
			return await response.json();
		}
		catch (err) {
			TTBT.createMessage(msg.channel.id, "Failed to load wikipedia.com");
			throw err;
		}
	}
	
	TTBT.sendChannelTyping(msg.channel.id);
		
	Promise.all([
		Promise.resolve(getURL()),
		Promise.resolve(msg)
	])
	.then(data => {
		printWikiList(data);
		return data;
	})
	.then(data => {
		if (data[0].query.search.length !== 0) 
			getArticle(data);
	})
	.catch(err => {
		TTBT.createMessage(msg.channel.id, "No articles found with this search.");
		session.wiki.user.filter(function (user) {return user.id === msg.author.id})[0].session = false;
	})
}

function printWikiList(promiseData) {
	let list = '```Markdown\n';
	list += promiseData[0].query.search.length === 0 ? 'No articles found with this search' : ' * Related Articles * \n\n';
		
	for (let i = 0; i <= promiseData[0].query.search.length - 1; i++)
		list += '[' + (i + 1) + '] ' + promiseData[0].query.search[i].title + '\n';
	
	if (promiseData[0].query.search.length !== 0)
		list += '\n' + '> Type the number of your choice into chat OR type "exit" to exit the menu';
	
	TTBT.createMessage(promiseData[1].channel.id, list + '```');
}

function getArticle(promiseData) {
	function waitForYourMessage (newMsg) {
		try {
			if (newMsg.author.id === promiseData[1].author.id && newMsg.channel.id === promiseData[1].channel.id) {
				if (!isNaN(newMsg.content) && newMsg.content != 0) {
					TTBT.removeListener('messageCreate', waitForYourMessage, true);

					TTBT.createMessage(promiseData[1].channel.id, 
					'**Here is your Wikipedia article on ' + promiseData[0].query.search[Number(newMsg.content) - 1].title + 
					': __https://en.wikipedia.org/wiki/' + promiseData[0].query.search[Number(newMsg.content) - 1].title.replace(/\s/g, "_") + '__ **');
					
					session.wiki.user.filter(function (user) {return user.id === promiseData[1].author.id})[0].session = false;
				}
				else if (newMsg.content === 'exit') { 
					TTBT.createMessage(promiseData[1].channel.id, 'You have exited the menu');
					TTBT.removeListener('messageCreate', waitForYourMessage, true); 
					session.wiki.user.filter(function (user) {return user.id === promiseData[1].author.id})[0].session = false;
				}
			}
				
			setTimeout(() => {
				TTBT.removeListener('messageCreate', waitForYourMessage, true);
				session.wiki.user.filter(function (user) {return user.id === promiseData[1].author.id})[0].session = false;
			}, 30 * 1000)
			
		}
		catch (err) {
			TTBT.createMessage(promiseData[1].channel.id, 'You have exited the menu');
			TTBT.removeListener('messageCreate', waitForYourMessage, true); 
			session.wiki.user.filter(function (user) {return user.id === promiseData[1].author.id})[0].session = false;
		}
	}	
	
	TTBT.on('messageCreate', waitForYourMessage);
}

TTBT.registerCommandAlias("wiki", "wikipedia");