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
        return fs.readFile(`./data/owners/${ownerFile}`, "utf8");
      });
      return Promise.all(promiseArr); //To solve this array of promises we use Promise.all()
    })
    .then((ownerInfoArr) => {
      const ownerInfoArrJS = ownerInfoArr.map((ownerString) => {
        return JSON.parse(ownerString);
      });
      res.send(ownerInfoArrJS);
    });
});

//TASK 2 but with .push instead

// app.get("/api/owners", (req, res) => {
//   fs.readdir("./data/owners", "utf8")
//     .then((owners) => {
//       let arr = [];

//       owners.forEach((ownerFile) => {
//         arr.push(fs.readFile(`./data/owners/${ownerFile}`, "utf8"));
//       });
//       return Promise.all(arr);
//     })
//     .then((arr) => {
//       const JS = arr.map((string) => {
//         return JSON.parse(string);
//       });
//       res.send(JS);
//     });
// });

//TASK 3

app.get("/api/owners/:id/pets", (req, res) => {
  const { id } = req.params;
  fs.readdir("./data/pets", "utf8")
    .then((pets) => {
      const promiseArr = pets.map((petsFile) => {
        return fs.readFile(`./data/pets/${petsFile}`, "utf8");
      });
      return Promise.all(promiseArr);
    })
    .then((petsInfoArr) => {
      const petsOfOwner = petsInfoArr
        .map((pet) => {
          return JSON.parse(pet);
        })
        .filter((petJS) => {
          return petJS.owner === `o${id}`;
        });
      res.send(petsOfOwner);
    });
});

//TASK 4
//same as get all owners but for pets. then filter based on req.query

app.get("/api/pets", (req, res) => {
  fs.readdir("./data/pets", "utf8")
    .then((pets) => {
      const promiseArr = pets.map((petFile) => {
        return fs.readFile(`./data/pets/${petFile}`, "utf8");
      });
      return Promise.all(promiseArr);
    })
    .then((petInfoArr) => {
      const petsJS = petInfoArr.map((pet) => {
        return JSON.parse(pet);
      });
      res.send(petsJS);
    });
});

//TASK 5

app.get("/api/pets/:id", (req, res) => {
  const { id } = req.params;
  fs.readFile(`./data/pets/p${id}.json`, "utf8").then((petInfo) => {
    const petJS = JSON.parse(petInfo);
    res.send(petJS);
  });
});

//TASK 6
// app.patch("/api/owners/:id/edit", (req, res) => {
//   const { id } = req.params;
//   const ownerUpdated = req.body;

//   fs.writeFile(`./data/owners/o${id}.json`, JSON.stringify(ownerUpdated))
//     .then(() => {
//       res.status(201).send(ownerUpdated);
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// });

app.patch("/api/owners/:id/edit", (req, res) => {
  const { id } = req.params;
  const body = req.body;
  fs.readFile(`./data/owners/o${id}.json`).then((owner) => {
    const ownerJS = JSON.parse(owner);
    ownerJS.name = body.name;
    ownerJS.age = body.age;
    console.log(ownerJS, "HERE1");
    return fs
      .writeFile(`./data/owners/o${id}.json`, JSON.stringify(ownerJS))
      .then(() => {
        res.status(201);
        res.send(ownerJS);
      });
  });
});

app.post("/api/owners/create", (req, res) => {});

app.listen(8080, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("express listnening to port 8080");
  }
});
