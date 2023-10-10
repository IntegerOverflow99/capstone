import Knex from 'knex';
import { Model } from 'objection';
import config from '../objection-utils/knexconfig';

export * from './TableNames';
export * from './User';

const knex = Knex(config);

Model.knex(knex); //passing knex to objection
