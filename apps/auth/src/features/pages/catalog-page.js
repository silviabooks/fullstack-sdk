const GET_APPS = `
  SELECT * FROM "public"."catalog" 
  WHERE "user" = $1 AND "tenant" = $2
`;

module.exports = async (request, reply) => {
  const res = await request.pg.query(GET_APPS, [
    request.auth.uname,
    request.params.tenant
  ]);

  if (res.rowCount === 0) {
    reply.status(404).send("Invalid tenant");
    return;
  }

  console.log("****", res.rows);
  reply.send("ok");
};
