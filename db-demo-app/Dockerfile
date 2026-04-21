FROM node:latest
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# If your backend is index.js, this is fine
CMD ["npm", "start"]