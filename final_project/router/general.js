const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in: no username or password" })
  }

  if (!isValid(username)) {
    users.push({ username, password });

    //res.redirect("/customer/login");
    res.status(200).send("User successfully registered. You can login now.")
  }
  else {
    return res.status(404).json({ message: "A user with that username already exists"})
  }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  const promise = new Promise((resolve, reject) => {
    resolve(books);
  });

  promise.then(books => res.status(200).json(books));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const promise = new Promise((resolve, reject) => {
    resolve(books[req.params.isbn]);
  });
  

  promise.then(found => {
    if (!found) {
      return res.status(404).json({ message: 'No books were found with that isbn' });
    }

    return res.status(200).json(found);
  });
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  //const found = books.filter(book => book.author = req.params.author);
  const promise = new Promise((resolve, reject) => {
    resolve(Object.keys(books).filter(isbn => books[isbn].author === req.params.author));
  });

  promise.then(found => {
    if (found.length === 0) {
      return res.status(404).json({ message: 'No books were found with that author' });
    }

      return res.status(200).json(found.map(isbn => books[isbn]));
  });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const promise = new Promise((resolve, reject) => {
    resolve(Object.keys(books).filter(isbn => books[isbn].title === req.params.title));
  });

  promise.then(found => {
    if (found.length === 0) {
      return res.status(404).json({ message: 'No books were found with that title' });
    }

    return res.status(200).json(found.map(isbn => books[isbn]));
  });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const promise = new Promise((resolve, reject) => {
    resolve(Object.keys(books).filter(isbn => isbn === req.params.isbn));
  });

  promise.then(found => {
    if (found.length === 0) {
      return res.status(404).json({ message: 'No books were found with that isbn' });
    }

    return res.status(200).json({ reviews: found[0].reviews });
  });
});

module.exports.general = public_users;
