exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('houses', function(table) {
      table.increments('id').primary();
      table.string('address');
      table.integer('built');

      table.timestamps(true, true);
    }),

    knex.schema.createTable('ghosts', function(table) {
      table.increments('id').primary();
      table.string('name');
      table.string('type');
      table.integer('house_id').unsigned()
      table.foreign('house_id')
        .references('houses.id');

      table.timestamps(true, true);
    })
  ])
};


exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('ghosts'),
    knex.schema.dropTable('houses')
  ]);
};
