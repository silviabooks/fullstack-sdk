const authCheck = require("./fastify-hooks/auth-check");
const tenantsPage = require("./fastify-handlers/tenants-page");
const catalogPage = require("./fastify-handlers/catalog-page");
const openPage = require("./fastify-handlers/open-page");

const privatePages = async (fastify, opts) => {
  fastify.decorateRequest("auth", null);
  fastify.addHook("preValidation", authCheck);

  fastify.route({
    method: "GET",
    url: "/tenants",
    handler: tenantsPage
  });

  fastify.route({
    method: "GET",
    url: "/tenants/:tenant",
    handler: catalogPage
  });

  fastify.route({
    method: "GET",
    url: "/open/:tenant/:app",
    handler: openPage
  });
};

module.exports = {
  name: "privatePages",
  target: "$FASTIFY_PLUGIN",
  handler: ({ registerPlugin }) => registerPlugin(privatePages)
};
