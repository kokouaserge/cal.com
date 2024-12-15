ARG NODE_VERSION=20.7.0
FROM node:${NODE_VERSION}-slim as build

ARG DATABASE_URL

WORKDIR /calcom


ENV NODE_ENV="production"
ENV NODE_OPTIONS="--max-old-space-size=8192"
ENV DATABASE_DIRECT_URL=${DATABASE_URL}
ENV DATABASE_URL=${DATABASE_URL}


COPY . .

# Install node modules and dependencies, prune unneeded deps, then build
RUN set -eux; \
    apt-get update -qq && \
    apt-get install -y build-essential openssl pkg-config python-is-python3 && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists /var/cache/apt/archives && \
    yarn config set httpTimeout 1200000 && \
    npx turbo prune --scope=@calcom/web --docker && \
    npx turbo prune --scope=@calcom/api-v2 --docker && \
    yarn install && \
    yarn turbo run build --filter=@calcom/api-v2


RUN yarn workspace @calcom/api-v2 run generate-schemas
RUN rm -rf apps/api/v2/node_modules
RUN yarn install

ENV NODE_OPTIONS="--max_old_space_size=8192"

RUN yarn workspace @calcom/api-v2 run build

EXPOSE 3002


CMD [ "yarn", "workspace", "@calcom/api-v2", "start:prod"]

