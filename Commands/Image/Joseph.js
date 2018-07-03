const gm = require('gm');
const path = require('path');

var obamaCommand = TTBT.registerCommand("joseph", (msg, args) => {
	
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
		
	gm(path.join(process.cwd(), 'TTBT', 'res', 'images', 'joseph.jpg'))
		.stroke('#000000')
		.strokeWidth(2)
		.fill('#FFFFFF')
		.font(path.join(process.cwd(), 'TTBT', 'res', 'fonts', 'Avenir-Black.ttf'), fontSize)
		.gravity('Center')
		.drawText(10, 330, text)
		.toBuffer(function (err, buf) {
			if (err) {
				console.log(err);
				return;
			}
			 TTBT.createMessage(msg.channel.id, '', {file: buf, name: 'joseph.jpg'});
		})
		
	delete nextLine;
	delete randomLine;
},	{
		cooldown: 3000,
		caseInsensitive: true,
		cooldownMessage: "Slow down buddy! This command has a **3 second cooldown!**",
		requirements: {
			"manageMessages": true
		}
	}
);