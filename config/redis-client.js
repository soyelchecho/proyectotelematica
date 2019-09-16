const redis = require('redis');
const {promisify} = require('util');
const client = redis.createClient();

module.exports = {cliente : client};
