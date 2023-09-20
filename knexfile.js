// Update with your config settings.
const dayjs = require('dayjs');

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
  client: 'mysql2',
  connection: {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'capstone',
    database: 'mediadata',
    // Typecasts all datetime objects to dayjs
    // Adds UTC timezone to all dates, then converts them into local timezone
    // https://github.com/mysqljs/mysql#connection-options
    typeCast: function (field, next) {
      const type = field.type.toLowerCase();
      if (type === 'date') {
        const date = dayjs(field.string());
        if (date.isValid()) return date;
        else return null;
      } else if (type === 'datetime') {
        const date = dayjs(field.string() + 'Z');
        if (date.isValid()) return date;
        else return null;
      } else if (type === 'tiny' && field.length === 1) {
        const value = field.string();
        if (!value || value === 'null') return null;
        return Boolean(parseInt(value));
      } else {
        return next();
      }
    },
  },
};
