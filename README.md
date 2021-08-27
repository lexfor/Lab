# Lab ITRex
Homework for lessons

*How to run?*

clone project:

    git clone https://github.com/lexfor/Lab.git
    cd Lab
    git checkout Lesson-4_Project

install all dependencies:

    npm install

if you need change storage type - do it in .env file(NODE_ENV - patient and resolution storage type)

    NODE_ENV=sql
    QUEUE_STORAGE=redis

if you want to use redis:

    open console and start redis-server

if you want to use MYSQL:

Step 1:

Create your SQL database

    CREATE DATABASE <your database name>

Step 2:

Change .env file for you data

    DB_USER=<your user name>
    DB_PASSWORD=<your user password>
    DB_DATABASE=<your database name>

run project:

    npm start

Then open:

    http://localhost:3000/

*How to run tests?*

    npm test

*How to use?*

add someone in queue:  

    write value in patient cabinet input and click "Add";

get next: 

    click "Next" in doctor cabinet;

set current patient in key-value storage:  

    write resolution in doctor cabinet and click "Add"

find resolution:

*Attention! You can find resolution if doctor write resolution for you and *CLICKED ADD**

    write value in doctor cabinet and click "show resolution"

    select value in patient cabinet

delete resolution:

    find resolution and click delete


**About TTL**

*setting a TTL should be optional to the client when adding the key*

In UI we not have input for time, I decided, that it's not necessary, but add functionality;

    TTL needed to set time, after which get will be not available


**Get project from Docker:**

    cd Docker
    docker-compose up -d

Then open 

    http://localhost:3000/

