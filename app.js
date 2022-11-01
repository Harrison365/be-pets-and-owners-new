//npm init -y
//npm i express
//npm i nodemon -D // (npm run dev) will now run the server and keep it on between changes so no need to restart

const express = require("express");
const fs = require("fs/promises");
const app = express();
app.use(express.json()); // allows us to access post request body.

//TASK 1

app.get("/api/owners/:id", (req, res) => {
  const { id } = req.params;
  fs.readFile(`./data/owners/o${id}.json`, "utf8").then((ownerInfo) => {
    const ownerJS = JSON.parse(ownerInfo);
    res.send(ownerJS);
  });
});

//TASK 2

app.get("/api/owners", (req, res) => {
  fs.readdir("./data/owners", "utf8") //readir returns an array of file names
    .then((owners) => {
      const promiseArr = owners.map((ownerFile) => {
        //then we map through the file names and read them. the return the parsed constents to the map array. However these are all promises.
        return fs
          .readFile(`./data/owners/${ownerFile}`, "utf8")
          .then((ownerInfo) => {
            return JSON.parse(ownerInfo);
          });
      });
      return Promise.all(promiseArr); //To solve this array of promises we use Promise.all()
    })
    .then((ownerInfoArr) => {
      res.send(ownerInfoArr); //then we send the owner info :)
    });
});

//TASK 3

app.get("/api/owners/:id/pets", (req, res) => {
  const { id } = req.params;
  fs.readdir("./data/pets", "utf8")
    .then((pets) => {
      const promiseArr = pets.map((petsFile) => {
        return fs
          .readFile(`./data/pets/${petsFile}`, "utf8")
          .then((petsInfo) => {
            return JSON.parse(petsInfo);
          });
      });
      return Promise.all(promiseArr);
    })
    .then((petsInfoArr) => {
      console.log(petsInfoArr);
      //res.send();
    });
});

app.listen(8080, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("express listnening to port 8080");
  }
});
