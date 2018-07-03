const path = require('path')
const session = require(path.join(process.cwd(), 'res', 'data', 'session.json'));
const fetch = require('node-fetch');
const cheerio = require('cheerio');

var lyricsCommand = TTBT.registerCommand("lyrics", (msg, args) => {
	if(args.length === 0)
		return "Incorrect usage. Correct usage: **" + process.env['CLIENT_PREFIX'] + "lyrics [SONG HERE]**";
	
	if (typeof(session.genius.user.filter(function (user) {return user.id === msg.author.id})[0]) === 'undefined')
		session.genius.user.push({"id": msg.author.id, "session": false});
	
	if (!session.genius.user.filter(function (user) {return user.id === msg.author.id})[0].session) {
		let song = args.join(" ").replace(/\s/g, "%20");
		session.genius.user.filter(function (user) {return user.id === msg.author.id})[0].session = true;
		loadSongList(song, msg);
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

function loadSongList(song, msg) {
	async function getURL() {
		try {
			let response = await fetch('https://api.genius.com/search?q=' + song + '&access_token=' + process.env['GENIUS_ACCESS_TOKEN']);
			return await response.json();
		}
		catch (err) {
			TTBT.createMessage(msg.channel.id, "Failed to load genius.com");
			throw err;
		}
	}
		
	TTBT.sendChannelTyping(msg.channel.id);
		
	Promise.all([
		Promise.resolve(getURL()),
		Promise.resolve(msg)
	])
	.then(data => {
		printSongList(data);
		return data;
	})
	.then(data => {
		if (data[0].response.hits.length !== 0) 
			getSong(data);
	})
	.catch(err => {
		TTBT.createMessage(msg.channel.id, "If you are the owner, to set up this command, please refer to the README.");
		session.genius.user.filter(function (user) {return user.id === msg.author.id})[0].session = false;
	})
}

function printSongList(promiseData) {
	let songs = '```Markdown\n';
	songs += promiseData[0].response.hits.length === 0 ? 'No songs found with this search' : ' * Related Songs * \n\n';
		
	for (let i = 0; i <= promiseData[0].response.hits.length - 1; i++)
		songs += '[' + (i + 1) + '] ' + promiseData[0].response.hits[i].result.full_title + '\n';
	
	if (promiseData[0].response.hits.length !== 0)
		songs += '\n' + '> Type the number of your choice into chat OR type "cancel" to exit the menu';
	
	TTBT.createMessage(promiseData[1].channel.id, songs + '```');
	
	delete(promiseData);
}

function getSong(promiseData) {
	function waitForYourMessage (newMsg) {
		if (newMsg.author.id === promiseData[1].author.id && newMsg.channel.id === promiseData[1].channel.id) {
			if (!isNaN(newMsg.content) && newMsg.content != 0) {
				TTBT.removeListener('messageCreate', waitForYourMessage, true); 

				Promise.all([
					Promise.resolve(promiseData[0].response.hits[Number(newMsg.content) - 1]),
					Promise.resolve(promiseData[1]),
					Promise.resolve(promiseData[2])
				])
				.then(data => loadLyrics(data))
				.catch(err => {
					TTBT.createMessage(promiseData[1].channel.id, 'You entered something invalid. The menu has been cancelled.');
					session.genius.user.filter(function (user) {return user.id === promiseData[1].author.id})[0].session = false;
				})
			}
			else if (newMsg.content === 'exit') { 
				TTBT.createMessage(promiseData[1].channel.id, 'You have exited the menu');
				TTBT.removeListener('messageCreate', waitForYourMessage, true); 
				session.genius.user.filter(function (user) {return user.id === promiseData[1].author.id})[0].session = false;
			}
		}
	}	
	
	TTBT.on('messageCreate', waitForYourMessage);
	
	setTimeout(() => {
		TTBT.removeListener('messageCreate', waitForYourMessage);
		session.genius.user.filter(function (user) {return user.id === promiseData[1].author.id})[0].session = false;
	}, 30 * 1000)
	
	delete(promiseData);
}

function loadLyrics(promiseData) {
	async function getURL() {
		try {
			let response = await fetch(promiseData[0].result.url);
			let text = await response.text();
			let $ = cheerio.load(text);
			return $('.lyrics').text().trim();
		}
		catch (err) {
			TTBT.createMessage(promiseData[1].channel.id, "Failed to load genius.com");
			throw err;
		}
	}
		
	TTBT.sendChannelTyping(promiseData[1].channel.id);
		
	Promise.all([
		Promise.resolve(getURL()),
		Promise.resolve(promiseData[1]),
		Promise.resolve(promiseData[0])
	])
	.then(data => printLyrics(data))
	.catch(err => {
		TTBT.createMessage(promiseData[1].channel.id, "No songs found with this search.");
		session.genius.user.filter(function (user) {return user.id === promiseData[1].author.id})[0].session = false;
	})
}

function printLyrics(promiseData) {
	let output = (promiseData[0].length < 2000) ? '```Markdown\n' + promiseData[0] + '\n```' 
	: 'These lyrics are too long to fit in a discord message ):\n **Here is a link to the full lyrics: ' + promiseData[2].result.url + '**';
	
	TTBT.createMessage(promiseData[1].channel.id, output);
	session.genius.user.filter(function (user) {return user.id === promiseData[1].author.id})[0].session = false;
}

TTBT.registerCommandAlias("lyric", "lyrics");