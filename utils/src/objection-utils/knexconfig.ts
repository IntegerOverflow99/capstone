import knex, { Knex } from 'knex';
import { Model } from 'objection';
import { Field } from 'mysql2';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

const knexConfig: Knex.Config = {
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
    typeCast: function (field: Field, next: any) {
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
  migrations: {
    directory: './migrations',
    tableName: 'knex_migrations',
    extension: 'ts',
  },
  pool: {
    min: 0,
    max: 10,
  },
  seeds: {
    directory: './seeds',
  },
};

export default knexConfig;
