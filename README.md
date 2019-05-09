Prototype Of Gamkedo Club Multiplayer Game Using NodeJS
#######################################################

Organization
------------

Directory `./core/` contains the code describing the game internal representation and rules.
It's where the game rules and effects and principles should be coded.

Directory `./client/` contains the code that should only be visible from the client side.
All interractive (input/output) code-- input, graphics and audio-- should go there.
It relies only on `./core/` code and data to know what to display when, plus canvas graphics code.

Directory `./server/` contains the code that runs the game as a server.
This code should be used only with online servers.
No graphic or audio code should end there (it should end in `./client/`).
It relies on NodeJS and uses `./core/` code and data.

Server setup
------------

1. Install `NodeJs` v12.1 or compatible with `npm`.
   Note that `websocket` will be installed automatically.
2. Clone this repository (say in directory `~/prototype`).
3. To run the game server using NodeJS server:
   1. Go in the `./server/` directory.
   2.a. Run: `node server/mainserv.js` (no debugging)
   2.b. To enable debugging, run: `node server/mainserv.js --inspect=127.0.0.1:3030` (replace the port by something useful for you).

At this point, the server should be accessible via the port `3000` of the server.





