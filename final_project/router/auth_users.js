const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
}

regd_users.post("/register", (req,res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username or password missing" });
    }

    if (users.find(user => user.username === username)) {
        return res.status(400).json({ message: "User already exists" });
    }

    users.push({ username, password });

    return res.status(200).json({ message: "User successfully registered" });
});

//only registered users can login
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;

    // Validar datos
    if (!username || !password) {
        return res.status(400).json({ message: "Username or password missing" });
    }

    // Verificar usuario
    let validUser = users.find(user => user.username === username && user.password === password);

    if (!validUser) {
        return res.status(404).json({ message: "Invalid Login. Check username and password" });
    }

    // Crear token
    let accessToken = jwt.sign({ username: username }, "fingerprint_customer", { expiresIn: "1h" });

    // Guardar en sesión
    req.session.authorization = {
        accessToken: accessToken
    };

    return res.status(200).json({ message: "Login successful!" });
});

// Add a book review
regd_users.put("/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.query.review;
    const username = req.user.username;

    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }

    // Agregar o modificar review
    books[isbn].reviews[username] = review;

    return res.status(200).json({
        message: "Review added/updated successfully",
        reviews: books[isbn].reviews
    });
});

// Delete review
regd_users.delete("/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.user.username;

    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }

    if (books[isbn].reviews[username]) {
        delete books[isbn].reviews[username];
        return res.status(200).json({
            message: `Review for ISBN ${isbn} deleted`
        });
    }

    return res.status(404).json({ message: "No review found for this user" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
