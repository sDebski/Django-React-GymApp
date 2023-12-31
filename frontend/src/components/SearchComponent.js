import algoliasearch from "algoliasearch/lite";
import { InstantSearch, SearchBox, Hits } from "react-instantsearch";
import { useEffect, useState } from "react";
import List from "@mui/material/List";

const SearchComponent = ({ searchingObject }) => {
  let baseURL = "http://127.0.0.1:8000/api/";
  const [loaded, setLoaded] = useState(false);
  const [searchClient, setSearchClient] = useState({});

  const getAlgoliaAPIKeys = async () => {
    let response = await fetch(baseURL + "search/public/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    let data = await response.json();
    if (response.status === 200) {
      setSearchClient(
        algoliasearch(data.data.APPLICATION_ID, data.data.PUBLIC_API_KEY)
      );
      setLoaded(true);
    } else {
      alert("Something went wrong with getting Algolia API Keys!");
    }
  };

  useEffect(() => {
    getAlgoliaAPIKeys();
  }, []);

  return (
    <div>
      <p>Search at index: {searchingObject.index}</p>
      {loaded && (
        <InstantSearch
          searchClient={searchClient}
          indexName={searchingObject.index}
        >
          <SearchBox />
          <List>
            <Hits hitComponent={searchingObject.hitComponent} />
          </List>
        </InstantSearch>
      )}
    </div>
  );
};

export default SearchComponent;
