const env = require("./jest.env")();

const fastifyTestUtils = require("@forrestjs/service-fastify/test/globals");
const jwtTestUtils = require("@forrestjs/service-jwt/test/globals");

const fastifyGlobals = fastifyTestUtils();
const jwtGlobals = jwtTestUtils(fastifyGlobals);

module.exports = () => ({
  ...fastifyGlobals,
  ...jwtGlobals,
  env
});
