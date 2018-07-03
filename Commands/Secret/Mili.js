var miliCommand = TTBT.registerCommand("mili", (msg) => {
	let song = ~~(Math.random() * (28 - 1 + 1)) + 1;
	switch(song) {
		case 1:
			return "https://youtu.be/oOlWu15vzyE";	// Past the Stargazing Season
			break;
		case 2:
			return "https://youtu.be/RWX8NRIOf64";	// Opium
			break;
		case 3:
			return "https://youtu.be/-n-iqXTztVQ";	// Bathtub Mermaid
			break;
		case 4:
			return "https://youtu.be/d-nxW9qBtxQ";	// Ga1ahad and Scientific Witchery
			break;
		case 5:
			return "https://youtu.be/S77Dfzzyf-c";	// Unidentified Flavourful Object [UFO]
			break;
		case 6:
			return "https://youtu.be/oHQUUAcB0io";	// Colorful
			break;
		case 7:
			return "https://youtu.be/kpi3tCU2Clc";	// Fable
			break;
		case 8:
			return "https://youtu.be/JnB0BrnZj2w";	// Rosetta
			break;
		case 9:
			return "https://youtu.be/zlKAAAW2NxU";	// Witch's Invitation
			break;
		case 10:
			return "https://youtu.be/7mIUHWR6vIc";	// Chocological
			break;
		case 11:
			return "https://youtu.be/Le5nXTvNYJc";	// Nine Point Eight
			break;
		case 12:
			return "https://youtu.be/ESx_hy1n7HA";	// World.execute(me)
			break;
		case 13:
			return "https://youtu.be/eCm--tb5SKg";	// Utopiosphere
			break;
		case 14:
			return "https://youtu.be/2P8laoe8jbU";	// Friction
			break;
		case 15:
			return "https://youtu.be/6DZjCgxbx5U";	// Rubber Human
			break;
		case 16:
			return "https://youtu.be/IcpzqZrpLVM";	// RTRT
			break;
		case 17:
			return "https://youtu.be/Hy0bdQpEGPI";	// Ikutoshitsuki
			break;
		case 18:
			return "https://youtu.be/OOgKKKbSnAw";	// Space Colony
			break;
		case 19:
			return "https://youtu.be/VkhEnvIy0yU";	// Yubikiri Genman - special edit -
			break;
		case 20:
			return "https://youtu.be/AN72_SVbETA";	// Yubikiri Genman
			break;
		case 21:
			return "https://youtu.be/mkKGMY_zpg4";	// Maroma Samsa
			break;
		case 22:
			return "https://youtu.be/p7sNIyP14X8";	// Vulnerability
			break;
		case 23:
			return "https://youtu.be/xkaF_Ox6FZc";	// Imagined Flight
			break;
		case 24:
			return "https://youtu.be/N5-h77JYOhE";	// Milk
			break;
		case 25:
			return "https://youtu.be/Ly8QIZ0vZYE";	// Mushrooms
			break;
		case 26:
			return "https://youtu.be/VkdrrxR96d8";	// Mirror Mirror
			break;
		case 27:
			return "https://youtu.be/wOcCu31oi7Q";	// Camelia
			break;
		case 28:
			return "https://www.youtu.be/YSXKoq-hPao";	// Chocological - TENORI-ON ONLY ver. -
			break;
		default:
			return "¯\_(ツ)_/¯";
	}
},	{
		cooldown: 3000,
		caseInsensitive: true,
		cooldownMessage: "Slow down buddy! This command has a **3 second cooldown!**",
		requirements: {
			"manageMessages": true
		}
	}
);