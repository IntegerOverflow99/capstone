import * as bodyParser from 'body-parser';
import 'reflect-metadata';
import { Container } from 'inversify';
import { InversifyExpressServer } from 'inversify-express-utils';
import './controllers';
import { UserService } from '@capstone/utils';

const container = new Container();

// set up bindings
// container.bind<FooService>(FooService).to(FooService);
container.bind('UserService').to(UserService);

const server = new InversifyExpressServer(container);
server.setConfig((app) => {
  app.use(
    bodyParser.urlencoded({
      extended: true,
    })
  );
  app.use(bodyParser.json());
});

const app = server.build();
app.listen(3000);
