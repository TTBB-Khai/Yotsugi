//'use strict';

const gm = require('gm');
const path = require('path');

TTBT.registerCommand("obama", (msg, args) => {
	
	if (args.length === 0)
		return "Incorrect usage. Correct usage: **" + process.env['CLIENT_PREFIX'] + "obama [STRING HERE]**";
	
	let text = ('"' + String(args.join(' ')).trim().replace(/"/g, '\\"').replace(/\s/g,'\n') + '"');
	
	text = text ? text.replace(/<@!*(\d{17,18})>/gi, (matched, id) => {
		let member = msg.channel.guild.members.get(id);
		return member ? member.nick || member.user.username : matched;
	}) : text;
	
	let fontSize = 40;
	
	if ((text.split('\n').length - 1) >= 3)
		return "This command only allows 3 words at a time";
	
	let line = text.split('\n');
	let lineToTest = 0;
	let sortedText = line.length > 0 ? line.sort((a, b) => b.length - a.length) : text;
	
	for (let i = 0; i < sortedText.length; i++) {
		if (sortedText[i].length > 8) {
			lineToTest = sortedText[i];
			break;
		}
	}
	
	let textSize = lineToTest.length - 8;
	
	for (let i = 0; i < textSize; i++)
		fontSize--;

	if (fontSize < 13)
		return "One word is too long to fit (A word can only have 34 characters at most)";

	TTBT.sendChannelTyping(msg.channel.id);
		
	gm(path.join(process.cwd(), 'res', 'images', 'obama.png'))
		.font(path.join(process.cwd(), 'res', 'fonts', 'comicsans.ttf'), fontSize)
		.gravity('Center')
		.draw(["rotate -6 text 20,120  " + text])
		.toBuffer(function (err, buf) {
			if (err) {
				if (msg.author.id === process.env['CLIENT_OWNERID'])
					TTBT.createMessage(msg.channel.id, "You have not set up the use of GraphicsMagick on your system!\n See the README for more info.");
				else
					TTBT.createMessage(msg.channel.id, "The owner of this bot does not have this command enabled yet!");
				return;
			}
			 TTBT.createMessage(msg.channel.id, '', {file: buf, name: 'obama.png'});
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