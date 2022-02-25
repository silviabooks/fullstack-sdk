const authCheck = require("./fastify-hooks/auth-check");
const verifyToken = require("./fastify-handlers/verify-token");
const refreshToken = require("./fastify-handlers/refresh-token");
const introspectToken = require("./fastify-handlers/introspect-token");

const publicAPI = async (fastify) => {
  fastify.route({
    method: "POST",
    url: "/v1/token/introspect",
    handler: introspectToken
  });
};

const privateAPI = async (fastify) => {
  // Apply auth control
  fastify.decorateRequest("auth", null);
  fastify.addHook("preValidation", authCheck);

  fastify.route({
    method: "POST",
    url: "/v1/token/verify",
    handler: verifyToken
  });

  fastify.route({
    method: "POST",
    url: "/v1/token/refresh",
    handler: refreshToken
  });
};

module.exports = [
  {
    name: "publicAPI",
    target: "$FASTIFY_PLUGIN",
    handler: ({ registerPlugin }) => registerPlugin(publicAPI)
  },
  {
    name: "privateAPI",
    target: "$FASTIFY_PLUGIN",
    handler: ({ registerPlugin }) => registerPlugin(privateAPI)
  }
];
