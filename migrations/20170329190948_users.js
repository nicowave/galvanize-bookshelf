
exports.up = function(knex) {
  return knex.schema.createTable('users', (table) => {
    table.increments();
    table.string('first_name').notNullable().defaultTo('');
    table.string('last_name').notNullable().defaultTo('');
    table.string('email').notNullable();
    table.specificType('hashed_password', 'character(60)').notNullable();
    table.timestamps(true, true);
  })
};

exports.down = function(knex) {
    return knex.schema.dropTable('users');
};
