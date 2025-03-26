// vulnerable_app.js
const express = require('express');
const fs = require('fs');
const mysql = require('mysql');
const app = express();

// SCA Vulnerability: Using outdated packages with known vulnerabilities
const vulnerablePackage = require('lodash');
const xss = require('xss'); // XSS sanitizer but using an outdated version

// SAST Vulnerability: SQL Injection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'test'
});

app.get('/user', (req, res) => {
    const userId = req.query.id;
    const query = `SELECT * FROM users WHERE id = '${userId}'`; // No parameterized query
    connection.query(query, (err, result) => {
        if (err) {
            res.status(500).send('Database error');
        } else {
            res.json(result);
        }
    });
});

// SAST Vulnerability: Directory Traversal
app.get('/readfile', (req, res) => {
    const filename = req.query.file;
    fs.readFile(filename, 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error reading file');
        } else {
            res.send(data);
        }
    });
});

// SAST Vulnerability: Command Injection
app.get('/exec', (req, res) => {
    const cmd = req.query.cmd;
    require('child_process').exec(cmd, (error, stdout, stderr) => {
        if (error) {
            res.status(500).send('Execution error');
        } else {
            res.send(stdout);
        }
    });
});

// SAST Vulnerability: Cross-Site Scripting (XSS)
app.get('/xss', (req, res) => {
    const userInput = req.query.input;
    res.send(`<h1>Welcome ${userInput}</h1>`); // No sanitization, allows script injection
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
