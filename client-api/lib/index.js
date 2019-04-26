'use strict';

const Fs = require('fs');
const Path = require('path');
const Resolvers = require('./resolvers');

exports.schema = Fs.readFileSync(Path.join(__dirname, 'schema.graphql')).toString();
exports.resolvers = Resolvers;
