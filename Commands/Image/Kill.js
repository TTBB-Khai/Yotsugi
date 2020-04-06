const gm = require('gm');
const path = require('path');
const badge = require(path.join(process.cwd(), 'res', 'data', 'badges.json'));
const output = require(path.join(process.cwd(), 'res', 'messages', 'output.json'));
const fs = require('fs');
const { responder: responder } = require(path.join(process.cwd(), 'Utils', 'Responder.js'));

TTBT.registerCommand("kill", (msg, args) => {
	
	if (typeof(badge.user.filter(user => user.id === msg.author.id)[0]) === 'undefined') {
		badge.user.push({"id": msg.author.id, "badges": [":name_badge:"]});
		fs.writeFile((path.join(process.cwd(), 'res', 'data', 'badges.json')), JSON.stringify(badge), err => {
			if (err) console.log(err);
		});
	}

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
		].join('\n'),
		id: 0}, 
		{txt: [
			'Hasta',
			'la vista,',
			input.match(/.{1,10}/g)
		].join('\n')}, 
		{txt: [
			'You\'re',
			'fired,',
			input.match(/.{1,10}/g)
		].join('\n'),
		id: 1}, 
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
		].join('\n'),
		id: 2},
		{txt: [
			'Ta ta,',
			input.match(/.{1,10}/g)
		].join('\n'),
		id: 3},
		{txt: [
			'It\'s high',
			'noon,',
			input.match(/.{1,10}/g)
		].join('\n'),
		id: 4},
	];
	let randomText = text[Math.random() * text.length | 0];
	
	if (randomText.id === 4 && !badge.user.filter(user => user.id === msg.author.id)[0].badges.find(badge => badge === ":cowboy:")) {
		TTBT.getDMChannel(msg.author.id).then(channel => {
			TTBT.createMessage(channel.id, responder({user: "You", badge: ":cowboy:"}, output.badge.message));
		});
		badge.user.filter(user => user.id === msg.author.id)[0].badges.push(":cowboy:");
		fs.writeFile((path.join(process.cwd(), 'res', 'data', 'badges.json')), JSON.stringify(badge), err => {
			if (err) console.log(err);
		});
	}
	
	TTBT.sendChannelTyping(msg.channel.id);
		
	gm(path.join(process.cwd(), 'res', 'images', 'kill.png'))
		.font(path.join(process.cwd(), 'res', 'fonts', 'animeace.ttf'), fontSize)
		.gravity('Center')
		.drawText(156, -90, randomText.txt)
		.toBuffer(function (err, buf) {
			if (err) {
				if (msg.author.id === process.env['CLIENT_OWNERID'])
					TTBT.createMessage(msg.channel.id, "You have not set up the use of GraphicsMagick on your system!\n See the README for more info.");
				else
					TTBT.createMessage(msg.channel.id, "The owner of this bot does not have this command enabled yet!");
				return;
			}
			 TTBT.createMessage(msg.channel.id, '', {file: buf, name: 'kill.png'});
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