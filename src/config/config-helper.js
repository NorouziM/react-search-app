import config from "../config/engine.json";

export function getConfig() {
  if (process.env.NODE_ENV === "test") {
    return {};
  }

  if (config.engineName) return config;

  if (
    typeof window !== "undefined" &&
    window.appConfig &&
    window.appConfig.engineName
  ) {
    return window.appConfig;
  }

  return {};
}

function toLowerCase(string) {
  if (string) return string.toLowerCase();
}

export function getTitleField() {
  return getConfig().titleField || "title";
}

export function getUrlField() {
  return getConfig().urlField;
}

export function getFacetFields() {
  return getConfig().facets || [];
}

export function getSortFields() {
  return getConfig().sortFields || [];
}

export function getResultTitle(result) {
  const titleField = getTitleField();

  return result.getSnippet(titleField);
}

export function stripUnnecessaryResultFields(resultFields) {
  return Object.keys(resultFields).reduce((acc, n) => {
    if (
      [
        "_meta",
        "id",
        toLowerCase(getTitleField()),
        toLowerCase(getUrlField()),
      ].includes(toLowerCase(n))
    ) {
      return acc;
    }

    acc[n] = resultFields[n];
    return acc;
  }, {});
}

export function buildSearchOptionsFromConfig() {
  const config = getConfig();
  const searchFields = (config.searchFields || config.fields || []).reduce(
    (acc, n) => {
      acc = acc || {};
      acc[n] = {};
      return acc;
    },
    undefined
  );

  const resultFields = (config.resultFields || config.fields || []).reduce(
    (acc, n) => {
      acc = acc || {};
      acc[n] = {
        raw: {},
        snippet: {
          size: 100,
          fallback: true,
        },
      };
      return acc;
    },
    undefined
  );

  if (config.urlField) {
    resultFields[config.urlField] = {
      raw: {},
      snippet: {
        size: 100,
        fallback: true,
      },
    };
  }

  if (config.titleField) {
    resultFields[config.titleField] = {
      raw: {},
      snippet: {
        size: 100,
        fallback: true,
      },
    };
  }

  const searchOptions = {};
  searchOptions.result_fields = resultFields;
  searchOptions.search_fields = searchFields;
  return searchOptions;
}

export function buildFacetConfigFromConfig() {
  const config = getConfig();

  const facets = (config.facets || []).reduce((acc, n) => {
    acc = acc || {};
    acc[n] = {
      type: "value",
      size: 100,
    };
    return acc;
  }, undefined);

  return facets;
}

export function buildAutocompleteQueryConfig() {
  const querySuggestFields = getConfig().querySuggestFields;
  if (
    !querySuggestFields ||
    !Array.isArray(querySuggestFields) ||
    querySuggestFields.length === 0
  ) {
    return {};
  }

  return {
    suggestions: {
      types: {
        documents: {
          fields: getConfig().querySuggestFields,
        },
      },
    },
  };
}
