const env = require("./jest.env")();

const fastifyTestUtils = require("@forrestjs/service-fastify/test/globals");
const fetchqTestUtils = require("@forrestjs/service-fetchq/test/globals");

const fastifyGlobals = fastifyTestUtils();
const fetchqGlobals = fetchqTestUtils(fastifyGlobals);

module.exports = () => ({
  ...fastifyGlobals,
  ...fetchqGlobals,
  env
});
