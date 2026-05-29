FROM node:20-alpine

WORKDIR /app

# Copy workspace manifests first for layer caching
COPY package.json package-lock.json ./
COPY server/package.json ./server/
COPY client/package.json ./client/

RUN npm ci --workspaces

# Copy source
COPY . .

# Build client then server
RUN npm run build

EXPOSE 5001

ENV NODE_ENV=production

CMD ["npm", "start"]
