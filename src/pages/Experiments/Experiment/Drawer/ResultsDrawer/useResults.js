import { useState, useMemo, useEffect, useCallback } from 'react';

import { DATASETS_KEY, PARAMETERS_KEY } from './constants';

const useResults = (figures) => {
  const [showingResults, setShowingResults] = useState([]);

  const availableResults = useMemo(() => {
    const datasetsResult = { id: DATASETS_KEY, title: 'Datasets' };
    const parametersResult = { id: PARAMETERS_KEY, title: 'Parâmetros' };

    if (!figures) return [datasetsResult, parametersResult];

    const results = figures.map((_, index) => ({
      id: `${index}`,
      title: `Resultado ${index + 1}`,
    }));

    results.push(datasetsResult, parametersResult);

    return results;
  }, [figures]);

  const handleRemoveResult = useCallback((id) => {
    setShowingResults((currentResults) => {
      return currentResults.filter((result) => result.id !== id);
    });
  }, []);

  const handleAddResult = useCallback(() => {
    setShowingResults((currentResults) => {
      const currentResultsClone = [...currentResults];
      currentResultsClone.push({ id: `${currentResultsClone.length}` });
      return currentResultsClone;
    });
  }, []);

  const handleSelectResult = useCallback((id, selectedResult) => {
    setShowingResults((currentResults) => {
      const currentResultsClone = [...currentResults];

      const indexToUpdate = currentResultsClone.findIndex(
        (res) => res.id === id
      );

      const result = currentResultsClone[indexToUpdate];
      result.selectedResult = selectedResult;
      currentResultsClone.splice(indexToUpdate, 1, result);

      return currentResultsClone;
    });
  }, []);

  useEffect(() => {
    if (figures?.length) {
      const results = figures.map((_, index) => ({
        id: `${index}`,
        selectedResult: `${index}`,
      }));

      results.push({ id: `${results.length}`, selectedResult: DATASETS_KEY });
      results.push({ id: `${results.length}`, selectedResult: PARAMETERS_KEY });

      setShowingResults(results);
    } else {
      setShowingResults([
        { id: `0`, selectedResult: DATASETS_KEY },
        { id: `1`, selectedResult: PARAMETERS_KEY },
      ]);
    }
  }, [figures]);

  return {
    showingResults,
    availableResults,
    handleAddResult,
    handleRemoveResult,
    handleSelectResult,
  };
};

export default useResults;
