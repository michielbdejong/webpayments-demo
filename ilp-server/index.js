'use strict'

const fs = require('fs')
const https = require('https')
const ILP = require('ilp')
const FiveBellsLedgerPlugin = require('ilp-plugin-bells')
const config = require('./config')

const receiver = ILP.createReceiver({
  _plugin: FiveBellsLedgerPlugin,
  prefix: '',
  account: `https://${config.ilpKitHost}/ledger/accounts/${config.username}`,
  password: config.password
})
receiver.listen()

const server = https.createServer({
  key: fs.readFileSync(config.httpsKeyFileName),
  cert: fs.readFileSync(config.httpsCertFileName)
}, function(req, res) {
  let amount
  try {
    amount = parseFloat(req.url.substring(1))
    if (isNaN(amount)) {
      amount = 1
      throw new Error('Not a number')
    }
  } catch (e) {
    console.log('Unparseable amount in URL', req.url);
  }
  const paymentRequest = receiver.createRequest({
    amount: amount
  })
  res.writeHead(200);
  res.write(JSON.stringify(paymentRequest))
  res.end()
})

// This automatically checks the incoming transfer and fulfills the condition
receiver.on('incoming', (transfer, fulfillment) => {
  console.log('Got paid ' + paymentRequest.destinationAmount + ' for ' + paymentRequest.destinationMemo.thisIsFor)
})
server.listen(10000)
console.log('Listening on port 10000')
