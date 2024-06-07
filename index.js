const express = require("express"),
  mongoose = require("mongoose"),
  axios = require("axios"),
  app = require("./app"),
  http = require("http"),
  server = http.createServer(app);

server.listen(6000, () => {
  console.log("el servidor esta activo");
});
