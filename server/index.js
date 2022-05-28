const express = require("express");
const app = express();
const port = 3000;
const { run } = require("../examples/server-runner");
let locked = false;

app.get("/:wallet", (req, res) => {
  console.log("querying for address " + req.params.wallet);
  run(req.params.wallet)
    .then((val) => {
      res.end(val.toString());
    })
    .catch((err) => {
      res.end("something went wrong");
    });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
