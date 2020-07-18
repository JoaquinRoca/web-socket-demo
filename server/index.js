const diffLib = require('./dmp.js')
const textHistory = []
const WebSocket = require('ws')
const wss = new WebSocket.Server({ port: 8080 })
const updateClients = function(patchMessage, ws) {
  if (wss.clients) {
    wss.clients.forEach(function each(client) {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(patchMessage)
      }
    })
  }
}
wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(newMessage) {
    const lenOfHist = textHistory.length
    const existingMessage = lenOfHist
      ? textHistory[lenOfHist - 1].patchMessage
      : ''
    const dmp = new diffLib.diff_match_patch()
    const patches = dmp.patch_make(existingMessage, newMessage)
    const patchMessageResult = dmp.patch_apply(patches, existingMessage)
    if (patchMessageResult[1]) {
      const patchMessage = patchMessageResult[0]
      const newEntry = {
        existingMessage,
        newMessage,
        patchMessage
      }
      textHistory.push(newEntry)
      updateClients(patchMessage, ws)
    }
  })
})
