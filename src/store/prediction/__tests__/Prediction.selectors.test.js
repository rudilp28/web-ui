import { PREDICTION_STATUS } from 'configs';

import {
  getPredictionResult,
  getRunningPrediction,
} from '../prediction.selectors';

describe('Prediction Selectors', () => {
  const projectId = 'projectId';
  const deploymentId = 'deploymentId';
  const predictionKey = `${projectId}/${deploymentId}`;

  const predictionId = 'predictionId';

  const runningPrediction = {
    status: PREDICTION_STATUS.STARTED,
    dataset: 'dataset',
    predictionId,
  };

  const predictionResult = {
    status: PREDICTION_STATUS.DONE,
    predictionData: {},
    predictionId,
  };

  const predictionReducer = {
    running: {
      [predictionKey]: runningPrediction,
    },
    results: {
      [predictionKey]: predictionResult,
    },
  };

  it('should return the running prediction for the given project and deployment id', () => {
    const selector = getRunningPrediction(projectId, deploymentId);
    expect(selector({ predictionReducer })).toEqual(runningPrediction);
  });

  it('should return the prediction results for the given project and deployment id', () => {
    const selector = getPredictionResult(projectId, deploymentId);
    expect(selector({ predictionReducer })).toEqual(predictionResult);
  });
});
