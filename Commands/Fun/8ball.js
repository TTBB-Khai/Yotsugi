const path = require('path');
const badge = require(path.join(process.cwd(), 'res', 'data', 'badges.json'));
const output = require(path.join(process.cwd(), 'res', 'messages', 'output.json'));
const fs = require('fs');
const { responder: responder } = require(path.join(process.cwd(), 'Utils', 'Responder.js'));

TTBT.registerCommand("8ball", (msg, args) => {
	if(args.length === 0)
		return "Incorrect usage. Correct usage: **" + process.env['CLIENT_PREFIX'] + "8ball [QUESTION HERE]**";
	
	if (typeof(badge.user.filter(user => user.id === msg.author.id)[0]) === 'undefined') {
		badge.user.push({"id": msg.author.id, "badges": [":name_badge:"]});
		fs.writeFile((path.join(process.cwd(), 'res', 'data', 'badges.json')), JSON.stringify(badge), err => {
			if (err) console.log(err);
		});
	}

	let random = ~~(Math.random() * (9 - 0 + 1)) + 0;
	const lookupBall = {
		0: "Yes",
		1: "No",
		2: "Absolutely",
		3: "Absolutely not",
		4: "Probably",
		5: "Most Likely",
		6: "Eh...sure why not",
		7: "Don't count on it",
		8: "Maybe",
		9: "IDK OKAY!? I QUIT THIS STUPID JOB!"
	}
	
	if (random === 9 && !badge.user.filter(user => user.id === msg.author.id)[0].badges.find(badge => badge === ":8ball:")) {
		TTBT.getDMChannel(msg.author.id).then(channel => {
			TTBT.createMessage(channel.id, responder({user: "You", badge: ":8ball:"}, output.badge.message));
		});
		badge.user.filter(user => user.id === msg.author.id)[0].badges.push(":8ball:");
		fs.writeFile((path.join(process.cwd(), 'res', 'data', 'badges.json')), JSON.stringify(badge), err => {
			if (err) console.log(err);
		});
	}
	
	return ":8ball: " + msg.author.mention + " **| " + lookupBall[random] + "**";
	
},	{
		cooldown: 3000,
		caseInsensitive: true,
		cooldownMessage: "Slow down buddy! This command has a **3 second cooldown!**",
		requirements: {
			"manageMessages": true
		}
	}
);