# Lab ITRex
Homework for lessons

*How to run?*

clone project:

    git clone https://github.com/lexfor/Lab.git
    cd Lab
    git checkout Lesson-7_Project

install all dependencies:

    npm install

if you need change storage type - do it in .env file(NODE_ENV - patient and resolution storage type)

    NODE_ENV=dev

if you want to use redis:

    open console and start redis-server

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

**Get project from Docker:**

    cd Docker
    docker-compose up -d

Then open 

    http://localhost:3000/

