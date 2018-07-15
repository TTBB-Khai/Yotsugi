//'use strict';

var distanceCommand = TTBT.registerCommand("distance", (msg, args) => {
	if (args.length === 0) 
		return "Incorrect usage. Correct usage: **" + process.env['CLIENT_PREFIX'] + "distance [NUMBER HERE] [K/M]**";
	
	let [measure, unit] = args.join(" ").split(' ');
	let result = 0.0;
	
	if (isNaN(measure)) 
		return "``" + measure + "`` is not a number";
	
	if (typeof(unit) == 'undefined') 
		return "``" + unit + "`` is not a unit. Use K or M instead";
	
	if (unit.charAt(0).toLowerCase() === 'k') {
		result = (measure / 2) + ((measure / 2) / 4);
		result = Math.round(result * 100) / 100;
		return ":rocket: | **" + result + " MI**";
	}
	else if (unit.charAt(0).toLowerCase() === 'm') {
		result = (measure / 5) * 8
		result = Math.round(result * 100) / 100;
		return ":rocket: | **" + result + " KM**";
	}
	
	return "Incorrect usage. Correct usage: **" + process.env['CLIENT_PREFIX'] + "distance [NUMBER HERE] [K/M]**";
},	{
		cooldown: 3000,
		caseInsensitive: true,
		cooldownMessage: "Slow down buddy! This command has a **3 second cooldown!**",
		requirements: {
			"manageMessages": true
		}
	}
);

TTBT.registerCommandAlias("dist", "distance");