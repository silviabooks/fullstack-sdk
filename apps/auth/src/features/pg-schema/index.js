const up = require("./up");
const down = require("./down");
const seed = require("./seed");

module.exports = {
  name: "upsertSchema",
  target: "$PG_READY",
  handler: async (pg) => {
    try {
      // await down(pg);
      console.log("[upsertSchema] Down migration applied.");
    } catch (err) {
      console.warn(
        `[upsertSchema] Could not apply down migration: ${err.message}`
      );
    }

    try {
      await up(pg);
      console.log("[upsertSchema] Up migration applied.");
    } catch (err) {
      console.warn(
        `[upsertSchema] Could not apply up migration: ${err.message}`
      );
    }

    try {
      await seed(pg);
      console.log("[upsertSchema] Seeds applied.");
    } catch (err) {
      console.warn(`[upsertSchema] Could not apply seeds: ${err.message}`);
    }
  }
};
