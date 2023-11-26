import * as bodyParser from 'body-parser';
import 'reflect-metadata';
import { Container } from 'inversify';
import { InversifyExpressServer } from 'inversify-express-utils';
import './controllers';
import {
  UserService,
  MediaService,
  PhotoService,
  VideoService,
  AudioService,
} from '@capstone/utils/services';
import knex from 'knex';
import { Model } from 'objection';
import config from '@capstone/knexconfig';
import cors from 'cors';

const instance = knex(config);
Model.knex(instance);

const container = new Container();

// set up bindings
// container.bind<FooService>(FooService).to(FooService);
container.bind('UserService').to(UserService);
container.bind('MediaService').to(MediaService);
container.bind('PhotoService').to(PhotoService);
container.bind('VideoService').to(VideoService);
container.bind('AudioService').to(AudioService);

const server = new InversifyExpressServer(container);
server.setConfig((app) => {
  app.use(cors());
  app.options('*', cors());
  app.use(
    bodyParser.urlencoded({
      extended: true,
    })
  );
  app.use(bodyParser.json({ limit: '50mb' }));
  //bodyparser setup for parsing images, videos, audio
  app.use(bodyParser.raw({ type: 'image/*', limit: '50mb' }));
  app.use(bodyParser.raw({ type: 'video/*', limit: '50mb' }));
  app.use(bodyParser.raw({ type: 'audio/*', limit: '50mb' }));
});

const app = server.build();
app.listen(3000);
console.log('app listening on port 3000');
