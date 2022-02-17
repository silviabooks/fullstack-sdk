const helloWorldHander = (request, reply) => {
  const { name } = request.body.input;
  reply.send({ message: `hello ${name}` });
};

module.exports = {
  name: "Hello World",
  target: "$FASTIFY_POST",
  handler: {
    url: "/hello-world",
    handler: helloWorldHander
  }
};
