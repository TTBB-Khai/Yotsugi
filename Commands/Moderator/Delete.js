//'use strict';

var deleteCommand = TTBT.registerCommand("delete", (msg, args) => {
	let linkFilter = /^((https|http|ftp|rtsp|mms)?:\/\/)?(([0-9a-z_!~*'().&=+$%-]+:)?[0-9a-z_!~*'().&=+$%-]+@)?(([0-9]{1,3}\.){3}[0-9]{1,3}|([0-9a-z_!~*'()-]+\.)*([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]\.[a-z]{2,6})(:[0-9]{1,4})?((\/?)|(\/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+\/?)$/im;
	
	if (!msg.channel.guild)
		return "This command only works in a server";
	
	let deletePerms = msg.channel.guild.members.get(TTBT.user.id).permission.has("manageMessages");
	if (!deletePerms) 
		return "I do not have permission to delete messages in this server"
	
	if (args.length === 0)
		return "Incorrect usage. Type **" + process.env['CLIENT_PREFIX'] + "help delete** for more info";
	
	let [limit, filter] = args.join(" ").split(' ');
	
	if (isNaN(limit))
		return "Incorrect usage. Type **" + process.env['CLIENT_PREFIX'] + "help delete** for more info";
	
	if (limit <= 0)
		return "Incorrect usage. Enter a number that is greater than 0."
	
	function filterMessages(filter) {
		switch (true) {
			case (/bots?/.test(filter)): return (msg) => msg.author.bot;
			case (/commands?/.test(filter)): return (msg) => msg.content.startsWith(process.env['CLIENT_PREFIX']);
			case (/files?/.test(filter)): return (msg) => msg.attachments.length
			case (/embeds?/.test(filter)): return (msg) => msg.embeds.length;
			case (/images?/.test(filter)): return (msg) => msg.attachments.length + msg.embeds.length;
			case (/links?/.test(filter)): return (msg) => linkFilter.test(msg.content);
			case (/unpinned/.test(filter)): return (msg) => !msg.pinned;
			case (/^<@!?(\d{17,18})>$/.test(filter)): {
				const isMember = filter.match(/^<@!?(\d{17,18})>$/) || filter.match(/^(\d{17,18})$/);
				if (isMember) 
					return (msg) => msg.author.id === isMember[1];
			}
			default: return (typeof filter !== "undefined") ? (msg) => msg.content.includes(filter) : 0;
		}
	}
	
	function messageNumber(filter) {
		switch (true) {
			case (/bots?/.test(filter)): return 2;
			case (/commands?/.test(filter)): return 1;
			case (/files?/.test(filter)): return 1;
			case (/embeds?/.test(filter)): return 1;
			case (/images?/.test(filter)): return 1;
			case (/links?/.test(filter)): return 1;
			case (/unpinned/.test(filter)): return 1;
			case (/^<@!?(\d{17,18})>$/.test(filter)): return 1;
			default : return (typeof filter !== "undefined") ? 2 : 1;
		}
	}

	if (msg.length > 0) 
		setTimeout(() => msg.delete(), 1000);
	
	async function purgeMessages() {
		return await (typeof filter !== "undefined") 
			? TTBT.purgeChannel(msg.channel.id, 1000, msg => {
				if (msg.content.includes(filterMessages(filter)))
					console.log("test");
			})
			: TTBT.purgeChannel(msg.channel.id, Number(limit) + messageNumber(filter))
	}
	
	Promise.resolve(purgeMessages()).then(data => {
		TTBT.createMessage(msg.channel.id, 'Deleted ' + data + ' messages.').then((message) => {
			setTimeout(() => message.delete(), 3000);
		})
	})
	
},	{
		caseInsensitive: true,
		cooldown: 3000,
		cooldownMessage: "Slow down! This command has a **3 second cooldown!**",
		requirements: {
			permissions: {
				"manageMessages": true
			},
			"manageMessages": true
		}
	}
);