const redis = require('redis');
const {promisify} = require('util');
const client = redis.createClient(  {  host: 'redis-server',
    port: 6379});

module.exports = {cliente : client};
