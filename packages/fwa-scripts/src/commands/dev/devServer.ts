import express from "express";

export async function devServer() {
  let app = express();

  app.get("/", function (req, res) {
    res.send("Hello World");
  });

  app.listen(3000, () => {
    console.log(`FWA started at http://localhost:3000`);
  });
}
