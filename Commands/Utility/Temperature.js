//'use strict';

TTBT.registerCommand("temperature", (msg, args) => {
	if(args.length === 0)
		return "Incorrect usage. Correct usage: **" + process.env['CLIENT_PREFIX'] + "temperature [NUMBER HERE] [C/F]**";
	
	let [measure, unit] = args.join(" ").split(' ');
	let result = 0.0;
	
	if (isNaN(measure))
		return  "``" + measure + "`` is not a number";
	
	if (typeof(unit) == 'undefined')
		return "``" + unit + "`` is not a unit. Use C or F instead";
	
	if (unit.charAt(0).toLowerCase() === 'c') {
		result = (measure * 1.8) + 32;
		result = Math.round(result * 100) / 100;
		return ":thermometer: | **" + result + "°F**";
	}
	else if (unit.charAt(0).toLowerCase() === 'f') {
		result = (measure - 32) / 1.8;
		result = Math.round(result * 100) / 100;
		return ":thermometer: | **" + result + "°C**";
	}
		
	return "Incorrect usage. Correct usage: **" + process.env['CLIENT_PREFIX'] + "temperature [NUMBER HERE] [C/F]**";
},	{
		cooldown: 3000,
		caseInsensitive: true,
		cooldownMessage: "Slow down buddy! This command has a **3 second cooldown!**",
		requirements: {
			"manageMessages": true
		}
	}
);

TTBT.registerCommandAlias("temp", "temperature");