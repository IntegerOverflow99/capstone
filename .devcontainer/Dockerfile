ARG VARIANT="18-bullseye"
ARG USERNAME="node"
FROM mcr.microsoft.com/vscode/devcontainers/typescript-node:0-${VARIANT}

RUN mkdir -p /home/node/.vscode-server/extension \
    && chown -R node \
    /home/node/.vscode-server

ENV TZ=America/Toronto

RUN su node -c "npm install -g nx knex"
RUN curl -sSL https://get.docker.com/ | sh
