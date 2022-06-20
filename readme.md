# Tanuki Price Feeds and Oracle Services

![Node Shield](https://img.shields.io/badge/Node-%5E16.0.0-brightgreen?style=flat-square&logo=JavaScript)
![Typescript Shield](https://img.shields.io/badge/Typescript-%5E4.6.3-blue?style=flat-square&logo=TypeScript)
![Docker Build](https://img.shields.io/badge/Build-Docker-9cf?style=flat-square&logo=Docker)
![Database Mongo](https://img.shields.io/badge/Database-MongoDB-success?style=flat-square&logo=MongoDB)

This repo hosts tokens price feeds and oracle of [Tanukixyz](https://tanukixyz.com) services.

## How it works?

- Clients request token stats from Restful API with a given timestamp
- This service query from database
  - If there is token data at the given timestamp, return to clients
  - If there is no token data, this service query data from coingecko, save it to database, return to clients
