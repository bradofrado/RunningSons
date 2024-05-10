# syntax = docker/dockerfile:1

# Adjust NODE_VERSION as desired
ARG NODE_VERSION=21.6.1
FROM node:${NODE_VERSION}-slim as base

LABEL fly_launch_runtime="Node.js"

# Node.js app lives here
WORKDIR /app

# Set production environment
ENV NODE_ENV="production"

FROM base as global-install

# Install packages needed to build node modules
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y build-essential node-gyp pkg-config python-is-python3

COPY --link ./global/package-lock.json ./global/package.json ./

RUN npm ci --include=dev

COPY --link ./global .

# Throw-away build stage to reduce size of final image
FROM base as vue-build

# Install packages needed to build node modules
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y build-essential node-gyp pkg-config python-is-python3

# Install node modules
COPY --link ./front-end/package-lock.json ./front-end/package.json ./front-end/

WORKDIR /app/front-end
RUN npm ci --include=dev

COPY --from=global-install /app /app/global

# Copy application code
COPY --link ./front-end /app/front-end

WORKDIR /app/front-end

ENV VUE_APP_STRIPE_KEY="pk_live_51LKwWoBXqDku0t2I2Ttw53RgornnN9sRZKrdUJ9aiai2QuOc4Se6MuXogE1C6OjN1UOQZJFGDdFypb5n2eWweVJV00GOMYXBC9"
ENV VUE_APP_VENMO_URL="https://venmo.com/runningsons?txn=pay"
ENV VUE_APP_VENMO_URL_IOS="venmo://paycharge?txn=pay&recipients=runningsons"
ENV VUE_APP_VENMO_URL_ANDROID="intent://paycharge?txn=pay&recipients=runningsons#Intent;package=com.venmo;scheme=venmo;end"

# Build application
RUN npm run build

# Remove development dependencies
RUN npm prune --omit=dev

FROM base as express-build

# Install packages needed to build node modules
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y build-essential node-gyp pkg-config python-is-python3

# Install node modules
COPY --link ./back-end/package-lock.json ./back-end/package.json ./
RUN npm ci --include=dev

# Copy application code
COPY ./back-end .

# Remove development dependencies
RUN npm prune --omit=dev


# Final stage for app image
FROM base

# Copy built application
COPY --from=express-build /app /app
COPY --from=vue-build /app/front-end/dist /app/dist

ENV MONGO_KEY="mongodb+srv://bradofrado:%23Kylie5789@mycluster.yq8un.mongodb.net/runningsons"
ENV ROOT="/app/dist"
ENV SERVER_PORT=3000

# Start the server by default, this can be overwritten at runtime
EXPOSE 3000
CMD [ "node", "server.js" ]
