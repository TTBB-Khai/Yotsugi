const path = require('path');
const badge = require(path.join(process.cwd(), 'res', 'data', 'badges.json'));
const fs = require('fs');
const { responder: responder } = require(path.join(process.cwd(), 'Utils', 'Responder.js'));

TTBT.registerCommand("avatar", (msg, args) => {
	
	if (typeof(badge.user.filter(user => user.id === msg.author.id)[0]) === 'undefined') {
		badge.user.push({"id": msg.author.id, "badges": [":name_badge:"]});
		fs.writeFile((path.join(process.cwd(), 'res', 'data', 'badges.json')), JSON.stringify(badge), err => {
			if (err) console.log(err);
		});
	}
	
	
	if (!msg.channel.guild)
		return msg.mentions.length > 0 ? msg.mentions[0].avatarURL : msg.author.avatarURL;
	
	let getAvatar = msg.channel.guild.members.filter((mems) => { 
		return (mems.username.toLowerCase() === args.join(" ").toLowerCase()) || (mems.id === args.join(" "));
	});
	
	let avatar = "";
	
	if (args.length > 0) {
		if (msg.mentions.length > 0)
			avatar = msg.mentions[0].avatarURL;
		else if (getAvatar.length > 0)
			avatar = getAvatar[0].avatarURL;
		else
			return "No user found.";
		
		if (!badge.user.filter(user => user.id === msg.author.id)[0].badges.find(badge => badge === ":camera_with_flash:")) {
			TTBT.getDMChannel(msg.author.id).then(channel => {
				TTBT.createMessage(channel.id, responder({badge: ":camera_with_flash:"}, badge.message));
			});
			badge.user.filter(user => user.id === msg.author.id)[0].badges.push(":camera_with_flash:");
			fs.writeFile((path.join(process.cwd(), 'res', 'data', 'badges.json')), JSON.stringify(badge), err => {
				if (err) console.log(err);
			});
		}
	}
	else {
		avatar = msg.author.avatarURL;
		
		if (!badge.user.filter(user => user.id === msg.author.id)[0].badges.find(badge => badge === ":frame_photo:")) {
			TTBT.getDMChannel(msg.author.id).then(channel => {
				TTBT.createMessage(channel.id, responder({badge: ":frame_photo:"}, badge.message));
			});
			badge.user.filter(user => user.id === msg.author.id)[0].badges.push(":frame_photo:");
			fs.writeFile((path.join(process.cwd(), 'res', 'data', 'badges.json')), JSON.stringify(badge), err => {
				if (err) console.log(err);
			});
		}
	}
		
	return avatar;
	
},	{
		caseInsensitive: true,
		cooldown: 3000,
		cooldownMessage: "Slow down! This command has a **3 second cooldown!**",
		requirements: {
			"manageMessages": true
		}
	}
);