const express = require('express');
const cors = require('cors');
const { tavily } = require("@tavily/core");
const fs = require('fs');
const fileUpload = require('express-fileupload');
const path = require('path');  // Import the 'path' module here
const axios=require("axios")
const Groq = require('groq-sdk');

const app = express();
const port = process.env.PORT || 5000;

// Initialize Tavily client
const tvly = tavily({ apiKey: "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" });
const groq = new Groq({ apiKey: "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" });
// Middleware
app.use(cors());
app.use(express.json());
app.use(fileUpload());


app.post('/api/search', async (req, res) => {
    try {
      const { userQuery } = req.body;  // Extract user query from request body
      const chatCompletion = await groq.chat.completions.create({
        messages: [{ role: 'user', content: userQuery }],
        model: 'llama3-8b-8192',
      });
  
      // Send back the response from the Groq API
      res.json({ response: chatCompletion.choices[0]?.message?.content || 'No response' });
    } catch (error) {
      console.error('Error while fetching chat completion:', error);
      res.status(500).json({ error: 'Error processing your request' });
    }
  });

// // Directory for storing uploaded PDFs
// const uploadsDir = path.join(__dirname, 'uploads');
// if (!fs.existsSync(uploadsDir)){
//     fs.mkdirSync(uploadsDir);
// }

// // Endpoint for uploading PDF and extracting links
// app.post('/upload', async (req, res) => {
//     if (!req.files || !req.files.pdf) {
//         return res.status(400).json({ error: 'No file uploaded' });
//     }

//     const pdfFile = req.files.pdf;
//     const uploadPath = path.join(__dirname, 'uploads', pdfFile.name);

//     try {
//         // Save the file locally
//         await pdfFile.mv(uploadPath);
        
//         // Read the PDF file as base64
//         const pdfBuffer = fs.readFileSync(uploadPath);
//         const base64Pdf = pdfBuffer.toString('base64');

//         // Send to GROQ API to extract links
//         const groqResponse = await axios.post(
//             'https://api.groq.com/v1/documents/analyze',  // Endpoint to analyze document
//             {
//                 document: {
//                     type: "pdf",
//                     content: base64Pdf
//                 },
//                 analysis_type: "extract_links"  // Analysis type to extract links
//             },
//             {
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'Authorization': `Bearer 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`,
//                 }
//             }
//         );

//         // Extract links from the response
//         const links = groqResponse.data.links || [];
        
//         // Clean up uploaded file
//         fs.unlinkSync(uploadPath);
        
//         res.json({ links });

//     } catch (error) {
//         console.error("Error details:", error.response?.data || error.message);
        
//         // Clean up uploaded file in case of error
//         if (fs.existsSync(uploadPath)) {
//             fs.unlinkSync(uploadPath);
//         }

//         // Send appropriate error response
//         if (error.response?.status === 404) {
//             res.status(404).json({ 
//                 error: 'GROQ API endpoint not found. Please check the API documentation for the correct endpoint.',
//                 details: error.response.data
//             });
//         } else if (error.response?.status === 401) {
//             res.status(401).json({ 
//                 error: 'Authentication failed. Please check your GROQ API key.',
//                 details: error.response.data
//             });
//         } else {
//             res.status(500).json({ 
//                 error: 'Failed to extract links from PDF',
//                 details: error.response?.data || error.message
//             });
//         }
//     }
// });




// Search endpoint
app.post('/search', async (req, res) => {
    try {
        const { query, searchType = 'basic' } = req.body;

        if (!query) {
            return res.status(400).json({
                error: 'Query parameter is required'
            });
        }

        const searchOptions = {
            query,
            searchType, // 'basic' or 'analysis'
            includeAnswer: true,
            maxResults: 1
        };

        const searchResult = await tvly.search(query, searchOptions);

        res.json(searchResult);
    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({
            error: 'Failed to perform search',
            message: error.message
        });
    }
});

// Advanced search endpoint with more options
app.post('/advanced-search', async (req, res) => {
    try {
        const {
            query,
            searchType = 'analysis',
            maxResults = 10,
            includeAnswer = true,
            includeImages = false,
            includeDomains = [],
            excludeDomains = [],
            language = 'en'
        } = req.body;

        if (!query) {
            return res.status(400).json({
                error: 'Query parameter is required'
            });
        }

        const searchOptions = {
            searchType,
            maxResults,
            includeAnswer,
            includeImages,
            includeDomains,
            excludeDomains,
            language
        };

        const searchResult = await tvly.search(query, searchOptions);

        res.json(searchResult);
    } catch (error) {
        console.error('Advanced search error:', error);
        res.status(500).json({
            error: 'Failed to perform advanced search',
            message: error.message
        });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});




// const express = require('express');
// const mysql = require('mysql2');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const cors = require('cors');
// const cookieParser = require('cookie-parser');

// const { tavily } = require("@tavily/core");

// const app = express();
// const port = process.env.PORT || 3000;

// // Middleware
// app.use(cors({ origin: true, credentials: true }));
// app.use(express.json());
// app.use(cookieParser());

// // MySQL Database Connection
// const db = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: 'your_password',
//     database: 'your_database_name'
// });

// db.connect(err => {
//     if (err) throw err;
//     console.log('Connected to MySQL');
// });

// // JWT Secret
// const JWT_SECRET = 'your_jwt_secret';

// // Tavily client
// const tvly = tavily({ apiKey: "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" });

// // Signup Route
// app.post('/signup', async (req, res) => {
//     const { username, email, password } = req.body;
//     if (!username || !email || !password) {
//         return res.status(400).json({ message: 'All fields are required' });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const query = `INSERT INTO users (username, email, password) VALUES (?, ?, ?)`;
//     db.query(query, [username, email, hashedPassword], (err, result) => {
//         if (err) return res.status(500).json({ message: 'Error creating user' });
//         return res.status(201).json({ message: 'User created' });
//     });
// });

// // Login Route
// app.post('/login', (req, res) => {
//     const { email, password } = req.body;
//     if (!email || !password) {
//         return res.status(400).json({ message: 'Email and password are required' });
//     }

//     const query = `SELECT * FROM users WHERE email = ?`;
//     db.query(query, [email], async (err, results) => {
//         if (err) return res.status(500).json({ message: 'Server error' });
//         if (results.length === 0) return res.status(400).json({ message: 'Invalid credentials' });

//         const user = results[0];
//         const isPasswordValid = await bcrypt.compare(password, user.password);
//         if (!isPasswordValid) return res.status(400).json({ message: 'Invalid credentials' });

//         const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
//         res.cookie('accessToken', token, { httpOnly: true, secure: true, sameSite: 'lax' });
//         return res.json({ message: 'Login successful' });
//     });
// });


// app.post('/search', async (req, res) => {
//     try {
//         const { query, searchType = 'basic' } = req.body;

//         if (!query) {
//             return res.status(400).json({
//                 error: 'Query parameter is required'
//             });
//         }

//         const searchOptions = {
//             query,
//             searchType, // 'basic' or 'analysis'
//             includeAnswer: true,
//             maxResults: 1
//         };

//         const searchResult = await tvly.search(query, searchOptions);

//         res.json(searchResult);
//     } catch (error) {
//         console.error('Search error:', error);
//         res.status(500).json({
//             error: 'Failed to perform search',
//             message: error.message
//         });
//     }
// });

// // Advanced search endpoint with more options
// app.post('/advanced-search', async (req, res) => {
//     try {
//         const {
//             query,
//             searchType = 'analysis',
//             maxResults = 10,
//             includeAnswer = true,
//             includeImages = false,
//             includeDomains = [],
//             excludeDomains = [],
//             language = 'en'
//         } = req.body;

//         if (!query) {
//             return res.status(400).json({
//                 error: 'Query parameter is required'
//             });
//         }

//         const searchOptions = {
//             searchType,
//             maxResults,
//             includeAnswer,
//             includeImages,
//             includeDomains,
//             excludeDomains,
//             language
//         };

//         const searchResult = await tvly.search(query, searchOptions);

//         res.json(searchResult);
//     } catch (error) {
//         console.error('Advanced search error:', error);
//         res.status(500).json({
//             error: 'Failed to perform advanced search',
//             message: error.message
//         });
//     }
// });
// // Public Route (No Authentication Required)
// app.get('/tavily-ai', (req, res) => {
//     res.json({ message: 'Welcome to the Tavily AI Page' });
// });

// // Start server
// app.listen(port, () => {
//     console.log(`Server running on port ${port}`);
// });




// CREATE TABLE users (
//     id INT AUTO_INCREMENT PRIMARY KEY,
//     username VARCHAR(255) NOT NULL,
//     email VARCHAR(255) UNIQUE NOT NULL,
//     password VARCHAR(255) NOT NULL,
//     createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
// );
