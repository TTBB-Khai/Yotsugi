var fishCommand = TTBT.registerCommand("fish", (msg, args) => {
	let fish = ~~(Math.random() * (10000 - 1 + 1)) + 1; // Generates random number from 0-1
	
	function numSuffix(num) {
		let x = num % 10;
		let y = num % 100;
		
		if (x == 1 && y != 11) {
			return num + 'st';
		}
		else if (x == 2 && y != 12) {
			return num + 'nd';
		}
		else if (x == 3 && y != 13) {
			return num + 'rd';
		}
		else {
			return num + 'th';
		}
	}
		
	switch(true) {
		case (fish >= 0 && fish <= 199):
			return ":fishing_pole_and_fish: **| " + msg.author.username + " caught a** :fish:**!**"
			break;
		case (fish == 200):
			return ":fishing_pole_and_fish: ***| " + msg.author.username + " caught an*** :airplane:***!***\n"
				+ "No one's inside. Must've just been a test flight.";
			break;
		case (fish >= 201 && fish <= 300):
			return ":fishing_pole_and_fish: **| " + msg.author.username + " caught a** :tropical_fish:**!**";
			break;
		case (fish >= 301 && fish <= 310):
			return ":fishing_pole_and_fish: **| " + msg.author.username + " caught a** :shrimp:**!**";
			break;
		case (fish >= 311 && fish <= 320):
			return ":fishing_pole_and_fish: **| " + msg.author.username + " caught a** :shark:**!**";
			break;
		case (fish >= 321 && fish <= 330):
			return ":fishing_pole_and_fish: **| " + msg.author.username + " caught a** :squid:**!**";
			break;
		case (fish >= 331 && fish <= 340):
			return ":fishing_pole_and_fish: **| " + msg.author.username + " caught a** :blowfish:**!**";
			break;
		case (fish >= 341 && fish <= 350):
			return ":fishing_pole_and_fish: **| " + msg.author.username + " caught an** :octopus:**!**";
			break;
		case (fish >= 351 && fish <= 360):
			return ":fishing_pole_and_fish: **| " + msg.author.username + " caught a** :dolphin:**!**";
			break;
		case (fish >= 361 && fish <= 370):
			return ":fishing_pole_and_fish: **| " + msg.author.username + " caught a** :whale:**!**";
			break;
		case (fish >= 371 && fish <= 380):
			return ":fishing_pole_and_fish: **| " + msg.author.username + " caught a** :whale2:**!**";
			break;
		case (fish >= 381 && fish <= 385):
			return ":fishing_pole_and_fish: | " + msg.author.username + " caught a :boot:**!**";
			break;
		case (fish >= 386 && fish <= 388):
			return ":fishing_pole_and_fish: | " + msg.author.username + " caught a :bikini:**!**";
			break;
		case (fish >= 389 && fish <= 6000):	
			return ":fishing_pole_and_fish: **| " + msg.author.username + " caught a** :trophy:**!** \n"
				+ "It reads: \"**" + numSuffix(fish) + " Place** in the **Everybody Wins Contest!**\"";
			break;
		case (fish == 9999):
			return ":fishing_pole_and_fish: ***| " + msg.author.username + " caught a*** :statue_of_liberty:**!**\n"
				+ "Now that's one hell of a fishing line you got there!";
			break;
		case (fish == 10000):
			return ":fishing_pole_and_fish: ***| " + msg.author.username + " caught a*** :love_hotel:**!**\n"
				+ "Wait...how did you...? What????";
			break;
		default:
			return ":fishing_pole_and_fish: **| " + msg.author.username + " caught** nothing :crying_cat_face:";
	}
},	{
		cooldown: 3000,
		caseInsensitive: true,
		cooldownMessage: "Relax those muscles for a bit! This command has a **3 second cooldown!**",
		requirements: {
			"manageMessages": true
		}
	}
);