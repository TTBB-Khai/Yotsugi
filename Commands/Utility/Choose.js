const path = require('path');
const badge = require(path.join(process.cwd(), 'res', 'data', 'badges.json'));
const fs = require('fs');
const { responder: responder } = require(path.join(process.cwd(), 'Utils', 'Responder.js'));

TTBT.registerCommand("choose", (msg, args) => {
	
	if (typeof(badge.user.filter(user => user.id === msg.author.id)[0]) === 'undefined') {
		badge.user.push({"id": msg.author.id, "badges": [":name_badge:"]});
		fs.writeFile((path.join(process.cwd(), 'res', 'data', 'badges.json')), JSON.stringify(badge), err => {
			if (err) {
				console.log(err);
			}
		});
	}
	
	if (args.length === 0 || args.join("").indexOf("|") < 0)
		return "Incorrect usage. Type **" + process.env['CLIENT_PREFIX'] + "help choose** for more info";
	
	let chooseArray = args.join(" ").split(" ").join("").split("|");
	let randomChoose = chooseArray[Math.random() * chooseArray.length | 0];
	
	if (randomChoose.toLowerCase() === 'pikachu' && !badge.user.filter(user => user.id === msg.author.id)[0].badges.find(badge => badge === ":rat:")) {
		TTBT.getDMChannel(msg.author.id).then(channel => {
		  TTBT.createMessage(channel.id, responder({badge: ":rat:"}, badge.message));
		});
		badge.user.filter(user => user.id === msg.author.id)[0].badges.push(":rat:");
		fs.writeFile((path.join(process.cwd(), 'res', 'data', 'badges.json')), JSON.stringify(badge), err => {
			if (err) {
				console.log(err);
			}
		});
	}
	
	return ":thinking: | I choose **" + randomChoose + "**";
	
},	{
		caseInsensitive: true,
		cooldown: 3000,
		cooldownMessage: "Slow down! This command has a **3 second cooldown!**",
		requirements: {
			"manageMessages": true
		}
	}
)