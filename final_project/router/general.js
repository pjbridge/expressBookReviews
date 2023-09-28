const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username)=>{
  let userswithsamename = users.filter((user)=>{
    return user.username === username
  });
  if(userswithsamename.length > 0){
    return true;
  } else {
    return false;
  }
}

public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!doesExist(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  } 
  return res.status(404).json({message: "Unable to register user."});
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

    let filteredBooks = []
    for(const [key, values] of Object.entries(books)){
        const book = Object.entries(values);
        for(let i = 0; i < book.length ; i++){
            if(book[i][0] == 'author' && book[i][1] == req.params.author){
              filteredBooks.push(books[key]);
            }
        }
    }
    if(filteredBooks.length == 0){
        return res.status(300).json({message: "Author not found"});
    }
    res.send(JSON.stringify(filteredBooks,null,4));
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    
  let filteredBooks = []
  for(const [key, values] of Object.entries(books)){
      const book = Object.entries(values);
      for(let i = 0; i < book.length ; i++){
          if(book[i][0] == 'title' && book[i][1] == req.params.title){
            filteredBooks.push(books[key]);
          }
      }
  }
  if(filteredBooks.length == 0){
      return res.status(300).json({message: "Title not found"});
  }
  res.send(JSON.stringify(filteredBooks,null,4));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  res.send(JSON.stringify(books[req.params.isbn].reviews,null,4));
});


function getBookList(){
  return new Promise((resolve,reject)=>{
    resolve(books);
  })
}

//Task 10, promise/asyn booklist
public_users.get('/',function (req, res) {
  getBookList().then(
    (bk)=>res.send(JSON.stringify(bk, null, 4)),
    (error) => res.send("Rejected")
  );  
});


function getFromISBN(isbn){
  let book = books[isbn];  
  return new Promise((resolve,reject)=>{
    if (book) {
      resolve(book);
    }else{
      reject("Could not find the book!");
    }    
  })
}
// Task 11, ISBN promise/async
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  getFromISBN(isbn).then(
    (bk)=>res.send(JSON.stringify(bk, null, 4)),
    (error) => res.send(error)
  )
 });


function getFromAuthor(author){
  let output = [];
  return new Promise((resolve,reject)=>{
    for (var isbn in books) {
      let book = books[isbn];
      if (book.author === author){
        output.push(book);
      }
    }
    resolve(output);  
  })
}

 // Task 12 

public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  getFromAuthor(author)
  .then(
    result =>res.send(JSON.stringify(result, null, 4))
  );
});



function getFromTitle(title){
  let output = [];
  return new Promise((resolve,reject)=>{
    for (var isbn in books) {
      let book = books[isbn];
      if (book.title === title){
        output.push(book);
      }
    }
    resolve(output);  
  })
}

// Task 13
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  getFromTitle(title)
  .then(
    result =>res.send(JSON.stringify(result, null, 4))
  );
});


module.exports.general = public_users;
