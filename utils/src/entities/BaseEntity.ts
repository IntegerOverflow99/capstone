import dayjs, { Dayjs } from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { Knex } from 'knex';
import { Model, Pojo, snakeCaseMappers } from 'objection';
import path from 'path';
dayjs.extend(utc);

/**
 * The base for all entities. It provides the following:
 * - A static `knex()` method that returns the Knex instance.
 * - A static `rawSQL()` method that executes raw SQL queries.
 * - A `$knex()` method that returns the Knex instance.
 * - A `$formatDatabaseJson()` method that handles converting time types.
 * - A `modelPaths` getter that returns the path to the entities.
 * - A `columnNameMappers` getter that returns the snake case mappers, to map camelcase to snake case.
 */
export default abstract class BaseEntity extends Model {
  static override get modelPaths() {
    return [path.dirname(__dirname)];
  }

  static override get columnNameMappers() {
    return snakeCaseMappers();
  }

  override $knex() {
    return Model.knex() as Knex<this>;
  }

  static override knex() {
    return super.knex() as Knex;
  }

  static async rawSQL<TResult = any>(
    sql: string,
    bindings?: readonly Knex.RawBinding[]
  ) {
    const knex = BaseEntity.knex();
    const res = await knex.raw(sql, bindings as any);
    return res[0] as TResult[];
  }

  override $formatDatabaseJson(json: Pojo): Pojo {
    json = super.$formatDatabaseJson(json);
    Object.entries(json).forEach(([key, value]) => {
      if (value instanceof dayjs) {
        json[key] = (value as Dayjs).utc().format('YYYY-MM-DD HH:mm:ss.SSS');
      }
    });
    return json;
  }
}
