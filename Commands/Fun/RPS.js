const path = require('path');
const badge = require(path.join(process.cwd(), 'res', 'data', 'badges.json'));
const fs = require('fs');
const { responder: responder } = require(path.join(process.cwd(), 'Utils', 'Responder.js'));
const { modulus: mod } = require(path.join(process.cwd(), 'Utils', 'Modulus.js'));

TTBT.registerCommand("rps", (msg, args) => {
	
	if (typeof(badge.user.filter(user => user.id === msg.author.id)[0]) === 'undefined') {
		badge.user.push({"id": msg.author.id, "badges": [":name_badge:"]});
		fs.writeFile((path.join(process.cwd(), 'res', 'data', 'badges.json')), JSON.stringify(badge), err => {
			if (err) console.log(err);
		});
	}
	
	let RPS = [{id:0, name:"Paper", code:'p', emote:":hand_splayed:"}, {id:1, name:"Rock", code:'r', emote:":fist:"}, {id:2, name:"Scissors", code:'s', emote:":v:"}];
	let randomRPS = RPS[Math.random() * RPS.length | 0];
	let choice = RPS.filter(rps => rps.code === args.join(" ").charAt(0).toLowerCase());

	if (choice.length > 0) {
		let result = mod((choice[0].id - randomRPS.id), 3);
		let output = result === 0 ? 
			`${choice[0].emote} **It's a tie!** ${randomRPS.emote}` 
			: result === 1 ? 
				`${choice[0].emote} **${msg.author.username} loses!** ${randomRPS.emote}` 
				: `${choice[0].emote} **${msg.author.username} wins!** ${randomRPS.emote}`;
				
		if (result === 0 && !badge.user.filter(user => user.id === msg.author.id)[0].badges.find(badge => badge === ":necktie:")) {
			TTBT.getDMChannel(msg.author.id).then(channel => {
				TTBT.createMessage(channel.id, responder({badge: ":necktie:"}, badge.message));
			});
			badge.user.filter(user => user.id === msg.author.id)[0].badges.push(":necktie:");
			fs.writeFile((path.join(process.cwd(), 'res', 'data', 'badges.json')), JSON.stringify(badge), err => {
				if (err) console.log(err);
			});
		}
		
		return `${choice[0].emote} | **${msg.author.username}** chooses **${choice[0].name}**\n`
				+ `${randomRPS.emote} | **I** choose **${randomRPS.name}**\n`
				+ `${output}`;
	}
	
	return `Incorrect usage. Correct usage: **${process.env['CLIENT_PREFIX']}rps [r/p/s]**`;
	
},	{
		cooldown: 3000,
		caseInsensitive: true,
		cooldownMessage: "Slow down buddy! This command has a **3 second cooldown!**",
		requirements: {
			"manageMessages": true
		}
	}
);