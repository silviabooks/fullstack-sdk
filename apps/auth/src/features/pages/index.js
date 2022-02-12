const homePage = require("./home-page");
const loginPage = require("./login-page");
const logoutPage = require("./logout-page");
const tenantsPage = require("./tenants-page");

const authenticate = async (request, reply, next) => {
  try {
    const authToken = request.cookies.auth;
    const authData = await request.jwt.verify(authToken);
    console.log("authenticated as", authData);
    request.auth = authData;
    next();
  } catch (err) {
    reply.status(401).send("Access denied");
  }
};

module.exports = {
  name: "pages",
  target: "$FASTIFY_ROUTE",
  handler: [
    {
      method: "GET",
      url: "/",
      handler: homePage
    },
    {
      method: "GET",
      url: "/logout",
      handler: logoutPage
    },
    {
      method: "GET",
      url: "/login/:uname",
      handler: loginPage
    },
    {
      method: "GET",
      url: "/tenants",
      preValidation: authenticate,
      handler: tenantsPage
    }
  ]
};
