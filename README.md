Hackalott Robotics
==================

This is a Gamkedo Club Multiplayer Game using NodeJS on server-side.
See: https://gamkedo.com


How to test the game
--------------------

First, clone this repository somewhere on your disk. Then:

- If you want to only test solo mode or on the default online server: **just drop the index.html file in your browser window. :)**
- If you want to play online with a local server running own on your computer: follow instructions bellow in Server Setup section.
- If you want to put online an online server: follow instructions bellow in Server Setup section.

Organization
------------

- `index.html` is the main client interface. It can be used directly if you clone the code locally and run it.
It's also the same file that the remote server will send to clients who connects to the server using HTTP.

- `./server/admin.html` is the page (linked from `index.html`) exposing tools to handle the server.

- Directory `./core/` contains the code describing the game internal representation and rules.
It's where the game rules and effects and principles should be coded.

- Directory `./client/` contains the code that should only be visible from the client side.
All interractive (input/output) code-- input, graphics and audio-- should go there.
It relies only on `./core/` code and data to know what to display when, plus canvas graphics code.

- Directory `./server/` contains the code that runs the game as a server.
This code should be used only with online servers.
No graphic, audio or game-specific code should end there (it should end in `./client/` or `./core/`).
It relies on NodeJS as server implementation and uses `./core/` to launch and update the game.
It also exposes `index.html` by default, which uses `./client`.


Server setup
------------

Short version:

```
# After installing NodeJS:
git clone https://github.com/gamkedo-la/hackalott-robotics.git
cd hackalott-robotics
npm install
node --experimental-modules ./server/mainserv.js 3000
# Now the servers should be running: http://127.0.0.1:3000
```

Explained version:

1. Install `NodeJS` **v12.2** or compatible (this will also install `npm`).

    On Ubuntu LTS, because the NodeJS package version might be older, you might need to use NodeJS's PPA as explained there: https://tecadmin.net/install-latest-nodejs-npm-on-ubuntu/

    NOTE: We will use this `NodeJS` version to enable the experimental modules implementation. That feature allows us to have same code
    shared between the server and the client which can "import/export" with the same syntax. This helps to avoid having code specific to either NodeJS or client-side.
    The code is the same for both. :)
          
2. Clone this repository (say in directory `~/hackalott`).

3. Go in the cloned directory (say `cd hackalott`).

4. Let `npm` install the project's dependencies: 
   - If you intend to develop: run `npm install`
   - If you just want to run the server (for live production or CI): run `npm ci`

5. To run the game server using NodeJS server:
   - Run: `node --experimental-modules ./server/mainserv.js 3000` (no debugging). 
      - `./server/mainserv.js` is the main script of the server. It does both serving files (like `index.html`) and runs the websockets and game state.
      - `3000` is the port to expose to, it can be some other valid and available port.
      - `--experimental-modules` enables the ECMAScript 6 Modules syntax in NodeJS (instead of the NodeJS-specific one).
   -  TODO: NEVER TRIED YET: To enable debugging, run instead: `node --experimental-modules --inspect=127.0.0.1:3030 ./server/mainserv.js ` (replace the port by something useful for you). 

6. At this point, the server should be accessible via the port `3000` of the host machine (or another port if you specified another one).
   - **To make it visible from outside, you'll have to setup your web server (NGinX or Apache or other) to forward requests from the address/port you want to this port in this machine.** This depends on your web server configuration system.
   - **To try the game from the same computer without exposing it outside of your computer**, go to `http://127.0.0.1:3000` (or another port if you specified another one) .
   - Alternatively, **you can just drop `index.html` in your browser** - in this case the online server address will be the default one, so you need to replace it by `http://127.0.0.1:3000` (or another port if you specified another one). The online server info box will not be displayed though.






