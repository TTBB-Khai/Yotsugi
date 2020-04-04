const path = require('path');
const badge = require(path.join(process.cwd(), 'res', 'data', 'badges.json'));
const fs = require('fs');
const { responder: responder } = require(path.join(process.cwd(), 'Utils', 'Responder.js'));
const gm = require('gm');

TTBT.registerCommand("joseph", (msg, args) => {
	
	if (typeof(badge.user.filter(user => user.id === msg.author.id)[0]) === 'undefined') {
		badge.user.push({"id": msg.author.id, "badges": [":name_badge:"]});
		fs.writeFile((path.join(process.cwd(), 'res', 'data', 'badges.json')), JSON.stringify(badge), err => {
			if (err) {
				console.log(err);
			}
		});
	}
	
	if (args.length === 0)
		return "Incorrect usage. Correct usage: **" + process.env['CLIENT_PREFIX'] + "joseph [STRING HERE]**";
	
	let input = args.join(' ') ? args.join(' ').replace(/<@!*(\d{17,18})>/gi, (matched, id) => {
		let member = msg.channel.guild.members.get(id);
		return member ? member.nick || member.user.username : matched;
	}) : msg.author.username;
	
	let nextLine = ["Next you'll say,", "Your next line is,"];
	let randomLine = nextLine[Math.random() * nextLine.length | 0];
	
	if (input.length > 58)
		return "The given string is too long! (MAX: 58 characters)";
	
	let fontSize = 50;
	
	let text = [
		randomLine,
		'"' + input + '"'
	].join('\n');
	
	TTBT.sendChannelTyping(msg.channel.id);
		
	gm(path.join(process.cwd(), 'res', 'images', 'joseph.jpg'))
		.stroke('#000000')
		.strokeWidth(2)
		.fill('#FFFFFF')
		.font(path.join(process.cwd(), 'res', 'fonts', 'Avenir-Black.ttf'), fontSize)
		.gravity('Center')
		.drawText(10, 330, text)
		.toBuffer(function (err, buf) {
			if (err) {
				if (msg.author.id === process.env['CLIENT_OWNERID'])
					TTBT.createMessage(msg.channel.id, "You have not set up the use of GraphicsMagick on your system!\n See the README for more info.");
				else
					TTBT.createMessage(msg.channel.id, "The owner of this bot does not have this command enabled yet!");
				return;
			}
			
			 TTBT.createMessage(msg.channel.id, '', {file: buf, name: 'joseph.jpg'});
			 
			 if (input === "You unlocked the 🧣 badge!"
				&& !badge.user.filter(user => user.id === msg.author.id)[0].badges.find(badge => badge === ":scarf:")) 
			{
				TTBT.getDMChannel(msg.author.id).then(channel => {
					TTBT.createMessage(channel.id, "**You unlocked the 🧣 ba-** ***NANI!!??***\n(Type ?badge to see you badges)");
				});
				badge.user.filter(user => user.id === msg.author.id)[0].badges.push(":scarf:");
				fs.writeFile((path.join(process.cwd(), 'res', 'data', 'badges.json')), JSON.stringify(badge), err => {
					if (err) {
			
			console.log(err);
					}
				});
			}
		})	

},	{
		cooldown: 3000,
		caseInsensitive: true,
		cooldownMessage: "Slow down buddy! This command has a **3 second cooldown!**",
		requirements: {
			"manageMessages": true
		}
	}
);