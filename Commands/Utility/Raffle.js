const path = require('path');
const { delay: wait } = require(path.join(process.cwd(), 'Utils', 'Delay.js'));
const session = require(path.join(process.cwd(), 'res', 'data', 'session.json'));
const badge = require(path.join(process.cwd(), 'res', 'data', 'badges.json'));
const output = require(path.join(process.cwd(), 'res', 'messages', 'output.json'));
const fs = require('fs');
const { responder: responder } = require(path.join(process.cwd(), 'Utils', 'Responder.js'));


TTBT.registerCommand("raffle", (msg) => {
	
	if (typeof(badge.user.filter(user => user.id === msg.author.id)[0]) === 'undefined') {
		badge.user.push({"id": msg.author.id, "badges": [":name_badge:"]});
		fs.writeFile((path.join(process.cwd(), 'res', 'data', 'badges.json')), JSON.stringify(badge), err => {
			if (err) console.log(err);
		});
	}
	
	if (!msg.channel.guild)
		return "This command only works in a server.";
	
	if (typeof(session.raffle.guild.filter(server => server.id === msg.channel.guild.id)[0]) === 'undefined')
		session.raffle.guild.push({"id": msg.channel.guild.id, "session": false});
	
	if (!session.raffle.guild.filter(server => server.id === msg.channel.guild.id)[0].session) {
		TTBT.createMessage(msg.channel.id, "Raffle has started! Type **'raffle'** to enter!\nRaffle ends in **60 seconds**!")
		.then(message => wait(30000)
		.then(() => message.channel.editMessage(message.id, "Raffle has started! Type **'raffle'** to enter!\nRaffle ends in **30 seconds**!")
		.then(message => wait(20000)
		.then(() => message.channel.editMessage(message.id, "Raffle has started! Type **'raffle'** to enter!\nRaffle ends in **10 seconds**!")
		.then(message => wait(5000)
		.then(() => message.channel.editMessage(message.id, "Raffle has started! Type **'raffle'** to enter!\nRaffle ends in **5 seconds**!")
		.then(message => wait(4000)
		.then(() => message.channel.editMessage(message.id, "Raffle has started! Type **'raffle'** to enter!\nRaffle ends **NOW!**")
		))))))))
		.catch(err => "No perms")
		
		session.raffle.guild.filter(server => server.id === msg.channel.guild.id)[0].session = true;
		let rafflers = [];
		getRaffles(msg, rafflers);
	}
	else
		return ":x: | There is already a raffle in this server!";	
	
},	{
		cooldown: 5000,
		caseInsensitive: true,
		cooldownMessage: "Slow down buddy! This command has a **5 second cooldown!**",
		requirements: {
			"manageMessages": true
		}
	}
);

const getRaffles = (msg, rafflers) => {
	const waitMessage = (newMsg) => {
		if (newMsg.channel.id === msg.channel.id) {
			if (newMsg.content.toLowerCase() === 'raffle') {
				if (typeof(rafflers.filter(user => user.id === newMsg.author.id)[0]) === 'undefined') {
					rafflers.push({"id": newMsg.author.id, "user": `${newMsg.author.username}#${newMsg.author.discriminator}`});
				
					TTBT.createMessage(msg.channel.id, `**${newMsg.author.username}#${newMsg.author.discriminator}** has joined the raffle!`)
					.then(message => wait(3000).then(() => message.delete()
					.then(() => wait(1000).then(() => newMsg.delete()))))
					.catch(err => "No perms")
				}
				else {
					TTBT.createMessage(msg.channel.id, `:x: | **${newMsg.author.username}#${newMsg.author.discriminator}**, you are already in the raffle!`)
					.then(message => wait(3000).then(() => message.delete()
					.then(() => wait(1000).then(() => newMsg.delete()))))
					.catch(err => "No perms")
				}				
			}
			// else if (newMsg.channel.guild.members.get(newMsg.author.id).permission.has("manageMessages") 
				// && newMsg.content.toLowerCase().startsWith(process.env['CLIENT_PREFIX'] + "r ")) {
				// if (rafflers.indexOf(newMsg.content.substr(newMsg.content.indexOf(' ') + 1)) === -1) {
					// rafflers.push(newMsg.content.substr(newMsg.content.indexOf(' ') + 1));
					
					// TTBT.createMessage(msg.channel.id, `**${newMsg.content.substr(newMsg.content.indexOf(' ') + 1)}** has joined the raffle!`)
					// .then(message => wait(3000).then(() => message.delete()
					// .then(() => wait(1000).then(() => newMsg.delete()))))
					// .catch(err => "No perms")
				// }
				// else {
					// TTBT.createMessage(msg.channel.id, `:x: | **${newMsg.content.substr(newMsg.content.indexOf(' ') + 1)}** is already in the raffle!`)
					// .then(message => wait(3000).then(() => message.delete()
					// .then(() => wait(1000).then(() => newMsg.delete()))))
					// .catch(err => "No perms")
				// }
			// }
		}
	}	
	
	TTBT.on('messageCreate', waitMessage);
	
	setTimeout(() => {
		TTBT.removeListener('messageCreate', waitMessage);
		getWinner(msg, rafflers);
	}, 60 * 1000)
	
	delete(promiseData);
}

const getWinner = async (msg, rafflers) => {
	
	if (rafflers.length > 0) {
		let notChoice = "";
		let almostChoice = "";
		let closeChoice = "";
		let choice = "";
		
		for (let i = 0; i < rafflers.length; i++) {
			let notWinner = ~~(Math.random() * (rafflers.length - 1 + 1)) + 0;
			let almostWinner = ~~(Math.random() * (rafflers.length - 1 + 1)) + 0;
			let closeWinner = ~~(Math.random() * (rafflers.length - 1 + 1)) + 0;
			let winner = ~~(Math.random() * (rafflers.length - 1 + 1)) + 0;

			notChoice = rafflers[notWinner].user;
			almostChoice = rafflers[almostWinner].user;
			closeChoice = rafflers[closeWinner].user;
			choice = rafflers[winner];
		}
		
		if (typeof(badge.user.filter(user => user.id === choice.id)[0]) === 'undefined') {
			badge.user.push({"id": choice.id, "badges": [":name_badge:"]});
			fs.writeFile((path.join(process.cwd(), 'res', 'data', 'badges.json')), JSON.stringify(badge), err => {
				if (err) console.log(err);
			});
		}
		
		TTBT.createMessage(msg.channel.id, `Raffle has ended! The winner is...\n ${notChoice}`)
		.then(message => wait(1000).then(() => message.channel.editMessage(message.id, `Raffle has ended! The winner is...\n ${almostChoice}`)
		.then(message => wait(2000).then(() => message.channel.editMessage(message.id, `Raffle has ended! The winner is...\n ${closeChoice}`)
		.then(message => wait(1000).then(() => message.channel.editMessage(message.id, `Raffle has ended! The winner is...\n :tada: **${choice.user}** :tada:`)
		.then(() => {
			if (!badge.user.filter(user => user.id === choice.id)[0].badges.find(badge => badge === ":tada:")) {
				TTBT.getDMChannel(choice.id).then(channel => {
					TTBT.createMessage(channel.id, responder({user: "You", badge: ":tada:"}, output.badge.message));
				});
				badge.user.filter(user => user.id === choice.id)[0].badges.push(":tada:");
				fs.writeFile((path.join(process.cwd(), 'res', 'data', 'badges.json')), JSON.stringify(badge), err => {
					if (err) console.log(err);
				});
			}
		})
		))))))
		.catch(err => "No perms")
	}
	else
		TTBT.createMessage(msg.channel.id, "Nobody entered the raffle, so nobody wins. :frowning:");
	
	session.raffle.guild.filter(server => server.id === msg.channel.guild.id)[0].session = false;
	delete rafflers;
}