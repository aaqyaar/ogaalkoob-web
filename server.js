const express = require("express");
const next = require("next");
const cors = require("cors");
const { Client } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  // Enable CORS
  server.use(cors());

  server.all("*", (req, res) => {
    return handle(req, res);
  });

  server.listen(3001, (err) => {
    if (err) throw err;
    console.log("> Ready on http://localhost:3001");
  });
});
