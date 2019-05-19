Prototype Of Gamkedo Club Multiplayer Game Using NodeJS
#######################################################

Organization
------------

`index.html` is the main client interface. It can be used directly if you clone the code locally and run it.
It's also the same file that the remote server will send to clients who connects to the server using HTTP.

`./server/admin.html` is the page (linked from `index.html`) exposing tools to handle the server.

Directory `./core/` contains the code describing the game internal representation and rules.
It's where the game rules and effects and principles should be coded.

Directory `./client/` contains the code that should only be visible from the client side.
All interractive (input/output) code-- input, graphics and audio-- should go there.
It relies only on `./core/` code and data to know what to display when, plus canvas graphics code.

Directory `./server/` contains the code that runs the game as a server.
This code should be used only with online servers.
No graphic, audio or game-specific code should end there (it should end in `./client/` or `./core/`).
It relies on NodeJS as server implementation and uses `./core/` to launch and update the game.
It also exposes `index.html` by default, which uses `./client`.

Server setup
------------

1. Install `NodeJs` **v12.1** or compatible (this will also install `npm`).
    On Ubuntu LTS, because the NodeJS package version might be older, you might need to use NodeJS's PPA as explained there: https://tecadmin.net/install-latest-nodejs-npm-on-ubuntu/
2. Clone this repository (say in directory `~/prototype`).
3. Go in the cloned directory (say `cd prototype`).
4. Let `npm` install the project's dependencies: 
   - If you intend to develop: run `npm install`
   - If you just want to run the server (for live production or CI): run `npm ci`
5. To run the game server using NodeJS server:
   1.a. Run: `node ./server/mainserv.js 3000` (no debugging). `3000` is the port to expose to, it can be some other valid and available port.
   2.b. TODO: NEVER TRIED YET: To enable debugging, run: `node ./server/mainserv.js --inspect=127.0.0.1:3030` (replace the port by something useful for you). 

At this point, the server should be accessible via the port `3000` of the host machine (or another port if you specified another one).
To make it visible from outside, you'll have to setup your web server (NGineX or Apache or other) to forward request from the address/port you want to this port in this machine.





