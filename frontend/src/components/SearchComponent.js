import algoliasearch from "algoliasearch/lite";
import { InstantSearch, SearchBox, Hits } from "react-instantsearch";
import { useEffect, useState, useContext } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

const SearchComponent = ({ searchingObject }) => {
  let baseURL = "http://127.0.0.1:8000/";
  const [algoliaAPIKeys, setAlgoliaAPIKeys] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [searchClient, setSearchClient] = useState({});
  //ustawic dynamiczny indeks bazujacy na propsach

  const getAlgoliaAPIKeys = async () => {
    let response = await fetch(baseURL + "search/public/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    let data = await response.json();
    if (response.status === 200) {
      console.log(data.data);
      setAlgoliaAPIKeys({ ...data.data });
      setSearchClient(
        algoliasearch(data.data.APPLICATION_ID, data.data.PUBLIC_API_KEY)
      );
      setLoaded(true);
      console.log("searchClient", searchClient);
    } else {
      alert("Something went wrong with getting Algolia API Keys!");
    }
  };
  useEffect(() => {
    console.log(searchingObject);
    getAlgoliaAPIKeys();
  }, []);

  return (
    <div>
      <p>Search</p>
      <p>{searchingObject.index}</p>
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
