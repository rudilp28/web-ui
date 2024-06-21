import { PREDICTION_STATUS } from 'configs';

import * as PREDICTION_TYPES from '../prediction.actionTypes';
import { predictionReducer, initialState } from '../prediction.reducer';

describe('Prediction Reducer', () => {
  const projectId = 'projectId';
  const deploymentId = 'deploymentId';
  const predictionId = 'predictionId';
  const predictionKey = `${projectId}/${deploymentId}`;

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

  const stateWithData = {
    results: {
      'abc/123': {},
    },
    running: {
      'abc/123': {},
    },
  };

  it('should add a running prediction to the state', () => {
    const action = {
      type: PREDICTION_TYPES.CREATE_PREDICTION_WITH_DATASET_SUCCESS,
      payload: {
        projectId,
        deploymentId,
        predictionId,
        dataset: 'dataset',
        status: PREDICTION_STATUS.STARTED,
      },
    };

    const newState = predictionReducer(stateWithData, action);

    expect(newState).toEqual({
      ...stateWithData,
      running: {
        ...stateWithData.running,
        [predictionKey]: runningPrediction,
      },
    });
  });

  it('should add a prediction result to the state', () => {
    const action = {
      type: PREDICTION_TYPES.FETCH_PREDICTION_SUCCESS,
      payload: {
        projectId,
        deploymentId,
        predictionId,
        predictionData: {},
        status: PREDICTION_STATUS.DONE,
      },
    };

    const newState = predictionReducer(stateWithData, action);

    expect(newState).toEqual({
      ...stateWithData,
      results: {
        ...stateWithData.results,
        [predictionKey]: predictionResult,
      },
    });
  });

  it('should interrupt a running prediction', () => {
    const action = {
      type: PREDICTION_TYPES.INTERRUPT_PREDICTION,
      payload: {
        projectId,
        deploymentId,
      },
    };

    const newState = predictionReducer(
      { ...initialState, running: { [predictionKey]: runningPrediction } },
      action
    );

    expect(newState).toEqual(initialState);
  });

  it('should delete a prediction result', () => {
    const action = {
      type: PREDICTION_TYPES.DELETE_PREDICTION_RESULT,
      payload: {
        projectId,
        deploymentId,
      },
    };

    const newState = predictionReducer(
      { ...initialState, results: { [predictionKey]: predictionResult } },
      action
    );

    expect(newState).toEqual(initialState);
  });

  it('should keep the state as it is', () => {
    const action = { type: 'UNKNOWN' };
    const newState = predictionReducer(initialState, action);
    expect(newState).toEqual(initialState);
  });
});
