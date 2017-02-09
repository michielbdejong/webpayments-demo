'use strict'

const STATICS_FOLDER = '.'
const STATIC_FILES = [
  '/index.html',
  '/app.js',
  '/app.html'
]

const fs = require('fs')
const https = require('https')
const config = require('../../ilp-server/config')
const ILP = require('ilp')
const FiveBellsLedgerPlugin = require('ilp-plugin-bells')

function pay(data) {
  const sender = ILP.createSender({
    _plugin: FiveBellsLedgerPlugin,
    prefix: 'lu.eur.michiel.',
    account: 'https://ilp-kit.michielbdejong.com/ledger/accounts/' + data.username,
    password: data.password,
    connectors: ['connector']
  })
  
  return sender.quoteRequest(data.ipr)
    .then((paymentParams) => {
      return sender.payRequest(paymentParams)
    })
}

function serveFile(res, fileName) {
  if (STATIC_FILES.indexOf(fileName) == -1) {
    console.log('Path not allowed', fileName)
    res.writeHead(404)
    res.end()
  } else {
    fs.readFile(STATICS_FOLDER + fileName, function(err,data){
      if (fileName.substr(-3) === '.js') {
        res.writeHead(200, {
          'Content-Type': 'application/javascript'
        });
      }
      res.end(data)
    })
  }
}
const server = https.createServer({
  key: fs.readFileSync(config.httpsKeyFileName),
  cert: fs.readFileSync(config.httpsCertFileName)
}, function(req, res) {
  console.log(req.url);
  if (req.url === '/pay') {
    console.log('Pay!');
    var body = '';
    req.on('data', function(chunk) {
      body += chunk;
    });
    req.on('end', function() {
      console.log({body});
      try {
        var data = JSON.parse(body);
        console.log('paying', data);
        pay(data).then(function(fulfillment) {
          console.log('paid', data, fulfillment);
          res.writeHead(200);
          res.end(JSON.stringify({ fulfillment });
        });
       } catch(e) {
        res.writeHead(500);
        res.end(JSON.stringify({ body, err }));
      }
    });
  } else if (req.url === '/') {
    serveFile(res, '/index.html')
  } else {
    serveFile(res, req.url.split('?')[0])
  }
})
server.listen(20000)
console.log('Listening on port 20000')
