var rpsCommand = TTBT.registerCommand("rps", (msg, args) => {
	let RPS = [{id:0, name:"Paper", code:'p', emote:":hand_splayed:"}, {id:1, name:"Rock", code:'r', emote:":fist:"}, {id:2, name:"Scissors", code:'s', emote:":v:"}];
	let randomRPS = RPS[Math.random() * RPS.length | 0];
	let choice = RPS.filter(function (rps) {
		return (rps.code === args.join(" ").charAt(0).toLowerCase());
	});
	
	function mod(n, m) {
		return ((n % m) + m) % m;
	}

	if (choice.length > 0) {
		let result = mod((choice[0].id - randomRPS.id), 3);
		let output = result == 0 ? 
			choice[0].emote + " **It's a tie!** " + randomRPS.emote 
			: result == 1 ? 
				choice[0].emote + " **" + msg.author.username + " loses!** " + randomRPS.emote 
				: choice[0].emote + " **" + msg.author.username + " wins!** " + randomRPS.emote;
		
		return choice[0].emote + " | **" + msg.author.username + "** chooses **" + choice[0].name + "**\n"
				+ randomRPS.emote + " | **I** choose **" + randomRPS.name + "**\n"
				+ output;
	}
	else {
		return "Incorrect usage. Correct usage: **" + process.env['CLIENT_PREFIX'] + "rps [r/p/s]**";
	}
	
	delete RPS;
	delete randomRPS;
	
},	{
		cooldown: 3000,
		caseInsensitive: true,
		cooldownMessage: "Slow down buddy! This command has a **3 second cooldown!**",
		requirements: {
			"manageMessages": true
		}
	}
);