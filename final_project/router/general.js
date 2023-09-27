const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    if(isbn < 1 || isbn > 10){
        return res.status(400).json({message: "ISBN out of range"});
    }
   res.send(JSON.stringify(books[isbn],null,4));
 });    
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    let filteredBooks = books.filter((book)=> { return boook.author === req.params.author})
    res.send(JSON.stringify(filteredBooks,null,4));
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    let filteredBooks = books.filter((book)=> { return boook.title === req.params.title})
    res.send(JSON.stringify(filteredBooks,null,4));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  res.send(JSON.stringify(book[req.params.isbn].reviews,null,4));
});

module.exports.general = public_users;
