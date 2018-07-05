// const path = require('path');
// const banNewGuy = require(path.join(process.cwd(), 'res', 'data', 'BanTheNewGuy.json'));
// const session = require(path.join(process.cwd(), 'res', 'data', 'session.json'));
// const moment = require('moment');

// function miliseconds(hrs, min, sec) {
    // return((hrs * 60 * 60 + min * 60 + sec) * 1000);
// }

// TTBT.on('guildMemberAdd', (guild, member) => {
	// if (member.createdAt <= banNewGuy.banNew.guild.filter((server) => {return server.id === guild.id})[0].time)
		// console.log(member.joinedAt);
// });

// var banNewCommand = TTBT.registerCommand("banNew", (msg) => {
	// if (!msg.channel.guild)
		// return "This command only works in a server.";
	
	// if (typeof(session.banNew.user.filter((user) => {return user.id === msg.author.id})[0]) === 'undefined')
		// session.banNew.user.push({"id": msg.author.id, "session": false});
	
	// if (!session.banNew.user.filter((user) => {return user.id === msg.author.id})[0].session) {
		// session.banNew.user.filter((user) => {return user.id === msg.author.id})[0].session = true;
		
		// TTBT.createMessage(msg.channel.id, "```Markdown\n" 
			// + "Hi! What would you like to set up?\n\n"
			// + "[1] Enable/Disable this setting on this server.\n"
			// + "[2] Set the time limit for how long a user needs to have joined Discord before joining this server.\n\n"
			// + "Type the number of your choice into chat OR type 'exit' to exit the menu.```");
		
		// getUserAction(msg);
	// }
	// else
		// return ":x: | You already have a menu open! Type 'exit' to cancel it.";
	
// },	{
		// caseInsensitive: true,
		// cooldown: 3000,
		// cooldownMessage: "Slow down! This command has a **3 second cooldown!**",
		// requirements: {
			// "manageMessages": true
		// }
	// }
// );

// function getUserAction(msg) {
	// function waitForYourMessage (newMsg) {
		// if (newMsg.author.id === msg.author.id && newMsg.channel.id === msg.channel.id) {
			// if (newMsg.content == 1) {
				// TTBT.createMessage(msg.channel.id, "Not avaiable yet.");
				// TTBT.removeListener('messageCreate', waitForYourMessage, true); 		
				// session.banNew.user.filter((user) => {return user.id === msg.author.id})[0].session = false;
			// }
			// else if (newMsg.content == 2) {
				// TTBT.removeListener('messageCreate', waitForYourMessage, true);
				// TTBT.createMessage(msg.channel.id, "```Markdown\n"
					// + "Enter the time needed in hrs:min:sec format. (Eg. 0:30:10 for 0 hours, 30 minutes and 10 seconds)\n"
					// + "OR type 'exit' to exit the menu.```");
				// setTime(msg);
			// }
			// else if (newMsg.content === 'exit') { 
				// TTBT.createMessage(msg.channel.id, 'You have exited the menu.');
				// TTBT.removeListener('messageCreate', waitForYourMessage, true); 
				// session.banNew.user.filter((user) => {return user.id === msg.author.id})[0].session = false;
			// }
		// }
	// }	
	
	// TTBT.on('messageCreate', waitForYourMessage);
	
	// setTimeout(() => {
		// TTBT.removeListener('messageCreate', waitForYourMessage);
		// session.banNew.user.filter((user) => {return user.id === msg.author.id})[0].session = false;
	// }, 30 * 1000)
// }

// function setTime(msg) {
		
	// function waitForYourMessage (newMsg) {
		// if (newMsg.author.id === msg.author.id && newMsg.channel.id === msg.channel.id) {
			// let valid = moment(newMsg.content, "HH:mm:ss", true).isValid();
			// console.log(newMsg.content)
			
			// if (valid) {
				// let [hrs, min, sec] = newMsg.content.split(':');
				// let time = miliseconds(hrs, min, sec);
				// banNewGuy.banNew.guild.push({"id": msg.channel.guild.id, "time": time});
				
				// TTBT.createMessage(msg.channel.id, "Time has been set to " + newMsg.content);
				// TTBT.removeListener('messageCreate', waitForYourMessage);
			// }
			// else if (!valid) {
				// TTBT.createMessage(msg.channel.id, "That is not a valid format! Please try again, or type 'exit' to exit the menu.");
			// }
			// else if (newMsg.content === 'exit') { 
				// TTBT.createMessage(msg.channel.id, 'You have exited the menu.');
				// TTBT.removeListener('messageCreate', waitForYourMessage, true); 
				// session.banNew.user.filter((user) => {return user.id === msg.author.id})[0].session = false;
			// }
		// }
	// }
	
	// setTimeout(() => {
		// TTBT.removeListener('messageCreate', waitForYourMessage);
		// session.banNew.user.filter((user) => {return user.id === msg.author.id})[0].session = false;
	// }, 30 * 1000)
// }