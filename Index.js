//'use strict';

const Eris = require("eris");
const winston = require('winston');
const path = require('path');
const pm2 = require('pm2');

require('dotenv-safe').config({
  path: path.join(process.cwd(), '.env'),
  allowEmptyValues: true
})

const logger = new (winston.Logger)({
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'yotsugi.log' })
  ]
});

const processCount = parseInt(process.env['SHARDS_PROCESSES'], 10);
const processID = parseInt(process.env['SHARDS_NODE_INSTANCE'], 10) % processCount;
const processShards = parseInt(process.env['SHARDS_PER_PROCESS'] || 1, 10);
const firstShardID = processID * processShards;
const lastShardID = firstShardID + processShards - 1;
const maxShards = processShards * processCount;

pm2.launchBus((err, bus) => {
  if (err) 
	  console.error(err)

  bus.on('process:msg', packet => {
    const data = packet.raw
    const payload = {
      op: data.op,
      d: data.d,
      origin: packet.process.pm_id % processCount,
      code: data.code
    }
    if (data.dest === -1) {
      for (let i = 0; i < processCount; i++) {
        pm2.sendDataToProcessId(i, {
          type: 'process:msg',
          data: payload,
          topic: 'broadcast'
        }, err => err && console.error(err))
      }
    } else {
      pm2.sendDataToProcessId(data.dest, {
        type: 'process:msg',
        data: payload,
        topic: 'relay'
      }, err => err && console.error(err))
    }
  })
})

TTBT = new Eris.CommandClient(process.env['CLIENT_TOKEN'], 
	{
		autoreconnect: true,
		getAllUsers: true,
		disableEveryone: true,
		disableEvents: true,
		maxShards: maxShards,
		firstShardID: firstShardID,
		lastShardID: lastShardID
	}, 
	{
		defaultHelpCommand: false,	// KEEP THIS FALSE
		ignoreBots: true,			// KEEP THIS TRUE 
		ignoreSelf: true,			// KEEP THIS TRUE,
		disableEveryone: true,
		getAllUsers: true,
		description: process.env['CLIENT_DESCRIPTION'],
		owner: process.env['CLIENT_OWNER'],
		prefix: process.env['CLIENT_PREFIX']
	}
);

require('./Commands/!meta/loader');
require('./Commands/general/!meta/loader');
require('./Commands/moderator/!meta/loader');
require('./Commands/fun/!meta/loader');
require('./Commands/utility/!meta/loader');
require('./Commands/search/!meta/loader');
require('./Commands/gaming/!meta/loader');
require('./Commands/image/!meta/loader');
require('./Commands/secret/!meta/loader');

TTBT.on("ready", () => { console.log("Ready!") })
TTBT.on('error', logger.info);

TTBT.connect();