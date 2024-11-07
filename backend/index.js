const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// Create the 'document', 'pdf', and 'images' folders if they don't exist
const documentFolder = path.join(__dirname, './documents');
const pdfFolder = path.join(__dirname, './pdf');
const imageFolder = path.join(__dirname, './images');

if (!fs.existsSync(documentFolder)) {
  fs.mkdirSync(documentFolder);
}
if (!fs.existsSync(pdfFolder)) {
  fs.mkdirSync(pdfFolder);
}
if (!fs.existsSync(imageFolder)) {
  fs.mkdirSync(imageFolder);
}

// Set up multer for DOCX file uploads (to be stored as 'document.docx')
const docxStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, documentFolder); // Save to 'document' folder
  },
  filename: (req, file, cb) => {
    cb(null, 'document.docx'); // Force the file to be saved as 'document.docx'
  },
});

// Set up multer for PDF file uploads (to be stored as 'same.pdf')
const pdfStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, pdfFolder); // Save to 'pdf' folder
  },
  filename: (req, file, cb) => {
    cb(null, 'same.pdf'); // Force the file to be saved as 'same.pdf'
  },
});

// Set up multer for Image file uploads (to be stored as 'image.jpg')
const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, imageFolder); // Save to 'images' folder
  },
  filename: (req, file, cb) => {
    cb(null, 'image.jpg'); // Force the file to be saved as 'image.jpg'
  },
});

// Only allow DOCX files for DOCX upload
const docxFileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    cb(null, true);
  } else {
    cb(new Error('Only DOCX files are allowed'), false);
  }
};

// Only allow PDF files for PDF upload
const pdfFileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed'), false);
  }
};

// Only allow JPG files for Image upload
const imageFileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg') {
    cb(null, true);
  } else {
    cb(new Error('Only JPG images are allowed'), false);
  }
};

// Initialize the upload middlewares
const uploadDocx = multer({ storage: docxStorage, fileFilter: docxFileFilter });
const uploadPdf = multer({ storage: pdfStorage, fileFilter: pdfFileFilter });
const uploadImage = multer({ storage: imageStorage, fileFilter: imageFileFilter });

// Route to handle PDF file upload (always saved as 'same.pdf')
app.post('/upload-pdf', uploadPdf.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded');
  }
  res.send('PDF file uploaded and saved as same.pdf successfully');
});

// Route to handle Image file upload (always saved as 'image.jpg')
app.post('/upload-image', uploadImage.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded');
  }
  res.send('Image file uploaded and saved as image.jpg successfully');
});

// Route to handle DOCX file upload (always saved as 'document.docx')
app.post('/upload-docx', uploadDocx.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No DOCX file uploaded');
  }
  res.send('DOCX file uploaded and saved as document.docx successfully');
});





const audioStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      const audioFolder = path.join(__dirname, './audios'); // Audio folder path
      if (!fs.existsSync(audioFolder)) {
        fs.mkdirSync(audioFolder); // Create audios folder if not exists
      }
      cb(null, audioFolder);
    },
    filename: (req, file, cb) => {
      // Force the file to be saved as 'audio.mp3' or 'audio.wav'
      if (file.mimetype === 'audio/mpeg') {
        cb(null, 'audio.mp3');
      } else if (file.mimetype === 'audio/wav') {
        cb(null, 'audio.wav');
      } else {
        console.error('Unsupported file type:', file.mimetype); // Log MIME type for debugging
        cb(new Error('Invalid audio file type'), false);
      }
    },
  });
  
  // Filter to ensure only audio files are uploaded (mp3 or wav)
  const audioFileFilter = (req, file, cb) => {
    console.log('File MIME type:', file.mimetype); // Log MIME type for debugging
    if (file.mimetype === 'audio/mpeg' || file.mimetype === 'audio/wav') {
      cb(null, true);
    } else {
      cb(new Error('Only MP3 and WAV audio files are allowed'), false);
    }
  };
  
  // Initialize the multer upload for audio files
  const uploadAudio = multer({ storage: audioStorage, fileFilter: audioFileFilter });
  
  // Route to handle audio file upload (always saved as 'audio.mp3' or 'audio.wav')
  app.post('/upload-audio', uploadAudio.single('file'), (req, res) => {
    if (!req.file) {
      return res.status(400).send('No file uploaded');
    }
    res.send(`Audio file uploaded and saved as ${req.file.filename} successfully`);
  });
  


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
