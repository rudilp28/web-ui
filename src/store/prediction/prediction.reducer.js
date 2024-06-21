import * as PREDICTION_TYPES from './prediction.actionTypes';

export const initialState = {
  results: {},
  running: {},
};

export const predictionReducer = (state = initialState, action = {}) => {
  const { type, payload } = action;

  switch (type) {
    case PREDICTION_TYPES.INTERRUPT_PREDICTION: {
      const predictionKey = `${payload.projectId}/${payload.deploymentId}`;
      const stateClone = { ...state };
      delete stateClone.running[predictionKey];
      return stateClone;
    }

    case PREDICTION_TYPES.DELETE_PREDICTION_RESULT: {
      const predictionKey = `${payload.projectId}/${payload.deploymentId}`;
      const stateClone = { ...state };
      delete stateClone.results[predictionKey];
      return stateClone;
    }

    case PREDICTION_TYPES.CREATE_PREDICTION_WITH_DATASET_SUCCESS: {
      const predictionKey = `${payload.projectId}/${payload.deploymentId}`;
      return {
        ...state,
        running: {
          ...state.running,
          [predictionKey]: {
            status: payload.status,
            dataset: payload.dataset,
            predictionId: payload.predictionId,
          },
        },
      };
    }

    case PREDICTION_TYPES.FETCH_PREDICTION_SUCCESS: {
      const predictionKey = `${payload.projectId}/${payload.deploymentId}`;
      return {
        ...state,
        results: {
          ...state.results,
          [predictionKey]: {
            status: payload.status,
            predictionId: payload.predictionId,
            predictionData: payload.predictionData,
          },
        },
      };
    }

    default:
      return state;
  }
};
