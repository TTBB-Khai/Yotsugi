//'use strict';

const request = require('request');
const cheerio = require('cheerio');

TTBT.registerCommand("strawpoll", (msg) => {
	strawpollTitle(msg);
},	{
		cooldown: 5000,
		caseInsensitive: true,
		cooldownMessage: "Slow down buddy! This command has a **5 second cooldown!**",
		requirements: {
			"manageMessages": true
		}
	}
);

function strawpollTitle(msg) {
	TTBT.createMessage(msg.channel.id, "Name the title of your strawpoll (Or type exit to exit):");
	
	function waitForYourMessage (newMsg) {
		if (newMsg.author.id === msg.author.id && newMsg.channel.id === msg.channel.id) {
			if (newMsg.content.toLowerCase() === "exit") {
				TTBT.removeListener('messageCreate', waitForYourMessage, true); 
				TTBT.createMessage(msg.channel.id, "You have exited the menu.");
			}
			else {
				TTBT.removeListener('messageCreate', waitForYourMessage, true); 
				
				Promise.all([
					Promise.resolve(msg),
					Promise.resolve(newMsg.content)
				])
				.then(data => strawPollNumberOfChoices(data))
				.catch(err => TTBT.createMessage(msg.channel.id, "The menu has been cancelled."))
			}
		}
	}	
	
	TTBT.on('messageCreate', waitForYourMessage);
	
	setTimeout(() => {
		TTBT.removeListener('messageCreate', waitForYourMessage);
	}, 30 * 1000)
}

function strawPollNumberOfChoices(promiseData) {
	TTBT.createMessage(promiseData[0].channel.id, "Enter the number of choices your strawpoll will include.\n"
	 + "Must be a number less than or equal to 30, and greater than or equal to 2.\n"
	 + "(Or type anything else to exit):");
		
	function waitForYourMessage (newMsg) {
		if (newMsg.author.id === promiseData[0].author.id && newMsg.channel.id === promiseData[0].channel.id) {
			if (isNaN(newMsg.content)) {
				TTBT.removeListener('messageCreate', waitForYourMessage, true); 
				TTBT.createMessage(promiseData[0].channel.id, "You have exited the menu.");
			}
			else if (newMsg.content == 0) { 
				TTBT.removeListener('messageCreate', waitForYourMessage, true); 
				TTBT.createMessage(promiseData[0].channel.id, "You have exited the menu.");
			}
			else if (Number(newMsg.content) > 30) { 
				TTBT.removeListener('messageCreate', waitForYourMessage, true); 
				TTBT.createMessage(promiseData[0].channel.id, "You have exited the menu.");
			}
			else {
				TTBT.removeListener('messageCreate', waitForYourMessage, true); 

				Promise.all([
					Promise.resolve(promiseData[0]),
					Promise.resolve(promiseData[1]),
					Promise.resolve(newMsg.content)
				])
				.then(data => strawPollChoices(data))
				.catch(err => TTBT.createMessage(promiseData[0].channel.id, "The menu has been cancelled."))
			}
		}
	}
	
	TTBT.on('messageCreate', waitForYourMessage);
	
	setTimeout(() => {
		TTBT.removeListener('messageCreate', waitForYourMessage);
	}, 30 * 1000)
}

function strawPollChoices(promiseData) {
	
	TTBT.createMessage(promiseData[0].channel.id, "Enter your choice:");

	function waitForYourMessage (newMsg) {
		if (newMsg.author.id === promiseData[0].author.id && newMsg.channel.id === promiseData[0].channel.id) {
			TTBT.removeListener('messageCreate', waitForYourMessage, true);
				
			Promise.all([
				Promise.resolve(promiseData[0]),
				Promise.resolve(promiseData[1]),
				Promise.resolve(newMsg.content)
			])
			.then(data => {
				loadStrawpoll(data);
			})
			//.catch(err => TTBT.createMessage(promiseData[0].channel.id, "The menu has been cancelled."))
		}
	}
	
	TTBT.on('messageCreate', waitForYourMessage);	
		
	setTimeout(() => {
		TTBT.removeListener('messageCreate', waitForYourMessage);
	}, 30 * 1000)
}

function loadStrawpoll(promiseData) {
	request.post({
		url: 'https://strawpoll.me/api/v2/polls',
		headers: {
			'Content-Type': 'application/json'
		},
		followAllRedirects: true,
		body: {
			'title': promiseData[1],
			'options': [
				promiseData[2],
				'Option #2'
			]
		},
		json: true
	}, function (error, response) {
		if (response.statusCode > 399)
			TTBT.createMessage(promiseData[0].channel.id, "Failed to load strawpoll.me")
		else {
			let $ = cheerio.load(response.body);
			console.log($('id').text().trim());
		}
	})
}