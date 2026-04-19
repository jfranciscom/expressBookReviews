const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const axios = require('axios');
const public_users = express.Router();

const baseURL = 'http://localhost:5000';

/**
 * @route POST /register
 * @description Register a new user
 * @body {username, password}
 * @returns {message}
 */
public_users.post("/register", (req, res) => {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
        return res.status(400).json({ message: "Username or password missing" });
    }

    // Check if user already exists
    let userExists = users.find(user => user.username === username);
    if (userExists) {
        return res.status(400).json({ message: "User already exists" });
    }

    // Register user
    users.push({ username, password });

    return res.status(200).json({ message: "User successfully registered" });
});

/**
 * @route GET /
 * @description Get all books
 * @returns {books}
 */
public_users.get('/', function (req, res) {
    return res.json(books);
});

/**
 * @route GET /async/books
 * @description Get all books using async/await with axios
 */
public_users.get('/async/books', async (req, res) => {
    try {
        const response = await axios.get(baseURL);
        return res.send(response.data);
    } catch (error) {
        return res.status(500).json({ message: "Error fetching books" });
    }
});


/**
 * @route GET /isbn/:isbn
 * @description Get book details by ISBN
 * @param {string} isbn
 * @returns {book}
 */
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;

    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }

    return res.send(books[isbn]);
});

/**
 * @route GET /async/isbn/:isbn
 * @description Get book by ISBN using Promises
 */
public_users.get('/async/isbn/:isbn', (req, res) => {
    const isbn = req.params.isbn;

    axios.get(`${baseURL}/isbn/${isbn}`)
        .then(response => {
            return res.send(response.data);
        })
        .catch(error => {
            return res.status(500).json({ message: "Error fetching book by ISBN" });
        });
});

/**
 * @route GET /author/:author
 * @description Get books by author
 * @param {string} author
 * @returns {books}
 */
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    let result = {};

    Object.keys(books).forEach(key => {
        if (books[key].author === author) {
            result[key] = books[key];
        }
    });

    if (Object.keys(result).length === 0) {
        return res.json({ message: "No books found" });
    }

    return res.send(result);
});

/**
 * @route GET /async/author/:author
 * @description Get books by author using async/await
 */
public_users.get('/async/author/:author', async (req, res) => {
    const author = req.params.author;

    try {
        const response = await axios.get(`${baseURL}/author/${author}`);
        return res.send(response.data);
    } catch (error) {
        return res.status(500).json({ message: "Error fetching books by author" });
    }
});


/**
 * @route GET /title/:title
 * @description Get books by title
 * @param {string} title
 * @returns {books}
 */
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    let result = {};

    Object.keys(books).forEach(key => {
        if (books[key].title === title) {
            result[key] = books[key];
        }
    });

    if (Object.keys(result).length === 0) {
        return res.json({ message: "No books found" });
    }

    return res.send(result);
});


/**
 * @route GET /async/title/:title
 * @description Get books by title using async/await
 */
public_users.get('/async/title/:title', async (req, res) => {
    const title = req.params.title;

    try {
        const response = await axios.get(`${baseURL}/title/${title}`);
        return res.send(response.data);
    } catch (error) {
        return res.status(500).json({ message: "Error fetching books by title" });
    }
});

/**
 * @route GET /review/:isbn
 * @description Get reviews for a book by ISBN
 * @param {string} isbn
 * @returns {reviews}
 */
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;

    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }

    if (!books[isbn].reviews || Object.keys(books[isbn].reviews).length === 0) {
        return res.json({ message: "No reviews found for this book." });
    }

    return res.send(books[isbn].reviews);
});

module.exports.general = public_users;