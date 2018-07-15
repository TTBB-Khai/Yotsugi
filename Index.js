//'use strict';

const Eris = require("eris");
const winston = require('winston');
const path = require('path');

require('dotenv-safe').config({
  path: path.join(process.cwd(), '.env'),
  allowEmptyValues: true
})

const logger = new (winston.Logger)({
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'log.log' })
  ]
});

TTBT = new Eris.CommandClient(process.env['CLIENT_TOKEN'], {}, {
	defaultHelpCommand: false,	// KEEP THIS FALSE
	ignoreBots: true,			// KEEP THIS TRUE 
    ignoreSelf: true,			// KEEP THIS TRUE 
    description: process.env['CLIENT_DESCRIPTION'],
    owner: process.env['CLIENT_OWNER'],
    prefix: process.env['CLIENT_PREFIX'],
	game_name: process.env['CLIENT_GAME_NAME']
});

require('./commands/!meta/loader');
require('./commands/general/!meta/loader');
require('./commands/moderator/!meta/loader');
require('./commands/fun/!meta/loader');
require('./commands/utility/!meta/loader');
require('./commands/search/!meta/loader');
require('./commands/gaming/!meta/loader');
require('./commands/image/!meta/loader');
require('./commands/secret/!meta/loader');

TTBT.on("ready", () => { console.log("Ready!") })
TTBT.on('error', logger.info);

TTBT.connect();