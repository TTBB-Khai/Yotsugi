//'use strict';

const path = require('path');
const { delay: wait } = require(path.join(process.cwd(), 'Utils', 'Delay.js'));

TTBT.registerCommand("banRoulette", (msg, args) => {
	
	if (!msg.channel.guild)
		return "This command only works in a server";
	
	let getUser = msg.channel.guild.members.filter((mems) => { 
		return (mems.username.toLowerCase() === args.join(" ").toLowerCase()) || (mems.id === args.join(" "));
	});
	let user = "No user found";
		
	if (args.length > 0)
		user = msg.mentions.length > 0 ? msg.mentions[0] : getUser.length > 0 ? getUser[0].user : "No user found";
	else 
		user = msg.author;

	if (user === "No user found.")
		return user;
	
	let randomBan = ~~(Math.random() * (100 - 1 + 1)) + 0;
	let randomDelay = ~~(Math.random() * (6000 - 1 + 1)) + 5000;
		
	TTBT.sendChannelTyping(msg.channel.id);
		
	TTBT.createMessage(msg.channel.id, ":gun: | " + msg.author.username + " readies the gun...")
	.then(message => wait(4000)
	.then(() => message.channel.editMessage(message.id, ":gun: | **" + msg.author.username + " pulls the trigger!**")
	.then(() => TTBT.sendChannelTyping(msg.channel.id))))
		
	if (randomBan === 1) {
		TTBT.sendChannelTyping(msg.channel.id)
		.then(() => wait(randomDelay).then(() => TTBT.banGuildMember(msg.channel.guild.id, user.id, 0, "suicide")
		.then(() => TTBT.createMessage(msg.channel.id, user.mention + " has been banned!")))
		.catch(err => TTBT.createMessage(msg.channel.id, "This user could not be banned.")))
	}
	else
		TTBT.sendChannelTyping(msg.channel.id).then(() => wait(randomDelay).then(() => TTBT.createMessage(msg.channel.id, "...but nothing happens.")))
	
},	{
		caseInsensitive: true,
		cooldown: 3000,
		cooldownMessage: "Slow down! This command has a **3 second cooldown!**",
		requirements: {
			permissions: {
				"banMembers": true
			},
			"manageMessages": true
		}
	}
);