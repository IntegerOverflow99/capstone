import Knex from 'knex';
import { Model } from 'objection';
import config from '../objection-utils/knexconfig';

export * from './TableNames';

export * from './AccessLog';
export * from './Audio';
export * from './CustomTag';
export * from './Favorite';
export * from './Media';
export * from './Photo';
export * from './TaggedMedia';
export * from './User';
export * from './Video';

const knex = Knex(config);

Model.knex(knex); //passing knex to objection
