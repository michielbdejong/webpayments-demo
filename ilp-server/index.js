'use strict'

const STATICS_FOLDER = '../merchants/clothing'
const STATIC_FILES = [
  '/hat.png',
  '/index.html',
  '/inventory.js',
  '/receipt.html',
  '/style.css',
  '/t-shirt.png',
  '/wallet.png'
]

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

function serveFile(res, fileName) {
  if (STATIC_FILES.indexOf(fileName) == -1) {
    console.log('Path not allowed', fileName)
    res.writeHead(404)
    res.end()
  } else {
    fs.readFile(STATICS_FOLDER + fileName, function(err,data){
      res.end(data)
    })
  }
}
const server = https.createServer({
  key: fs.readFileSync(config.httpsKeyFileName),
  cert: fs.readFileSync(config.httpsCertFileName)
}, function(req, res) {
  const URL_PATH_FOR_IPR = '/ipr/'
  if (req.url.substring(0, URL_PATH_FOR_IPR.length) === URL_PATH_FOR_IPR) {
    let amount
    try {
      amount = parseFloat(req.url.substring(URL_PATH_FOR_IPR.length))
      if (isNaN(amount)) {
        amount = 1
        throw new Error('Not a number')
      }
    } catch (e) {
      console.log('Unparseable amount in URL', req.url);
    }
    const paymentRequest = receiver.createRequest({
      amount: amount,
      expiresAt: '3017-02-09T14:13:36.974Z',
    })
    res.writeHead(200, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': ''
    });
    res.write(JSON.stringify(paymentRequest))
    res.end()
  } else if (req.url === '/') {
    serveFile(res, '/index.html')
  } else {
    serveFile(res, req.url.split('?')[0])
  }
})

// This automatically checks the incoming transfer and fulfills the condition
receiver.on('incoming', (transfer, fulfillment) => {
  console.log('Got paid ' + paymentRequest.destinationAmount + ' for ' + paymentRequest.destinationMemo.thisIsFor)
})
server.listen(10000)
console.log('Listening on port 10000')
