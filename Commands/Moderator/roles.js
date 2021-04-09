const path = require('path');
const fs = require('fs');
const { responder: responder } = require(path.join(process.cwd(), 'Utils', 'Responder.js'));

TTBT.on("guildMemberAdd", (guild, member) => {
	guild.members.get(member.id).addRole(process.env['WELCOME_ROLE_ID'], "This role was given when they joined the server");
	TTBT.createMessage(process.env['WELCOME_CHANNEL_ID'], `Welcome ${member.mention}, type 'hello' to join.\nWARNING: You can only do this once!`);
});

TTBT.on('messageCreate', msg => {
	if (msg.content === "hello" && msg.channel.id === process.env['WELCOME_CHANNEL_ID'] && msg.author.id !== process.env['CLIENT_ID']) {
		msg.channel.guild.members.get(msg.author.id).addRole(process.env['JOIN_ROLE_ID'], "This role was given when the user successfully gave themselves a role");
		msg.channel.guild.members.get(msg.author.id).removeRole(process.env['WELCOME_ROLE_ID'], "This role was removed when the user successfully gave themselves a role");
	} else if (msg.content !== "hello" && msg.channel.id === process.env['WELCOME_CHANNEL_ID'] && msg.author.id !== process.env['CLIENT_ID']) {
		TTBT.createMessage(msg.channel.id, "...you fucking idiot");
	}
});