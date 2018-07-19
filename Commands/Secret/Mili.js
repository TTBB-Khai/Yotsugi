//'use strict';

var miliCommand = TTBT.registerCommand("mili", (msg) => {
	let random = ~~(Math.random() * (30 - 1 + 1)) + 1;
	const lookupSong = {
		1: "https://youtu.be/oOlWu15vzyE",	// Past the Stargazing Season
		2: "https://youtu.be/RWX8NRIOf64",	// Opium
		3: "https://youtu.be/-n-iqXTztVQ",	// Bathtub Mermaid
		4: "https://youtu.be/d-nxW9qBtxQ",	// Ga1ahad and Scientific Witchery
		5: "https://youtu.be/S77Dfzzyf-c",	// Unidentified Flavourful Object [UFO]
		6: "https://youtu.be/oHQUUAcB0io",	// Colorful
		7: "https://youtu.be/kpi3tCU2Clc",	// Fable
		8: "https://youtu.be/JnB0BrnZj2w",	// Rosetta
		9: "https://youtu.be/zlKAAAW2NxU",	// Witch's Invitation
		10: "https://youtu.be/7mIUHWR6vIc",	// Chocological
		11: "https://youtu.be/Le5nXTvNYJc",	// Nine Point Eight
		12: "https://youtu.be/ESx_hy1n7HA",	// World.execute(me)
		13: "https://youtu.be/eCm--tb5SKg",	// Utopiosphere
		14: "https://youtu.be/2P8laoe8jbU",	// Friction
		15: "https://youtu.be/6DZjCgxbx5U",	// Rubber Human
		16: "https://youtu.be/IcpzqZrpLVM",	// RTRT
		17: "https://youtu.be/Hy0bdQpEGPI",	// Ikutoshitsuki
		18: "https://youtu.be/OOgKKKbSnAw",	// Space Colony
		19: "https://youtu.be/VkhEnvIy0yU",	// Yubikiri Genman - special edit -
		20: "https://youtu.be/AN72_SVbETA",	// Yubikiri Genman
		21: "https://youtu.be/mkKGMY_zpg4",	// Maroma Samsa
		22: "https://youtu.be/p7sNIyP14X8",	// Vulnerability
		23: "https://youtu.be/xkaF_Ox6FZc",	// Imagined Flight
		24: "https://youtu.be/N5-h77JYOhE",	// Milk
		25: "https://youtu.be/Ly8QIZ0vZYE",	// Mushrooms
		26: "https://youtu.be/VkdrrxR96d8",	// Mirror Mirror
		27: "https://youtu.be/wOcCu31oi7Q",	// Camelia
		28: "https://www.youtu.be/YSXKoq-hPao",	// Chocological - TENORI-ON ONLY ver. -
		29: "https://www.youtu.be/-9YVWH6YZI", 	// Lemonade
		30: "https://www.youtu.be/x6q41EnhPnU" // Summoning 101
	}
	
	return lookupSong[random];
},	{
		cooldown: 3000,
		caseInsensitive: true,
		cooldownMessage: "Slow down buddy! This command has a **3 second cooldown!**",
		requirements: {
			"manageMessages": true
		}
	}
);