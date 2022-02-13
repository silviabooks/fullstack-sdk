const authCheck = require("./fastify-hooks/auth-check");
const verifyToken = require("./fastify-handlers/verify-token");
const refreshToken = require("./fastify-handlers/refresh-token");

const privatePages = (fastify, opts, done) => {
  // Apply auth control
  fastify.decorateRequest("auth", {});
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

  done();
};

module.exports = {
  name: "privatePages",
  target: "$FASTIFY_PLUGIN",
  handler: ({ registerPlugin }) => registerPlugin(privatePages)
};
