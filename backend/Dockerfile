FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install && npm install bcrypt
COPY . .
EXPOSE 3001
CMD ["npm", "start"]
# RUN npm start

# FROM nginx:20-alpine AS prod
# RUN mkdir /app
# COPY --from=build /app