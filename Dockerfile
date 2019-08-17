FROM node:9.6.1

LABEL version="1.0"
LABEL description="Foro interactivo de EAFIT topicos telematica"
LABEL maintainer="Sergio Andres Rojas - smunozr2@eafit.edu.co"

ARG PORT=3000
ENV PORT $PORT

WORKDIR /nodeapp
COPY . ./

RUN npm install --test

EXPOSE 3000
CMD npm start
