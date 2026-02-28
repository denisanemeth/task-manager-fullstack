FROM node:24-alpine
WORKDIR /app

# copy only the manifest first to leverage Docker cache for npm install
# context is the repository root (see docker-compose.yml), so the backend
# package.json lives under the "backend" directory.
COPY backend/package.json backend/package-lock.json* ./
RUN npm install

# copy backend source
COPY backend/. .

# copy frontend files so the server can serve them after building with root context
# now place them inside the app directory (backend/frontend) which matches
# the alternative path resolution above
COPY frontend ./frontend

EXPOSE 3000
CMD ["npm","start"]