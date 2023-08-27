import algoliasearch from "algoliasearch/lite";
import { InstantSearch, SearchBox, Hits } from "react-instantsearch";
import { useEffect, useState, useContext } from "react";
import HitComponent from "./HitComponent";

const SearchComponent = (SearchingObject) => {
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
    getAlgoliaAPIKeys();
  }, []);

  return (
    <div>
      <p>Search</p>
      {loaded && (
        <InstantSearch searchClient={searchClient} indexName="skwde_Exercise">
          <SearchBox />
          <Hits hitComponent={HitComponent} />
        </InstantSearch>
      )}
    </div>
  );
};

export default SearchComponent;
