const up = require("./up");
const down = require("./down");
const seed = require("./seed");

const safeDown = async (pg) => {
  try {
    await down(pg);
    console.log("[pgSchema] Down migration applied.");
  } catch (err) {
    console.warn(`[pgSchema] Could not apply down migration: ${err.message}`);
  }
};

const safeUp = async (pg) => {
  try {
    await up(pg);
    console.log("[pgSchema] Up migration applied.");
  } catch (err) {
    console.warn(`[pgSchema] Could not apply up migration: ${err.message}`);
  }
};

const safeSeed = async (pg) => {
  try {
    await seed(pg);
    console.log("[pgSchema] Seeds applied.");
  } catch (err) {
    console.warn(`[pgSchema] Could not apply seeds: ${err.message}`);
  }
};

module.exports = () => [
  {
    name: "pgSchema",
    target: "$PG_READY",
    handler: async (pg) => {
      await safeUp(pg);
      await safeSeed(pg);
    }
  },
  {
    name: "pgSchema",
    target: "$FASTIFY_TDD_RESET",
    handler:
      (_, { getContext }) =>
      async () => {
        const pg = getContext("pg");
        await safeDown(pg);
        await safeUp(pg);
        await safeSeed(pg);
      }
  }
];
