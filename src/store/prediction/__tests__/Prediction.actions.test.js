import thunk from 'redux-thunk';
import MockAdapter from 'axios-mock-adapter';
import configureStore from 'redux-mock-store';

import { PREDICTION_STATUS } from 'configs';
import predictionApi from 'services/PredictionApi';
import { ADD_LOADING, REMOVE_LOADING } from 'store/loading';

import {
  interruptPrediction,
  deletePredictionResult,
  fetchPredictionRequest,
  createPredictionWithDataset,
} from '../prediction.actions';
import * as PREDICTION_TYPES from '../prediction.actionTypes';

describe('Prediction Actions', () => {
  const mockStore = configureStore([thunk]);
  const store = mockStore({});

  const predictionMockAxios = new MockAdapter(predictionApi.axiosInstance);

  beforeEach(() => {
    store.clearActions();
    predictionMockAxios.reset();
  });

  const fakePredictionInProgress = {
    uuid: 'predictionId',
    status: PREDICTION_STATUS.STARTED,
    deployment_id: 'deploymentId',
  };

  const requestBody = {
    data: {
      ndarray: [[1, 2]],
      names: ['a', 'b'],
    },
  };

  const responseBody = {
    data: {
      ndarray: [[1, 2, 3]],
      names: ['a', 'b', 'c'],
    },
  };

  const fakePredictionDone = {
    uuid: 'predictionId',
    status: PREDICTION_STATUS.DONE,
    deployment_id: 'deploymentId',
    request_body: JSON.stringify(requestBody),
    response_body: JSON.stringify(responseBody),
  };

  it('should create a new prediction', async () => {
    predictionMockAxios.onPost().reply(200, fakePredictionInProgress);

    await store.dispatch(
      createPredictionWithDataset('projectId', 'deploymentId', 'dataset')
    );

    const actions = store.getActions();

    expect(actions).toEqual([
      {
        type: ADD_LOADING,
        payload: {
          [PREDICTION_TYPES.CREATE_PREDICTION_WITH_DATASET_REQUEST]: true,
        },
      },
      {
        type: PREDICTION_TYPES.DELETE_PREDICTION_RESULT,
        payload: {
          projectId: 'projectId',
          deploymentId: 'deploymentId',
        },
      },
      {
        type: PREDICTION_TYPES.CREATE_PREDICTION_WITH_DATASET_SUCCESS,
        payload: {
          dataset: 'dataset',
          projectId: 'projectId',
          deploymentId: 'deploymentId',
          predictionId: 'predictionId',
          status: PREDICTION_STATUS.STARTED,
        },
      },
      {
        type: REMOVE_LOADING,
        payload: [PREDICTION_TYPES.CREATE_PREDICTION_WITH_DATASET_REQUEST],
      },
    ]);
  });

  it('should handle errors in create prediction async action', async () => {
    predictionMockAxios.onPost().reply(500, { message: 'error message' });

    await store.dispatch(
      createPredictionWithDataset('projectId', 'deploymentId', 'dataset')
    );

    const actions = store.getActions();

    expect(actions).toEqual(
      expect.arrayContaining([
        {
          type: ADD_LOADING,
          payload: {
            [PREDICTION_TYPES.CREATE_PREDICTION_WITH_DATASET_REQUEST]: true,
          },
        },
        {
          type: PREDICTION_TYPES.CREATE_PREDICTION_WITH_DATASET_FAIL,
        },
        {
          type: REMOVE_LOADING,
          payload: [PREDICTION_TYPES.CREATE_PREDICTION_WITH_DATASET_REQUEST],
        },
      ])
    );
  });

  it('should fetch a prediction', async () => {
    predictionMockAxios.onGet().reply(200, fakePredictionDone);

    await store.dispatch(
      fetchPredictionRequest('projectId', 'deploymentId', 'predictionId')
    );
    const actions = store.getActions();

    expect(actions).toEqual([
      {
        type: ADD_LOADING,
        payload: {
          [PREDICTION_TYPES.FETCH_PREDICTION_REQUEST]: true,
        },
      },
      {
        type: PREDICTION_TYPES.FETCH_PREDICTION_SUCCESS,
        payload: {
          projectId: 'projectId',
          deploymentId: 'deploymentId',
          predictionId: 'predictionId',
          status: PREDICTION_STATUS.DONE,
          predictionData: responseBody.data,
        },
      },
      {
        type: PREDICTION_TYPES.INTERRUPT_PREDICTION,
        payload: {
          projectId: 'projectId',
          deploymentId: 'deploymentId',
        },
      },
      {
        type: REMOVE_LOADING,
        payload: [PREDICTION_TYPES.FETCH_PREDICTION_REQUEST],
      },
    ]);
  });

  it('should handle errors when is fetching a prediction', async () => {
    predictionMockAxios.onGet().reply(500, { message: 'error message' });

    await store.dispatch(
      fetchPredictionRequest('projectId', 'deploymentId', 'predictionId')
    );

    const actions = store.getActions();

    expect(actions).toEqual(
      expect.arrayContaining([
        {
          type: ADD_LOADING,
          payload: {
            [PREDICTION_TYPES.FETCH_PREDICTION_REQUEST]: true,
          },
        },
        {
          type: PREDICTION_TYPES.FETCH_PREDICTION_FAIL,
        },
        {
          type: REMOVE_LOADING,
          payload: [PREDICTION_TYPES.FETCH_PREDICTION_REQUEST],
        },
      ])
    );
  });

  it('should create the interrupt prediction action', async () => {
    expect(interruptPrediction('projectId', 'deploymentId')).toEqual({
      type: PREDICTION_TYPES.INTERRUPT_PREDICTION,
      payload: {
        projectId: 'projectId',
        deploymentId: 'deploymentId',
      },
    });
  });

  it('should create the delete prediction result action', async () => {
    expect(deletePredictionResult('projectId', 'deploymentId')).toEqual({
      type: PREDICTION_TYPES.DELETE_PREDICTION_RESULT,
      payload: {
        projectId: 'projectId',
        deploymentId: 'deploymentId',
      },
    });
  });
});
