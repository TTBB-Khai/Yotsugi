const path = require('path');
const fs = require('fs');
const { responder: responder } = require(path.join(process.cwd(), 'Utils', 'Responder.js'));

let regex = /^twitter\.com\/h0nde$/i;

TTBT.on("guildMemberAdd", (guild, member) => {
	if (member.username.match(regex)) {
		TTBT.banMember(member.id, 0, "for being a bot")
		.catch(err)			
	}
});