const fetch = require('node-fetch');

var fortuneCommand = TTBT.registerCommand("fortune", (msg) => {
	
	fetch('http://www.yerkee.com/api/fortune')
        .then(function (channel) {
            channel.text().then(fortune => {
                let fortuneData = JSON.parse(fortune);
				let output = '';
				
				output += '```fix\n'
					+ fortuneData.fortune + '\n'
					+ '```';

				TTBT.createMessage(msg.channel.id, output);					
            });
        })
}, 	{
		cooldown: 3000,
		caseInsensitive: true,
		cooldownMessage: "Slow down buddy! This command has a **3 second cooldown!**",
		requirements: {
			"manageMessages": true
		}
	}
);