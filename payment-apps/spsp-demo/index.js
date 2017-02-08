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
  if (req.url === '/') {
    serveFile(res, '/index.html')
  } else {
    serveFile(res, req.url.split('?')[0])
  }
})
server.listen(20000)
console.log('Listening on port 20000')
