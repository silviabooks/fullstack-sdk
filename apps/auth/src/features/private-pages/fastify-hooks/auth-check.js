module.exports = async (request, reply) => {
  try {
    const authToken = request.cookies.auth;
    request.auth = await request.jwt.verify(authToken);
    // console.log("authenticated as", request.auth);
  } catch (err) {
    reply.status(401).send("Access denied");
  }
};
