
exports.up = function(knex, Promise) {
  return knex.schema.createTable('favorites', function(tbl){
    tbl.increments();
    tbl.integer('book_id').notNullable().references('books.id').onDelete('CASCADE').index();
    tbl.integer('user_id').notNullable().references('users.id').onDelete('CASCADE').index();
    tbl.timestamps(true, true);
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('favorites');
};
