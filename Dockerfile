FROM oven/bun:1.0

WORKDIR /usr/app/server

COPY ./package.json .

RUN bun install

COPY . .

CMD ["bun", "run", "dev"]