import React from "react";

import AppSearchAPIConnector from "@elastic/search-ui-app-search-connector";

import Result from "./Result";

import { BrowserRouter as Router} from "react-router-dom";

import "@elastic/react-search-ui-views/lib/styles/styles.css";

import "./App.css";

import LoadingOverlay from "react-loading-overlay";

import {
  ErrorBoundary,
  SearchProvider,
  SearchBox,
  PagingInfo,
  ResultsPerPage,
  Paging,
  WithSearch,
} from "@elastic/react-search-ui";
import { Layout } from "@elastic/react-search-ui-views";

import {
  buildAutocompleteQueryConfig,
  buildFacetConfigFromConfig,
  buildSearchOptionsFromConfig,
  getConfig,
} from "./config/config-helper";

const { hostIdentifier, searchKey, endpointBase, engineName } = getConfig();
const connector = new AppSearchAPIConnector({
  searchKey,
  engineName,
  hostIdentifier,
  endpointBase,
});
const config = {
  searchQuery: {
    facets: buildFacetConfigFromConfig(),
    ...buildSearchOptionsFromConfig(),
  },
  autocompleteQuery: buildAutocompleteQueryConfig(),
  apiConnector: connector,
  alwaysSearchOnInitialLoad: true,
};

export default function App() {
  const params = new URLSearchParams(window.location.search);
  const searchedWord = params?.get("q")?.trim();

  return (
    <Router>
    <SearchProvider config={config}>
      <WithSearch
        mapContextToProps={({ results, isLoading,searchTerm }) => ({
          results,
          isLoading,
          searchTerm
        })}
      >
        {({ results, isLoading,searchTerm }) => {
          return (
            <div className="App">
              <ErrorBoundary>
                <LoadingOverlay
                  active={isLoading}
                  spinner
                  text="Loading..."
                  styles={{
                    overlay: (base) => ({
                      ...base,
                      background: "rgba(45,55,72,0.45)",
                    }),
                    wrapper: {
                      width: "100%",
                      height: "100vh",
                    },
                  }}
                >
                  <Layout
                    header={<SearchBox autocompleteSuggestions={true} />}
                    bodyContent={<Result searchTerm={searchTerm} results={results} />}
                    bodyHeader={
                      <>
                        {!!searchedWord && <PagingInfo />}
                        {!!searchedWord && <ResultsPerPage />}
                      </>
                    }
                    bodyFooter={<Paging />}
                  />
                </LoadingOverlay>
              </ErrorBoundary>
            </div>
          );
        }}
      </WithSearch>
    </SearchProvider>
    </Router>
  );
}
