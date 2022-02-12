const forrest = require("@forrestjs/core");
const serviceFastify = require("@forrestjs/service-fastify");
const serviceHealthz = require("@forrestjs/service-fastify-healthz");
const serviceJwt = require("@forrestjs/service-jwt");

forrest.run({
  trace: "compact",
  services: [serviceFastify, serviceHealthz, serviceJwt]
});
