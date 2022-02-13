const forrest = require("@forrestjs/core");
const serviceFastify = require("@forrestjs/service-fastify");
const serviceHealthz = require("@forrestjs/service-fastify-healthz");
const serviceJwt = require("@forrestjs/service-jwt");
const serviceCookie = require("@forrestjs/service-fastify-cookie");

const servicePg = require("./service-pg");

const upsertSchema = require("./upsert-schema");
const publicPages = require("./features/public-pages");
const privatePages = require("./features/private-pages");
const tokenApi = require("./features/token-api");

forrest.run({
  // trace: "compact",
  services: [
    serviceFastify,
    serviceHealthz,
    serviceJwt,
    servicePg,
    serviceCookie
  ],
  features: [upsertSchema, publicPages, privatePages, tokenApi]
});
