var slotCommand = TTBT.registerCommand("slot", (msg, args) => {
	if (isNaN(args.join(" "))) {
		return  "``" + args.join(" ") + "`` is not a number";
	}
	
	let imageValue = [":cherries:", ":apple:", ":watermelon:", ":eggplant:", ":bell:",
				":chocolate_bar:", ":tangerine:", ":melon:", ":banana:", ":grapes:", ":pear:", ":gem:"];
	const THREE_MATCHES = 10;
	const TWO_MATCHES = 5;
	let selectedImages = [];
	let output = "";
	let output2 = "";
	let bitAmount = args.length === 0 ? 1 : args.join(" ");
	
	if (bitAmount < 0) {
		return "You must bet a number higher than 0";
	}
	
	for (let i = 0; i <= 2; i++) {
		let randomNumber = ~~(Math.random() * (imageValue.length - 1 + 1)) + 0;
		selectedImages[i] = imageValue[randomNumber];
		output += selectedImages[i];
	}
	
	if (selectedImages[0] === selectedImages[1] && selectedImages[0] === selectedImages[2]) {
		payout = bitAmount * THREE_MATCHES;
		output2 = bitAmount == 1 ? 
			msg.author.username + " bet **" + bitAmount + "** bitty and won " + "**" + payout + "**" + " bitties"
			: msg.author.username + " bet **" + bitAmount + "** bitties and won " + "**" + payout + "**" + " bitties";
		}
		
	else if (selectedImages[0] === selectedImages[1] || selectedImages[0] === selectedImages[2] || selectedImages[1] === selectedImages[2]) {
		payout = bitAmount * TWO_MATCHES;
		output2 = bitAmount == 1 ? 
			msg.author.username + " bet **" + bitAmount + "** bitty and won " + "**" + payout + "**" + " bitties"
			: msg.author.username + " bet **" + bitAmount + "** bitties and won " + "**" + payout + "**" + " bitties";
	}
	else {
		output2 = bitAmount == 1 ?
			msg.author.username + ", No slots match. You lose **" + bitAmount + "** bitty"
			: msg.author.username + ", No slots match. You lose **" + bitAmount + "** bitties";
	}
	
	return "**. . . S L O T S . . .** \n"
		+ "**||** " + output + " **||**\n"
		+ output2;
		
	delete imageValue;
	delete selectedImages;
	
}, 	{
		cooldown: 5000,
		caseInsensitive: true,
		cooldownMessage: "Slow down, gambling addict! This command has a **3 second cooldown!**",
		requirements: {
			"manageMessages": true
		}
	}
);

TTBT.registerCommandAlias("slots", "slot");