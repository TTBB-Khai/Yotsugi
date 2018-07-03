const gm = require('gm');
const path = require('path');

var killCommand = TTBT.registerCommand("kill", (msg, args) => {

	let input = args.join(' ') ? args.join(' ').replace(/<@!*(\d{17,18})>/gi, (matched, id) => {
		let member = msg.channel.guild.members.get(id);
		return member ? member.nick || member.user.username : matched;
	}) : msg.author.username;
	
	let fontSize = 20;
		
	if (input.length > 7) {
		fontSize = 17;
		input = (input.charAt(1) === ' ') ? input.substring(0, 1) + '-san' 
		: (input.charAt(2) === ' ') ? input.substring(0, 2) + '-san'
		: (input.charAt(3) === ' ') ? input.substring(0, 3) + '-san'
		: (input.charAt(4) === ' ') ? input.substring(0, 4) + '-san'
		: input.substring(0, 5) + '-san';
	}
	
	let text = [
		{txt: [
			'See you',
			'in hell,',
			input.match(/.{1,10}/g)
		].join('\n')}, 
		{txt: [
			'Hasta',
			'la vista,',
			input.match(/.{1,10}/g)
		].join('\n')}, 
		{txt: [
			'You\'re',
			'fired,',
			input.match(/.{1,10}/g)
		].join('\n')}, 
		{txt: [
			'Dodge',
			'this,',
			input.match(/.{1,10}/g)
		].join('\n')},
		{txt: [
			input.match(/.{1,10}/g),
			'...',
			'Long live',
			'the king'
		].join('\n')},
		{txt: [
			'Ta ta,',
			input.match(/.{1,10}/g)
		].join('\n')},
		{txt: [
			'It\'s high',
			'noon,',
			input.match(/.{1,10}/g)
		].join('\n')},
	];
	let randomText = text[Math.random() * text.length | 0];
	
	TTBT.sendChannelTyping(msg.channel.id);
		
	gm(path.join(process.cwd(), 'TTBT', 'res', 'images', 'kill.png'))
		.font(path.join(process.cwd(), 'TTBT', 'res', 'fonts', 'animeace.ttf'), fontSize)
		.gravity('Center')
		.drawText(156, -90, randomText.txt)
		.toBuffer(function (err, buf) {
			if (err) {
				console.log(err);
				return;
			}
			 TTBT.createMessage(msg.channel.id, '', {file: buf, name: 'kill.png'});
		})
		
	delete randomText;
	delete text;
	
},	{
		cooldown: 3000,
		caseInsensitive: true,
		cooldownMessage: "Slow down buddy! This command has a **3 second cooldown!**",
		requirements: {
			"manageMessages": true
		}
	}
);