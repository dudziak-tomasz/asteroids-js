# ASTEROIDS JS

## DESCRIPTION

ASTEROIDS JS is a game inspired by the arcade game [Asteroids](https://en.wikipedia.org/wiki/Asteroids_(video_game)), relesed in 1979 by Atari Inc.

The project is made in JavaScript, both front-end and back-end.

Current live version: [https://asteroids.doitjs.eu](https://asteroids.doitjs.eu)

---

## AUTHOR

Tomasz Dudziak, contact: dudziak.tomasz@gmail.com

---

## DATES

Project start date: October 25, 2022

Working front-end (playable game): November 18, 2022

REST API server side ready: November 28, 2022

Client side requests for REST API endpoints: December 2, 2022

SSL secured server for REST API running on target domain: December 7, 2022

Real-time communication between online users in game chat: December 29, 2022

Testing of all modules and code refactoring completed: February 15, 2023

---

## REQUIRMENTS

Server side: Node.js v18.13.0, MySQL 8.0

Client side: Web browser

---

## INSTALL

Install the dependencies:

    npm install

Create a configuration directory:

    asteroids-js/config

Copy the asteroids-js/config.json file to the configuration directory and set parameters:

    asteroids-js/config/config.json

More information about the config.json file: [CONFIG.md](CONFIG.md)

Initialize developer database:

    npm run dbinitdev

Initialize production database (optional):

    npm run dbinit
    
---

## RUN

Developer mode:

    npm run dev

Production mode:

    npm start

---

## TEST

Run all tests:

    npm test

Starting the server in test mode for REST API testing:

    npm run devtest
    
---

## DIRECTORY STRUCTURE

Front-end:

    asteroids-js/public

Back-end:

    asteroids-js/src

Tests:

    asteroids-js/test

---

## REST API AUTHENTICATION

When logging in or creating a new user, the server creates a token that is saved in the database and sent to the client. The client saves the token in localStorage. A separate token is created for each session of a user, so a user can have several tokens stored in the database.

During logout, the server removes the session token from the database and client removes from localStorage.

A logged-in user can send a request to log off all sessions. Then the server removes all tokens of a user from the database.

During a request that requires authentication, the server compares the token sent by the client with the token stored in the database. If the tokens match, the request is processed and if not, the server sends an authentication error.

---

## LINKS

Game background music:

[Far Far Space by Audio Tape CINEMATIC NCS (No Copyright Music)](https://www.youtube.com/watch?v=egE7dPevJ_w)

[One Cosmos | Royalty Free Sci-Fi Background Music (No Copyright)](https://www.youtube.com/watch?v=25LEeXuHclc)

[Space Ambient Music Background | Universe Background | No Copyright](https://www.youtube.com/watch?v=2m6m3lTHOe4)
