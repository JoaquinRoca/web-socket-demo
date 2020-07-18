// This is the Google diff-match-patch library see the README
const diffLib = require('./dmp.js')

// This is the ws websocket library see the README
const WebSocket = require('ws')

// This is an array that will hold a history of all the messages received
// You'll want to change this, especially if you're expecting a lot of updates
const textHistory = []

// Create the server and listen on port 8080
const wss = new WebSocket.Server({ port: 8080 })

// This function updates all the clients that are connected
const updateClients = (patchMessage, ws) => {
  // First check to make sure there are connected clients
  if (wss.clients) {
    // For each client that is connected
    wss.clients.forEach(client => {
      // If the client is not the sender and is ready
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        // Send the patched message
        client.send(patchMessage)
      }
    })
  }
}

// This is the function that is colled when a connection is made to the server
wss.on('connection', (ws) => {
  // This is defining the behavior when receiving a new message
  ws.on('message', (newMessage) => {
    // Grab the length of the history array
    const lenOfHist = textHistory.length
    // If there are objects in the history array, grab the patched message of
    // the last objeect. Otherwise, the existing message is an empty string
    const existingMessage = lenOfHist
      ? textHistory[lenOfHist - 1].patchMessage
      : ''
    // Initialize the diff_match_patch object
    const dmp = new diffLib.diff_match_patch()
    // Use the dmp to get an array of patches based on the existing and new
    // messages
    const patches = dmp.patch_make(existingMessage, newMessage)
    // Find the result of applying the patches
    const patchMessageResult = dmp.patch_apply(patches, existingMessage)
    // If there is a result
    if (patchMessageResult[1]) {
      // Grab the new message based on the patch
      const patchMessage = patchMessageResult[0]
      // Create a new entry for the history array
      const newEntry = {
        existingMessage,
        newMessage,
        patchMessage
      }
      // Update the history
      textHistory.push(newEntry)
      // Inform connected clients of the patch
      updateClients(patchMessage, ws)
    }
  })
})
