const fixUsersFullNameHander = async (request, reply) => {
  // Validate we hande the SLQ EVENT type:
  const { op: eventName } = request.body.event;
  if (eventName !== "UPDATE" && eventName !== "INSERT") {
    reply.status(400).send("Do not handle this");
    return;
  }

  const { full_name: fullName, name, id } = request.body.event.data.new;
  if (fullName) {
    reply.send("nothing to do");
    return;
  }

  const newFullName = name;

  const query = `
    mutation updateFullName {
      update_users_by_pk(
        pk_columns: {id: "${id}"}, 
        _set: {full_name: "${newFullName}"}
      ) {
        id
      }
    }  
  `;

  console.log(query);
  console.log();

  // update on hasura
  const res = await request.axios.post(`http://hasura-engine:8080/v1/graphql`, {
    query
  });

  console.log(res.data);

  reply.send("ok");
};

module.exports = {
  name: "Hello World",
  target: "$FASTIFY_POST",
  handler: {
    url: "/fix-users-full-name",
    handler: fixUsersFullNameHander
  }
};
