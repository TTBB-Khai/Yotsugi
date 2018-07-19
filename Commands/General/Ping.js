//'use strict';

TTBT.registerCommand("ping", (msg) => {
	TTBT.createMessage(msg.channel.id, ":desktop: | **Pong!**").then(function (message) {
		message.channel.editMessage(message.id, ":desktop: | **Pong!** - " + (message.timestamp - msg.timestamp) + "ms")
	});
},	{
		caseInsensitive: true
	}
);