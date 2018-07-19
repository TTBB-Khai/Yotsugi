//'use strict';

const path = require('path')
const session = require(path.join(process.cwd(), 'res', 'data', 'session.json'));

var karaokeCommand = TTBT.registerCommand("karaoke", (msg) => {
	
	if (!msg.channel.guild)
		return "This command only works in a server.";
	
	if (typeof(session.karaoke.guild.filter((server) => {return server.id === msg.channel.guild.id})[0]) === 'undefined')
		session.karaoke.guild.push({"id": msg.channel.guild.id, "session": false, "current": "N/A", "next": "N/A"});
		
	if (!session.karaoke.guild.filter((server) => {return server.id === msg.channel.guild.id})[0].session) {
		let singers = [];
		
		TTBT.createMessage(msg.channel.id, "**Karaoke has started!** Hosted by the lovely, **" + msg.author.username + "**!\n"
			+ "**Type ':microphone:' to join!**\n"
			+ "Type **'queue'** to peek at the queue!\n" 			
			+ "If you are the host and need help with the sub commands, type **" + process.env['CLIENT_PREFIX'] + "help karaoke**");
			
		session.karaoke.guild.filter((server) => {return server.id === msg.channel.guild.id})[0].session = true;
		getSingers(msg, singers);
	}
	else
		return ":x: | There is already a karaoke session in this server!";	
},	{
		cooldown: 5000,
		caseInsensitive: true,
		cooldownMessage: "Slow down buddy! This command has a **5 second cooldown!**",
		requirements: {
			"manageMessages": true
		}
	}
);

function getSingers(msg, singers) {
	
	function waitForYourMessage (newMsg) {
		if (newMsg.channel.id === msg.channel.id) {
			const lookupCommand = {
				'🎤' : () => {
					if (singers.indexOf(newMsg.author.username) === -1) {
						singers.push(newMsg.author.username);
						TTBT.removeListener('messageCreate', waitForYourMessage, true); 
						TTBT.createMessage(msg.channel.id, "**" + newMsg.author.username + "** has joined the queue!");
						getSingers(msg, singers);
					}
					else {
						TTBT.removeListener('messageCreate', waitForYourMessage, true); 
						TTBT.createMessage(msg.channel.id, ":x: | **" + newMsg.author.username + "**, you are already in the queue!");
						getSingers(msg, singers);
					}
				},
				'queue': () => {
					TTBT.removeListener('messageCreate', waitForYourMessage, true);
					peekQueue(msg, singers);
					getSingers(msg, singers);
				},
				'start': () => {
					if (newMsg.author.id === msg.author.id && newMsg.channel.id === msg.channel.id) {
						TTBT.removeListener('messageCreate', waitForYourMessage, true);
						startQueue(msg, singers);
					}
				},
				'skip': () => {
					if (newMsg.author.id === msg.author.id && newMsg.channel.id === msg.channel.id) {
						TTBT.removeListener('messageCreate', waitForYourMessage, true);
						skipQueue(msg, singers);
					}			
				},
				'end': () => {
					TTBT.removeListener('messageCreate', waitForYourMessage, true);
					if (singers.length > 0) {
						TTBT.createMessage(msg.channel.id, "**WARNING:** There are still users in the queue! Are you sure you want to end this session?\n"
							+ "**Type 'yes' to end the session or type 'no' to continue it.**");
							
							function areYouSure(newerMsg) {
								if (newerMsg.channel.id === msg.channel.id && newerMsg.author.id === msg.author.id) {
									if (newerMsg.content.toLowerCase() === 'yes') {
										TTBT.removeListener('messageCreate', areYouSure, true);
										delete singers;
										endKaraoke(msg);
									}
									else if (newerMsg.content.toLowerCase() === 'no') {
										TTBT.removeListener('messageCreate', areYouSure, true);
										TTBT.createMessage(msg.channel.id, "**Karaoke will now continue!**");
										
										getSingers(msg, singers);
									}
								}
							}
							
							TTBT.on('messageCreate', areYouSure);
		
							setTimeout(() => {
								TTBT.removeListener('messageCreate', areYouSure);
								getSingers(msg, singers);
							}, 30 * 1000)
					}
					else
						endKaraoke(msg);
				}	
			}
			
			return (typeof lookupCommand[newMsg.content.toLowerCase()] !== 'function') ? 0 : lookupCommand[newMsg.content.toLowerCase()]();
		}
	}	
	
	TTBT.on('messageCreate', waitForYourMessage);
}

function peekQueue(msg, singers) {
	
	if (singers.length === 0)
		printEmpty(msg);
	else {
		session.karaoke.guild.filter((server) => {return server.id === msg.channel.guild.id})[0].next = singers[0];
		
		let text = "**Host: " + msg.author.username + "**\n\n"
			+ "**Type ':microphone:' to join!**\n"
			+ "Type **'start'** to allow the next person in queue to sing!\n"
			+ "Type **'skip'** to skip the next person in queue!\n\n"
			+ ":musical_note: **Currently Singing:** " + session.karaoke.guild.filter((server) => {return server.id === msg.channel.guild.id})[0].current + "\n"
			+ ":arrow_right: **Up Next:** " + session.karaoke.guild.filter((server) => {return server.id === msg.channel.guild.id})[0].next + "\n"
			+ "**\n__Current queue:__**\n ```";

		for (let i = 0; i < singers.length; i++)
			text += singers[i] + " \n";
		
		TTBT.createMessage(msg.channel.id, text + "\n```");
	}
}

function startQueue(msg, singers) {
	if (singers.length === 0)
		printEmpty(msg);
	else {
		session.karaoke.guild.filter((server) => {return server.id === msg.channel.guild.id})[0].current = singers.shift();
		TTBT.createMessage(msg.channel.id, "It is now **" + session.karaoke.guild.filter((server) => {return server.id === msg.channel.guild.id})[0].current 
		+ "'s** turn to sing!\n");
	}
	
	getSingers(msg, singers);
}

function skipQueue(msg, singers) {
	session.karaoke.guild.filter((server) => {return server.id === msg.channel.guild.id})[0].current = "N/A";
	
	if (singers.length === 0)
		printEmpty(msg);
	else
		TTBT.createMessage(msg.channel.id, "**" + singers.shift() + "** left the queue!");
	
	getSingers(msg, singers);
}  

function printEmpty(msg) {
	TTBT.createMessage(msg.channel.id,  ":musical_note: **Currently Singing:** " 
		+ session.karaoke.guild.filter((server) => {return server.id === msg.channel.guild.id})[0].current + " \n\n" 
		+ "The queue is now empty! Type ':microphone:' to join the queue!\n"
		+ "Or if you are the host, type **'end'** to end this session.");
		
	session.karaoke.guild.filter((server) => {return server.id === msg.channel.guild.id})[0].current = "N/A";
	session.karaoke.guild.filter((server) => {return server.id === msg.channel.guild.id})[0].next = "N/A";
}

function endKaraoke(msg) {
	TTBT.createMessage(msg.channel.id, "**Karaoke has now ended. Thank you for joining!**");
	session.karaoke.guild.filter((server) => {return server.id === msg.channel.guild.id})[0].session = false;
	session.karaoke.guild.filter((server) => {return server.id === msg.channel.guild.id})[0].current = "N/A";
	session.karaoke.guild.filter((server) => {return server.id === msg.channel.guild.id})[0].next = "N/A";
}
