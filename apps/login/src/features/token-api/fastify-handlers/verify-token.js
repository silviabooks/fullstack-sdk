module.exports = (request, reply) => {
  reply.send({ expires: request.auth.expiresAt });
};
