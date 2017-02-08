'use strict'

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
setTimeout(function() {
const paymentRequest = receiver.createRequest({
  amount: 10

})
// XXX: user implements this
sendRequestToPayer(paymentRequest)
}, 3000)

// This automatically checks the incoming transfer and fulfills the condition
receiver.on('incoming', (transfer, fulfillment) => {
  console.log('Got paid ' + paymentRequest.destinationAmount + ' for ' + paymentRequest.destinationMemo.thisIsFor)
})

function sendRequestToPayer(a) {
  console.log(a);
}
