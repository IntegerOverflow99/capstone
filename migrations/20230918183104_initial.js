/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .createTable('users', (table) => {
      table.increments('id').primary();
      table.string('username').notNullable();
      table.string('password_hash').notNullable();
      table
        .enu('allowed_video_content_rating', ['G', 'PG', 'PG-13', 'R', 'NC-17'])
        .notNullable();
      table.boolean('admin').notNullable().defaultTo(false);
    })
    .createTable('media', (table) => {
      table.increments('id').primary();
      table.string('fileLocation').notNullable();
    })
    .createTable('photos', (table) => {
      table.increments('id').primary();
      table.string('description').nullable();
      table.datetime('uploaded').defaultTo(knex.fn.now());
      table.datetime('taken').nullable();
      table.integer('height').notNullable();
      table.integer('width').notNullable();
      table.string('global_tags').nullable();
      table
        .integer('media_id', 10)
        .unsigned()
        .notNullable()
        .references('media.id');
    })
    .createTable('audio', (table) => {
      table.increments('id').primary();
      table.string('title').notNullable();
      table.string('artist').nullable();
      table.string('album').nullable();
      table.float('length').notNullable();
      table.integer('release_year').nullable();
      table.string('genres').nullable();
      table
        .integer('media_id', 10)
        .unsigned()
        .notNullable()
        .references('media.id');
      table.datetime('uploaded').defaultTo(knex.fn.now());
    })
    .createTable('videos', (table) => {
      table.increments('id').primary();
      table.string('title').notNullable();
      table.string('description').nullable();
      table.integer('release_year').nullable();
      table.integer('length').notNullable();
      table.integer('width').notNullable();
      table.integer('height').notNullable();
      table.string('genres').nullable();
      table
        .integer('media_id', 10)
        .unsigned()
        .notNullable()
        .references('media.id');
    })
    .createTable('access_logs', (table) => {
      table.increments('id').primary();
      table.string('event').notNullable();
      table.datetime('timestamp').defaultTo(knex.fn.now());
      table
        .integer('user_id', 10)
        .unsigned()
        .notNullable()
        .references('users.id');
    })
    .createTable('favorites', (table) => {
      table.increments('id').primary();
      table
        .integer('user_id', 10)
        .unsigned()
        .notNullable()
        .references('users.id');
      table
        .integer('media_id', 10)
        .unsigned()
        .notNullable()
        .references('media.id');
    })
    .createTable('custom_tags', (table) => {
      table.increments('id').primary();
      table.string('tag').notNullable();
      table.integer('media_id', 10).unsigned().references('media.id');
    })
    .createTable('tagged_media', (table) => {
      table.increments('id').primary();
      table.integer('media_id', 10).unsigned().references('media.id');
      table
        .integer('custom_tag_id', 10)
        .unsigned()
        .references('custom_tags.id');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex
    .raw('SET FOREIGN_KEY_CHECKS = 0;')
    .then(() => {
      knex.schema
        .dropTableIfExists('users')
        .dropTableIfExists('photos')
        .dropTableIfExists('audio')
        .dropTableIfExists('videos')
        .dropTableIfExists('access_logs')
        .dropTableIfExists('favorites')
        .dropTableIfExists('custom_tags')
        .dropTableIfExists('tagged_media')
        .dropTableIfExists('media');
    })
    .finally(() => {
      return knex.raw('SET FOREIGN_KEY_CHECKS = 1;');
    });
};
