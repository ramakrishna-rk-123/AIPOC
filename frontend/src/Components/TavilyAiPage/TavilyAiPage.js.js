import React, { useState } from 'react';
import './TavilyAiPage.css';

const TavilyAiPage = () => {
  const [query, setQuery] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(query===""){
        return alert("Please Enter query")
    }
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5000/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query,
          searchType: 'basic'
        })
      });

      const data = await response.json();
      setAiResponse(data.answer);
    } catch (error) {
      console.error('Error:', error);
      setAiResponse('Sorry, there was an error processing your request.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="querybot-container">
      <h1 className="querybot-title">
        VOLTUS QUERYBOT
        <span className="querybot-subtitle">(WEB SEARCH)</span>
      </h1>

      <form onSubmit={handleSubmit} className="querybot-form">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter your query"
          className="querybot-input"
        />

        <div className="querybot-button-container">
          <button
            type="submit"
            disabled={isLoading}
            className="querybot-button"
          >
            {isLoading ? 'Searching...' : 'Submit'}
          </button>
          {isLoading && <div className="querybot-spinner"></div>}
        </div>
      </form>

      {(query || aiResponse) && (
        <div className="querybot-results">
          <div className="querybot-section">
            <h2 className="querybot-section-title">Your Query:</h2>
            <p className="querybot-text">{query}</p>
          </div>

          <div className="querybot-section">
            <h2 className="querybot-section-title">AI Response:</h2>
            <p className="querybot-text">{aiResponse}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TavilyAiPage;
