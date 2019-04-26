'use strict';

const Graphi = require('graphi');
const Hapi = require('hapi');
const HapiPino = require('hapi-pino');
const Keycloak = require('keycloak-hapi');
const Wreck = require('wreck');
const Book = require('./lib');

const baseUrl = 'http://localhost:3010/';

const server = Hapi.server({
  port: 3001,
  routes: {
    cors: {
      origin: ['http://localhost:3000'],
      credentials: true,
      additionalHeaders: ['Cookie', 'X-CSRF-Token']
    },
    security: {
      hsts: true,
      xframe: 'deny',
      xss: true,
      noOpen: true,
      noSniff: false
    }
  }
});

async function main () {
  // Setup wreck with the baseUrl and authorization header on each request after auth is performed
  server.ext('onPreHandler', (request, h) => {
    request.wreck = Wreck.defaults({
      headers: {
        Authorization: request.headers.authorization
      },
      baseUrl,
      json: 'force'
    });

    return h.continue;
  });

  await server.register([
    HapiPino,
    {
      plugin: Keycloak,
      options: {
        serverUrl: 'http://localhost:8080/auth',
        realm: 'hello-nuxt',
        'public-client': true,
        bearerOnly: true
      }
    }
  ]);

  server.auth.strategy('keycloak', 'keycloak');
  server.auth.default('keycloak');

  await server.register({
    plugin: Graphi,
    options: {
      authStrategy: 'keycloak',
      schema: Book.schema,
      resolvers: Book.resolvers
    }
  });

  await server.start();
}

main();
