import React, { useState } from "react";
import Navbar from "./nav";

const SearchBox = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    // const results = strings.filter((str) => str.substring(searchTerm));
    const results = strings.filter((str) =>
        str.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setSearchResults(results);
  };

  return (
    <div>
      <>
        <Navbar />
      </>
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={handleSearch}
      />
      <ul>
        {searchResults.map((result, index) => (
          <li key={index}>{result}</li>
        ))}
      </ul>
    </div>
  );
};

const strings = ["apple", "aaaa","banana", "cherry", "date", "elderberry"];

export default SearchBox;
