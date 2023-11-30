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

// set up the knex instance to connect to the db, then bind it to the Objection Model.
const instance = knex(config);
Model.knex(instance);

// create the IoC container
const container = new Container();

// set up bindings for the data services to be injected into the controllers
container.bind('UserService').to(UserService);
container.bind('MediaService').to(MediaService);
container.bind('PhotoService').to(PhotoService);
container.bind('VideoService').to(VideoService);
container.bind('AudioService').to(AudioService);

// create the server and set up the config
const server = new InversifyExpressServer(container);
server.setConfig((app) => {
  app.use(cors());
  app.options('*', cors());
  app.use(
    bodyParser.urlencoded({
      extended: true,
    })
  );
  // bodyparser limits set to 50mb for the public hosting capstone, would/must be higher for v2
  app.use(bodyParser.json({ limit: '50mb' }));
  //bodyparser setup for parsing images, videos, audio
  app.use(bodyParser.raw({ type: 'image/*', limit: '50mb' }));
  app.use(bodyParser.raw({ type: 'video/*', limit: '50mb' }));
  app.use(bodyParser.raw({ type: 'audio/*', limit: '50mb' }));
  // app.use((req, res, next) => { // debug middleware
  //   console.log({ method: req.method, params: req.params, body: req.body });
  //   next();
  // });
});

//build and start the server on port 3000
const app = server.build();
app.listen(3000);
console.log('app listening on port 3000');
