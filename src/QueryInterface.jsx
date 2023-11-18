import React, { useEffect, useState } from "react";
import "./index.css";

const baseUrl = 'https://dyte-backend-deploy.onrender.com'

export default function QueryInterface() {
    const [selectedFilters, setSelectedFilters] = useState([]);
    const [query, setQuery] = useState('');
    const [data, setData] = useState([]);

    const getLogsData = async () => {
        try {
            const response = await fetch(`${baseUrl}/search`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query }),
            });

            if (!response.ok) {
                throw new Error('Error searching logs');
            }

            const resultData = await response.json();
            setData(resultData);
        } catch (error) {
            console.error('Error:', error.message);
        }
    };

    useEffect(() => {
        getLogsData();
    }, []);

    const filters = ["Error", "Info", "Warning"];

    const filteredResults = data.filter(item => {
        const { level, message, resourceId, timestamp, traceId, spanId, commit, metadata } = item;
        const queryLowerCase = query.toLowerCase();

        // Filter by selected categories
        const categoryFilter = selectedFilters.length === 0 || selectedFilters.includes(level.toLowerCase());

        // Filter by search query (case-insensitive)
        const searchFilter = query.trim() === '' ||
            level.toLowerCase().includes(queryLowerCase) ||
            message.toLowerCase().includes(queryLowerCase) ||
            resourceId.toLowerCase().includes(queryLowerCase) ||
            timestamp.toLowerCase().includes(queryLowerCase) ||
            traceId.toLowerCase().includes(queryLowerCase) ||
            spanId.toLowerCase().includes(queryLowerCase) ||
            commit.toLowerCase().includes(queryLowerCase) ||
            metadata.parentResourceId.toLowerCase().includes(queryLowerCase);

        return categoryFilter && searchFilter;
    });

    return (
        <div>
            <div className="buttons-container">
                {filters.map((category, idx) => (
                    <button
                        onClick={() => setQuery(category)}
                        className={`button ${selectedFilters.includes(category.toLowerCase()) ? "active" : ""}`}
                        key={`filters-${idx}`}
                    >
                        {category}
                    </button>
                ))}
            </div>
            <div className="items-container">
            <input
                type="text"
                placeholder="Enter search query"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />
            <button className="button" disabled={query.length > 0 ? false : true} onClick={getLogsData}>Search</button>
            </div>
            
            <div className="items-container">
                {filteredResults.map((item, idx) => (
                    <div key={`items-${idx}`} className="item">
                        <p>Level: {item.level}</p>
                        <p className="category">Message: {item.message}</p>
                        <p className="category">Resource ID: {item.resourceId}</p>
                        <p className="category">Timestamp: {item.timestamp}</p>
                        <p className="category">Trace Id: {item.traceId}</p>
                        <p className="category">Commit: {item.commit}</p>
                        <p className="category">Metadata (parentResourceId): {item.metadata.parentResourceId}</p>

                    </div>
                ))}
            </div>
        </div>
    );
};

