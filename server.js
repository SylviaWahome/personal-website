// server.js - wrapper around json-server for Render
const jsonServer = require('json-server');
const server = jsonServer.create();
const path = require('path');
const router = jsonServer.router(path.join(__dirname, 'db.json'));
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.bodyParser);
server.use(router);

const port = process.env.PORT || 10000;
const host = '0.0.0.0';
server.listen(port, host, () => {
  console.log(`JSON Server is running on http://${host}:${port}`);
});
