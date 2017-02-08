This assumes you already have ilp-kit running on a server, with https.

````
cd ilp-server
npm install
cp config.js-sample config.js
vim config.js # edit the values in there
node index.js
