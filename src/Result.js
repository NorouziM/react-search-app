import React, { useEffect, useState } from "react";
import Highlighter from "react-highlight-words";

const Result = ({ results, searchTerm }) => {
  const [searchedWords, setSearchedWords] = useState();

  useEffect(() => {
    setSearchedWords(searchTerm?.split(" "));
  }, [searchTerm]);

  return results.map((result) => (
    <section className="result-box-wrapper">
      <div className="result-box-authors">
        <span>Authors: </span>
        <Highlighter
          searchWords={cleanArray(searchedWords || [])}
          autoEscape={true}
          textToHighlight={result.authors.raw}
        />
      </div>
      <div className="result-box-header">
        <Highlighter
          searchWords={cleanArray(searchedWords || [])}
          autoEscape={true}
          textToHighlight={result.title.raw}
        />
      </div>
      <div className="result-box-body">
        <Highlighter
          searchWords={cleanArray(searchedWords || [])}
          autoEscape={true}
          textToHighlight={shortenParagraph(result.abstract.raw, 550)}
        />
      </div>
      <div className="result-box-footer">
        <p>
          <span>Publish date: </span>
          {result.publish_time.raw}
        </p>
        <a target="_blank" href={result.url.raw.split(";")[1]} rel="noreferrer">
          <button className="result-box-btn">Read more</button>
        </a>
      </div>
    </section>
  ));
};

const shortenParagraph = (str, charLimit) => {
  return str.length > charLimit ? str.slice(0, charLimit) + "..." : str;
};

const cleanArray = (array) =>
  array.map((item) => item.trim()).filter((item) => item !== "");

export default Result;
