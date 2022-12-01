# ASTEROIDS JS

## DESCRIPTION

ASTEROIDS JS is a game inspired by the arcade game [Asteroids](https://en.wikipedia.org/wiki/Asteroids_(video_game)), relesed in 1979 by Atari Inc.

The project is made in JavaScript, both front-end and back-end.

Link to currently working version (playable but not finished): [asteroids.doitjs.eu](https://asteroids.doitjs.eu)

---

## AUTHOR

Tomasz Dudziak, contact: dudziak.tomasz@gmail.com

---

## DATES

Project start date: October 25, 2022

Working front-end (playable game): November 18, 2022

REST API server side ready: November 28, 2022

---

## REQUIRMENTS

Server side: Node.js v18.8.0, MySQL 8.0

Client side: Web browser

---

## INSTALL

Install the dependencies:

    npm install

Create a configuration directory:

    asteroids-js/config

Copy the asteroids-js/config.json file to the configuration directory and set the database parameters:

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

## DIRECTORY STRUCTURE

Front-end:

    asteroids-js/public

Back-end:

    asteroids-js/src

---

## REST API AUTHENTICATION

When logging in or creating a new user, the server creates a token that is saved in the database and sent to the client cookies. A separate token is created for each session of a user, so a user can have several tokens stored in the database.

During logout, the server removes the session token from the database and from the client cookies.

A logged-in user can send a request to log off all sessions. Then the server removes all tokens of a user from the database.

During a request that requires authentication, the server compares the token sent by the client from the cookies with the token stored in the database. If the tokens match, the request is processed and if not, the server sends an authentication error.

---

## LINKS

Background music:

[Far Far Space by Audio Tape CINEMATIC NCS (No Copyright Music)](https://www.youtube.com/watch?v=egE7dPevJ_w)

[One Cosmos | Royalty Free Sci-Fi Background Music (No Copyright)](https://www.youtube.com/watch?v=25LEeXuHclc)

[Space Ambient Music Background | Universe Background | No Copyright](https://www.youtube.com/watch?v=2m6m3lTHOe4)

---

## TODOS

- Client side: using REST API endpoints
- Server side / client side: socket.io for in-game chat
- Use UUID in getRandomID()
- Develop separate servers for front-end and back-end
- Improve support for mobile devices
- Some new ideas for the game: more saucers after reaching 100,000 points; the ability to play with two players
