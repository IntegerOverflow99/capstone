# Capstone Media Server Monorepo

This a monorepo for the Mohawk College Software Development Capstone project. The monorepo is managed by [NX](https://nx.dev/), which is a tool that allows for the management of multiple projects in a single repository. NX is built on top of [Angular CLI](https://angular.io/cli), and provides a number of useful tools for managing multiple projects, including dependency management, code generation, and testing. It contains the following projects:

### Capstone Media Server - Frontend

- Lives at - `/apps/capstone-frontend`
- Built with - NextJS (Pages Router), React, MUI

### Capstone Media Server - Backend

- Lives at - `/apps/capstone-backend`
- Built with - NextJS, Express, Inversify, ObjectionJS

### Capstone Media Server - Tests

- Lives at - `/apps/capstone-frontend-e2e` and `/apps/capstone-backend-e2e`
- Built with - Cypress
- Currently non-functional

### Capstone Media Server - Utilities

- Lives at - `/utils/src`
- Contains data services, models, general shared utilities, types, database migrations and seeds.

## Tech Stack Explanation

The full stack is written in [Typescript](https://www.typescriptlang.org/). The frontend is built with [React](https://reactjs.org/) and [Next.js](https://nextjs.org/). The backend is built with [Next.js](https://nextjs.org/) and [Express](https://expressjs.com/). The database is [MariaDB](https://mariadb.org/).

The NextJS server handles the routing for the frontend, and acts as a proxy server to the backend API server, and an authentication checkpoint, such that the backend can be isolated from the public internet. The backend API server is a REST API that handles all the logic and data processing, built with Express and InversifyJS (to allow for Dependency Injection and development with a MVC architecture).

The database is a MariaDB instance running in a Docker container (see `.devcontainer/` for the compose files). The database is managed by a [ObjectionJS](https://vincit.github.io/objection.js/) ORM, which is a wrapper around [KnexJS](https://knexjs.org/). The database is seeded with [KnexJS](https://knexjs.org/) migrations and seeds, similar to Entity Framework migrations and seeds.

## Running the app

1. Create a .env file in the `.devcontainer` directory with the following contents:

   ```
   MARIADB_ROOT_PASSWORD=capstone
   ```

   If you are in production, you will want to change this password.

1. Spin up the database from the root of the project with: `docker compose -f .devcontainer/docker-compose.yaml up -d`
1. Install dependencies with: `npm install`
   - Note - Sometimes NX has issues with switching platforms, so you may need to delete `node_modules` and `package-lock.json` and run `npm install` again if you encounter odd issues about platform errors.
1. Migrate and seed the databse with: `npx knex migrate:latest --knexfile utils/src/objection-utils/knexconfig.ts && npx knex seed:run --knexfile utils/src/objection-utils/knexconfig.ts`
1. Open two new terminals that will remain open as long as the app is running.
   - My preferred way to do this is with `tmux` named sessions, but you can open a new terminal window in a GUI based server, or use `screen` or `byobu` if you prefer.
   - One is for the frontend, one for the backend.
1. If you are in dev, skip step 6, and run the alternate commands listed for steps 7 and 8.
1. In the frontend terminal, run: `npx nx run capstone-frontend:build`
   - Here is where you are most likely to notice the platform errors mentioned in step 2.
1. In the backend terminal, run: `NODE_ENV=production npx nx run capstone-backend:serve`
   - Alternate command: `npx nx run capstone-backend:serve`
1. In the frontend terminal, run: `npx nx run capstone-frontend:serve:production`
   - Alternate command: `npx nx run capstone-frontend:serve

This will spin up the frontend and backend servers, and the application can be accessed at localhost:4200.

In a production environment, the presumption is that the hoster will reverse proxy the site with NGINX or Apache, and will run the frontend and backend servers as services. In the case of the demo production environment, the frontend and backend servers are run in background terminals, and the frontend is reverse proxied with NGINX, which also allows for easy configuration of SSL with LetsEncrypt for users who want to use HTTPS. In a V2, this would be significantly streamlined within Docker Compose, and the frontend and backend would be run as services.
