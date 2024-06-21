import * as PREDICTION_TYPES from './prediction.actionTypes';

import { showError } from 'store/message';
import { PREDICTION_STATUS } from 'configs';
import predictionApi from 'services/PredictionApi';
import { addLoading, removeLoading } from 'store/loading';

/**
 * Interrupt prediction
 *
 * @param {string} projectId Project Id
 * @param {string} deploymentId Deployment Id
 * @returns {Function} Dispatch function
 */
export const interruptPrediction = (projectId, deploymentId) => ({
  type: PREDICTION_TYPES.INTERRUPT_PREDICTION,
  payload: {
    projectId,
    deploymentId,
  },
});

/**
 * Delete prediction result
 *
 * @param {string} projectId Project Id
 * @param {string} deploymentId Deployment Id
 * @returns {Function} Dispatch function
 */
export const deletePredictionResult = (projectId, deploymentId) => ({
  type: PREDICTION_TYPES.DELETE_PREDICTION_RESULT,
  payload: {
    projectId,
    deploymentId,
  },
});

/**
 * Create a prediction using a dataset id
 *
 * @param {string} projectId Project Id
 * @param {string} deploymentId Deployment Id
 * @param {string} dataset Dataset file name
 * @returns {Function} Dispatch function
 */
export const createPredictionWithDataset =
  (projectId, deploymentId, dataset) => async (dispatch) => {
    try {
      dispatch(
        addLoading(PREDICTION_TYPES.CREATE_PREDICTION_WITH_DATASET_REQUEST)
      );

      dispatch(deletePredictionResult(projectId, deploymentId));

      const response = await predictionApi.createPredictionWithDataset(
        projectId,
        deploymentId,
        dataset
      );

      const predictionId = response.data?.uuid;
      const status = response.data?.status;

      dispatch({
        type: PREDICTION_TYPES.CREATE_PREDICTION_WITH_DATASET_SUCCESS,
        payload: {
          projectId,
          deploymentId,
          predictionId,
          dataset,
          status,
        },
      });
    } catch (e) {
      dispatch({ type: PREDICTION_TYPES.CREATE_PREDICTION_WITH_DATASET_FAIL });
      dispatch(showError(e.response?.data?.message || e.message));
    } finally {
      dispatch(
        removeLoading(PREDICTION_TYPES.CREATE_PREDICTION_WITH_DATASET_REQUEST)
      );
    }
  };

/**
 * Function to fetch predictions
 *
 * @param {string} projectId Project Id
 * @param {string} deploymentId Deployment Id
 * @param {string} predictionId Prediction Id
 * @returns {Function} Dispatch function
 */
export const fetchPredictionRequest =
  (projectId, deploymentId, predictionId) => async (dispatch) => {
    try {
      dispatch(addLoading(PREDICTION_TYPES.FETCH_PREDICTION_REQUEST));

      const response = await predictionApi.fetchPrediction(
        projectId,
        deploymentId,
        predictionId
      );

      const status = response.data?.status;

      const didPredictionFinished = [
        PREDICTION_STATUS.DONE,
        PREDICTION_STATUS.FAILED,
      ].includes(status);

      if (didPredictionFinished) {
        const responseBody = response.data?.response_body;

        let predictionData = null;
        try {
          predictionData = JSON.parse(responseBody).data;
        } catch (e) {
          predictionData = null;
        }

        dispatch({
          type: PREDICTION_TYPES.FETCH_PREDICTION_SUCCESS,
          payload: {
            status,
            projectId,
            deploymentId,
            predictionId,
            predictionData,
          },
        });

        // Remove the prediction from the running predictions
        dispatch(interruptPrediction(projectId, deploymentId));
      }
    } catch (e) {
      dispatch({ type: PREDICTION_TYPES.FETCH_PREDICTION_FAIL });
    } finally {
      dispatch(removeLoading(PREDICTION_TYPES.FETCH_PREDICTION_REQUEST));
    }
  };
