FROM node:20-alpine AS build
WORKDIR "/app"
COPY . .
RUN npm install && npm install @react-three/fiber && npm install styled-components
EXPOSE 3000
CMD ["npm","run","dev"]
# RUN npm run dev


# FROM nginx as prod
# RUN mkdir /app
# COPY --from=build /app /app
# COPY nginx.conf /etc/nginx/nginx.conf