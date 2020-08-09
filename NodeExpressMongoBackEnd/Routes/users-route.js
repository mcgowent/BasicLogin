// library imports
// a 1 liner short cut for creating a router with express
const router = require("express").Router();
const bcrypt = require("bcryptjs"); // Bcryptjs is better for us to use because it is available in more places than bcrypt which is native to C++

// Middlware imports
const generateToken = require("../middleware/generateToken");
const mw = require("../middleware/users-middleware");

// model imports
const Users = require("../models/users-model");

// ======================== GET Requests ===========================

// get list of all users (admin only)
router.get("/", (req, res) => {
  Users.find()
    .then((docs) => {
      res.status(200).json(docs);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

// get user by id
router.get("/:_id", (req, res) => {
  const { _id } = req.params;

  Users.findById(_id)
    .then((docs) => {
      res.status(200).json(docs);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

// ======================== POST Requests ==========================

// add a user
router.post("/", (req, res) => {
  let temp = req.body;
  const hash = bcrypt.hashSync(temp.password, 12);
  temp.password = hash;
  console.log(temp.password);
  const user = new Users(temp);

  // saving the user to the users collection
  user
    .save()
    .then((user) => {
      const token = generateToken(user);
      res.status(201).json({ message: "User Created", token, user });
    })
    .catch((err) => {
      res.status(500).json({ error: `${err}` });
    });
});

//Login
router.post("/login", (req, res) => {
  const { username, password } = req.body;
  console.log("Username:", { username: username });
  Users.findOne({ username: username })
    .then((user) => {
      //If the password matches after going through the hash continue
      if (user && bcrypt.compareSync(password, user.password)) {
        // Create a token
        const token = generateToken(user);
        res.status(200).json({ message: "Welcome", token });
      } else {
        error("Wrong Information", 401, res);
      }
    })
    .catch((err) => {
      res.status(501).json({ message: "It Went to the Catch", err });
    });
});

//Logout
router.get("/logout", (req, res) => {
  //Check for a current session in progress and then end it with a destroy method
  if (req.session) {
    //Destroy session by setting it to null
    req.session.destroy;
    //End the response to close
    res.send("You have been Logged Out");
  }
  //If a session doesn't exist notify the user to login
  else {
    res.send("Session Doesn't exist, logged out.");
  }
});

// ======================== PUT Requests ===========================

// update specific user information
router.put("/:_id", (req, res) => {
  const { _id } = req.params;

  Users.findByIdAndUpdate(_id, req.body)
    .then((updatedUser) => {
      res.status(204).json(updatedUser);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

// ======================== DELETE Requests ========================

// delete user by id
router.delete("/:_id", (req, res) => {
  const { _id } = req.params;

  Users.findByIdAndRemove(_id)
    .then((deletedUser) => {
      res
        .status(204)
        .json({ message: `User deleted successfully.`, deletedUser });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

module.exports = router;
