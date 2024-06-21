export const getRunningPrediction =
  (projectId, deploymentId) =>
  ({ predictionReducer }) => {
    const predictionKey = `${projectId}/${deploymentId}`;
    return predictionReducer.running[predictionKey];
  };

export const getPredictionResult =
  (projectId, deploymentId) =>
  ({ predictionReducer }) => {
    const predictionKey = `${projectId}/${deploymentId}`;
    return predictionReducer.results[predictionKey];
  };
