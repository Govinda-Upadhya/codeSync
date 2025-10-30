FROM node:22-alpine
WORKDIR /usr/src/app


COPY ./apps/y-webrtc ./apps/y-webrtc
COPY ./package.json ./package.json
COPY ./turbo.json ./turbo.json

RUN npm install 

EXPOSE 4444

CMD ["npm","run","start:ws"]