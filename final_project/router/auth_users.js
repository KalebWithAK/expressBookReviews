const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
  const found = users.filter(user => user.username === username);

  if (found.length === 1) {
    return true;
  }

  return false;
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records
  const found = users.filter(user => user.username === username && user.password === password);

  if (found.length === 1) {
    return true;
  }
  return false;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in: no username or password" });
  }
  
  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({ data: password }, "access", { expiresIn: 60 * 60 });

    req.session.authorization = { accessToken, username };

    return res.status(200).send("User successfully signed in");
  }
  else {
    return res.status(208).send("Invalid username or password");
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const reviews_length = Object.keys(books[req.params.isbn].reviews).length;

  books[req.params.isbn].reviews[req.session.authorization.username] = req.body.review;

  if (Object.keys(books[req.params.isbn].reviews).length === reviews_length + 1) {
    return res.status(200).json(books[req.params.isbn]);
  }
  else {
    return res.status(403).json({ message: "There was an issue creating a review" })
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const reviews_length = Object.keys(books[req.params.isbn].reviews).length;

  delete books[req.params.isbn].reviews[req.session.authorization.username];

  if (Object.keys(books[req.params.isbn].reviews).length === reviews_length - 1) {
    return res.status(200).json(books[req.params.isbn]);
  }
  else {
    return res.status(403).json({ message: "There was an issue creating a review" })
  }
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
