'use strict'

const https = require('https');
const fs = require('fs');
const app = require('./app')

const options = {
  cert: fs.readFileSync('/etc/letsencrypt/live/il-backend.dogl.de/fullchain.pem'),
  key: fs.readFileSync('/etc/letsencrypt/live/il-backend.dogl.de/privkey.pem')
};

const port = process.env.PORT || 3003;

https.createServer(options, app).listen(port, () => {
  console.log(`Server is listening on port ${port}.`);
});