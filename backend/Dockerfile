FROM node as dev

WORKDIR /usr/src/app

COPY package*.json ./

RUN ls

ADD . ./

RUN npm i

RUN chmod +x devstart.sh

CMD ["./devstart.sh"]

FROM dev as prod

RUN chmod +x start.sh

CMD ["./start.sh"]
