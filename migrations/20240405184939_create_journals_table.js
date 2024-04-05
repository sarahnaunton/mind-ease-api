exports.up = function (knex) {
  return knex.schema.createTable("journals", (table) => {
    table.increments("id").primary();
    table.string("entry", 2000).notNullable();
    table.string("gratitude").notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table
      .timestamp("updated_at")
      .defaultTo(knex.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"));
    table
      .integer("users_id")
      .unsigned()
      .notNullable()
      .references("users.id")
      .onUpdate("CASCADE")
      .onDelete("CASCADE");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("journals");
};
