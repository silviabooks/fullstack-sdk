const envalid = require("envalid");
const forrest = require("@forrestjs/core");

// Library Services
const serviceFastify = require("@forrestjs/service-fastify");
const serviceHealthz = require("@forrestjs/service-fastify-healthz");
const serviceJwt = require("@forrestjs/service-jwt");
const serviceCookie = require("@forrestjs/service-fastify-cookie");
const serviceCors = require("@forrestjs/service-fastify-cors");

// Local Services
const servicePg = require("./service-pg");

// Local Features
const pgSchema = require("./features/pg-schema");
const publicPages = require("./features/public-pages");
const privatePages = require("./features/private-pages");
const tokenApi = require("./features/token-api");

// Validate the environment
const env = envalid.cleanEnv(process.env, {
  JWT_SECRET: envalid.str(),
  JWT_DURATION: envalid.str()
});

forrest.run({
  // trace: "compact",
  settings: {
    jwt: {
      secret: env.JWT_SECRET,
      duration: env.JWT_DURATION
    }
  },
  services: [
    serviceFastify,
    serviceHealthz,
    serviceJwt,
    servicePg,
    serviceCookie,
    serviceCors
  ],
  features: [pgSchema, publicPages, privatePages, tokenApi]
});
