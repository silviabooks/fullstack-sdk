module.exports = async (request, reply) => {
  try {
    const data = await request.jwt.verify(request.body.applicationToken);
    reply.send(data);
  } catch (err) {
    console.log(err.message);
    reply.status(500).send(err.message);
  }
};
