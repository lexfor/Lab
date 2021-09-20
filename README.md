# Lab ITRex
Homework for lessons

*How to run?*

clone project:

    git clone https://github.com/lexfor/Lab.git
    cd Lab

install all dependencies:

    npm install

if you need change storage type - do it in .env file(NODE_ENV - patient and resolution storage type)

    NODE_ENV=dev

if you want to use redis - open console and run:
    
    redis-server

if you want to use MYSQL:

Change .env file for you data

    DB_USER=<your user name>
    DB_PASSWORD=<your user password>

run project:

    npm start

Then open:

    http://localhost:3000/

*How to run tests?*

    npm test

**Start project on docker:**

    cd Docker
    docker-compose up -d

Then open 

    http://localhost:3000/

*TTL*

TTL set by default for each resolution, for change TTL default value, change .env file:

    TTL_DELAY=<your delay>
