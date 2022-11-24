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

Start of work on REST API: November 22, 2022

---

## REQUIRMENTS

Server side: Node.js v18.8.0, MySQL 8.0

Client side: Web browser

---

## INSTALL

Install packages:

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

    npm run start
    
---

## DIRECTORY STRUCTURE

Front-end:

    asteroids-js/public

Back-end:

    asteroids-js/src

---

## LINKS

Background music:

[Far Far Space by Audio Tape CINEMATIC NCS (No Copyright Music)](https://www.youtube.com/watch?v=egE7dPevJ_w)

[One Cosmos | Royalty Free Sci-Fi Background Music (No Copyright)](https://www.youtube.com/watch?v=25LEeXuHclc)

[Space Ambient Music Background | Universe Background | No Copyright](https://www.youtube.com/watch?v=2m6m3lTHOe4)

---

## TODOS

- Server side: REST API for users and highscores endpoints
- Server side / client side: socket.io for in-game chat
- Improve support for mobile devices
