## BE

Cd to working directory:

```sh
cd ./server
```

Install deps:

```sh
npm i
```

This BE needs a Mongo database and a Redis, to quickly set up, run:

```sh
docker-compose up
```

Then make a copy from `.env.example`

```sh
cp ./.env.example .env
```

And update corresponding values

To run the server:

```sh
npm run server:start
```

You will also need to run a worker to sync Plaid transactions:

```sh
npm run worker:start
```


## FE

Install deps

```sh
npm i
```

Then make a copy from `.env.example`

```sh
cp ./.env.example .env
```

And update corresponding values

To run the webapp:

```sh
npm run dev
```

