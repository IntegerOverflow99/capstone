# ATTN

The docker-compose to build the dependencies MUST be run from the ROOT of the project, not from the .devcontainer folder.

eg. from the root of the project, done correctly:

```bash
docker compose -f .devcontainer/docker-compose.yml up -d
```
