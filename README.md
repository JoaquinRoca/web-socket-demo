# Web Socket Demo
I built this to experiment with websockets. The server folder has a websocket server built using [ws](https://github.com/websockets/ws). I'm also using the [diff-patch-match](https://github.com/google/diff-match-patch) Google library in order to collaborately edit in a textarea across connections. I couldn't get the npm package to work so I just dumped it into a file named `dmp.js`. That's pretty much it!

## Running the server
Go into the server directory and  
`$ npm run start`  
Your websocket server is now running on port 8080.

## Client side
Open up the `index.html` file in the main directory in your browser. In fact, open that file up in two browser windows side by side. Start typing in the text field in one and you'll see the text show up in the other.

That's it!
