// import React, { useState } from 'react';




// import axios from 'axios';
// import './PdfLinks.css';

// const PdfLinks = () => {
//     const [file, setFile] = useState(null);
//     const [links, setLinks] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState(null);

//     const handleFileChange = (event) => {
//         setFile(event.target.files[0]);
//         setError(null);
//     };

//     const handleFileUpload = async () => {
//         if (!file) {
//             setError("Please select a file first.");
//             return;
//         }

//         setLoading(true);
//         setError(null);

//         const formData = new FormData();
//         formData.append("pdf", file);

//         try {
//             const response = await axios.post('http://localhost:5000/upload', formData, {
//                 headers: { 'Content-Type': 'multipart/form-data' },
//             });
//             setLinks(response.data.links);
//         } catch (error) {
//             console.error("File upload failed:", error);
//             setError(error.response?.data?.error || "Failed to upload and process the file");
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="upload-container">
//             <h2>Upload PDF to Extract Links</h2>
            
//             <div className="file-input-wrapper">
//                 <input 
//                     type="file" 
//                     accept=".pdf"
//                     onChange={handleFileChange}
//                     className="file-input"
//                 />
//             </div>

//             <button 
//                 onClick={handleFileUpload}
//                 disabled={loading || !file}
//                 className="upload-button"
//             >
//                 {loading ? "Processing..." : "Upload and Extract Links"}
//             </button>

//             {loading && (
//                 <div className="loading-indicator">
//                     <span className="loading">Processing your PDF...</span>
//                 </div>
//             )}

//             {error && (
//                 <div className="error-message">
//                     {error}
//                 </div>
//             )}

//             {links.length > 0 && (
//                 <div className="links-container">
//                     <h3>Extracted Links:</h3>
//                     <ul className="links-list">
//                         {links.map((link, index) => (
//                             <li key={index} className="link-item">
//                                 <a 
//                                     href={link} 
//                                     target="_blank" 
//                                     rel="noopener noreferrer"
//                                 >
//                                     {link}
//                                 </a>
//                             </li>
//                         ))}
//                     </ul>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default PdfLinks;





import React, { useState } from 'react';
import axios from 'axios';
import './PdfLinks.css'; // Import CSS for styling

const PdfLinks = () => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setError('');
    
    try {
      const result = await axios.post('http://localhost:5000/api/search', { userQuery: query });
      setResponse(result.data.response);
    } catch (err) {
      setError('Error fetching response. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="search-container">
      <h1>Fast Language Model Search</h1>
      <div className="search-box">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Type your query here"
          className="search-input"
        />
        <button onClick={handleSearch} className="search-button">
          Search
        </button>
      </div>
      
      {loading && <p className="loading">Loading...</p>}
      
      {response && <div className="response-box"><strong>Response:</strong><p>{response}</p></div>}
      
      {error && <div className="error-box">{error}</div>}
    </div>
  );
};

export default PdfLinks;
