const envalid = require("envalid");
const forrest = require("@forrestjs/core");

// Library Services
const serviceFastify = require("@forrestjs/service-fastify");
const serviceHealthz = require("@forrestjs/service-fastify-healthz");
// const serviceFetchq = require("@forrestjs/service-fetchq");

// Validate the environment
const env = envalid.cleanEnv(process.env, {
  // JWT_SECRET: envalid.str(),
  // JWT_DURATION: envalid.str()
});

const helloWorld = require("./features/hello-world");

forrest.run({
  services: [
    serviceFastify,
    serviceHealthz
    // serviceFetchq
  ],
  features: [helloWorld]
});
