// UI LIBS
import { message } from 'antd';

// ACTION TYPES
import actionTypes from './actionTypes';

// SERVICES
import datasetsApi from 'services/DatasetsApi';

// ACTIONS
import {
  updateExperimentOperatorRequest,
  updateDeploymentOperatorRequest,
} from 'store/operator';
import { clearOperatorsFeatureParametersRequest } from 'store/operators';

// UTILS
import utils from 'utils';
import { isCancel, CancelToken } from 'axios';

import { showWarning } from 'store/message';
import { addLoading, removeLoading } from 'store/loading';

// ACTIONS
// ** FETCH DATASET COLUMNS
/**
 * fetch dataset columns success action
 *
 * @param {object} response Response
 * @returns {object} { type, columns }
 */
const fetchDatasetColumnsSuccess = (response) => (dispatch) => {
  // getting dataset columns from response
  const columns = response.data;

  // dispatching fetch dataset columns success
  dispatch({
    type: actionTypes.FETCH_DATASET_COLUMNS_SUCCESS,
    columns,
  });
};

/**
 * fetch dataset columns fail action
 *
 * @param {object} error Error
 * @returns {object} { type, errorMessage }
 */
const fetchDatasetColumnsFail = (error) => (dispatch) => {
  // getting error message
  const errorMessage = error.message;

  // dispatching fetch dataset columns fail
  dispatch({
    type: actionTypes.FETCH_DATASET_COLUMNS_FAIL,
    errorMessage,
  });

  message.error(errorMessage, 5);
};

/**
 * fetch dataset columns request action
 *
 * @param {string} datasetName Dataset name
 * @returns {Function} Dispatch function
 */
export const fetchDatasetColumnsRequest = (datasetName) => (dispatch) => {
  // dispatching request action
  dispatch({
    type: actionTypes.FETCH_DATASET_COLUMNS_REQUEST,
  });

  // dispatching dataset operator loading data action
  dispatch(addLoading(actionTypes.FETCH_DATASET_COLUMNS_REQUEST));

  if (datasetName) {
    // fetching dataset columns
    datasetsApi
      .listDatasetColumns(datasetName)
      .then((response) => dispatch(fetchDatasetColumnsSuccess(response)))
      .catch((error) => dispatch(fetchDatasetColumnsFail(error)))
      .finally(() => {
        dispatch(removeLoading(actionTypes.FETCH_DATASET_COLUMNS_REQUEST));
      });
  } else {
    dispatch(fetchDatasetColumnsSuccess({ data: [] }));
  }
};

// // // // // // // // // //
/**
 * Cancel dataset upload action
 *
 * @returns {Function} Dispatch function
 */
export const cancelDatasetUpload = () => (dispatch, getState) => {
  const successMessage = 'Dados de entrada removidos';

  // get dataset reducer from store
  const { datasetReducer } = getState();

  // invoke cancel upload
  datasetReducer.cancelToken.cancel();

  // dispatching create dataset cancel
  dispatch({
    type: actionTypes.CREATE_DATASET_CANCEL,
    payload: {
      filename: '',
      progress: 0,
      file: null,
      status: null,
      isUploading: false,
      cancelToken: null,
    },
  });

  // display success message
  message.success(successMessage, 5);
};

/**
 * Dataset upload success action
 *
 * @param {object} dataset Response dataset object
 * @param {string} projectId Current Project id
 * @param {string} experimentId Current Experiment id
 * @param {object} datasetOperator Dataset operator
 * @param {boolean} experimentIsSucceeded Experiment is succeeded
 * @returns {Function} Dispatch function
 */
export const datasetUploadSuccess =
  (dataset, projectId, experimentId, datasetOperator, experimentIsSucceeded) =>
  async (dispatch) => {
    const featuretypes = utils.getFeaturetypes(dataset);

    // TODO: Descomentar para ativar running no operador, porém o clique no operador é bloqueado se estiver running
    /*   const { operatorsReducer } = getState();

  const operators = operatorsReducer.map((operatorItem) =>
    operatorItem.uuid === operator.uuid
      ? { ...operatorItem, status: 'Running' }
      : operatorItem
  );

  // dispatching fetch operators success action
  dispatch({
    type: operatorActionTypes.FETCH_OPERATORS_SUCCESS,
    operators,
  }); */

    // dispatching clear operator feature parameters
    await dispatch(
      clearOperatorsFeatureParametersRequest(projectId, experimentId, dataset)
    );

    // update dataset parameter
    await dispatch(
      updateExperimentOperatorRequest(
        projectId,
        experimentId,
        datasetOperator,
        'dataset',
        dataset.name
      )
    );

    // dispatch action
    dispatch({
      type: actionTypes.CREATE_DATASET_SUCCESS,
      payload: {
        filename: dataset.filename || '',
        name: dataset.name || '',
        columns: dataset.columns || [],
        status: dataset && dataset.name ? 'done' : null,
        featuretypes: featuretypes || '',
        isUploading: false,
        cancelToken: null,
      },
    });

    message.success('Dados de entrada importados', 5);

    if (experimentIsSucceeded) {
      dispatch(
        showWarning(
          'Arquivo atualizado! Algumas tarefas precisam ser reconfiguradas.'
        )
      );
    }
  };

/**
 * Dataset upload success action
 *
 * @param {object} dataset Response dataset object
 * @param {string} projectId Current Project id
 * @param {string} deploymentId Current Deployment id
 * @param {object} datasetOperator Dataset operator
 * @returns {Function} Dispatch function
 */
export const deploymentDatasetUploadSuccess =
  (dataset, projectId, deploymentId, datasetOperator) => (dispatch) => {
    const featuretypes = utils.getFeaturetypes(dataset);

    // update dataset parameter
    dispatch(
      updateDeploymentOperatorRequest(
        projectId,
        deploymentId,
        datasetOperator,
        'dataset',
        dataset.name
      )
    );

    // dispatch action
    dispatch({
      type: actionTypes.CREATE_DATASET_SUCCESS,
      payload: {
        filename: dataset.filename || '',
        name: dataset.name || '',
        columns: dataset.columns || [],
        status: dataset && dataset.name ? 'done' : null,
        featuretypes: featuretypes || '',
        isUploading: false,
        cancelToken: null,
      },
    });

    message.success('Dados de entrada importados', 5);
  };

/**
 * Dataset upload fail action
 *
 * @returns {Function} Dispatch function
 */
export const datasetUploadFail = () => (dispatch) => {
  const errorMessage = 'Ocorreu um erro no processamento do arquivo';

  // dispatching create dataset fail
  dispatch({
    type: actionTypes.CREATE_DATASET_FAIL,
    errorMessage,
  });

  message.error(errorMessage, 5);
};

/**
 * Dataset upload fail action
 *
 * @param {object} uploadProgress Upload progress
 * @returns {Function} Dispatch function
 */
export const updateDatasetUpload = (uploadProgress) => (dispatch) => {
  // get uploaded and total progress
  const { loaded, total } = uploadProgress;

  // calculate percentage
  const progress = Math.floor((loaded / total) * 100);

  // dispatching create dataset fail
  dispatch({
    type: actionTypes.UPDATE_DATASET_UPLOAD,
    progress,
  });
};

/**
 * Start a file upload
 *
 * @param {object} file Dataset file
 * @param {string} projectId Project id
 * @param {string} experimentId Experiment id
 * @param {string} deploymentId Deployment id
 * @returns {Function} Dispatch function
 */
export const startFileDatasetUpload =
  (file, projectId, experimentId, deploymentId) => (dispatch) => {
    // create cancel token
    const cancelToken = CancelToken.source();

    // dispatching request action
    dispatch({
      type: actionTypes.CREATE_DATASET_REQUEST,
      file: file,
      cancelToken: cancelToken,
    });

    // create new form data
    const fileFormData = new FormData();

    // append dataset file
    fileFormData.append('file', file);

    dispatch(
      startDatasetUpload(
        fileFormData,
        cancelToken,
        projectId,
        experimentId,
        deploymentId
      )
    );
  };

/**
 * Start a Google upload
 *
 * @param {object} gfile Google file
 * @param {string} projectId Project id
 * @param {string} experimentId Experiment id
 * @returns {Function} Dispatch function
 */
export const startGoogleDatasetUpload =
  (gfile, projectId, experimentId) => (dispatch) => {
    // create cancel token
    const cancelToken = CancelToken.source();

    // dispatching request action
    dispatch({
      type: actionTypes.CREATE_DATASET_REQUEST,
      file: gfile,
      cancelToken: cancelToken,
    });

    const file = { gfile };

    dispatch(startDatasetUpload(file, cancelToken, projectId, experimentId));
  };

/**
 * Start dataset upload action
 *
 * @param {object} file Dataset file
 * @param {object} cancelToken Cancel request token
 * @param {string} projectId Project id
 * @param {string} experimentId The experiment id
 * @param {string} deploymentId The deployment id
 * @returns {Function} Dispatch function
 */
export const startDatasetUpload =
  (file, cancelToken, projectId, experimentId, deploymentId) =>
  async (dispatch, getState) => {
    // get reducers from store
    const { operatorReducer, operatorsReducer: operators } = getState();

    // save dataset operator
    const datasetOperator = { ...operatorReducer };

    const experimentIsSucceeded = utils.checkExperimentSuccess({ operators });

    // TODO: Descomentar para ativar running no operador, porém o clique no operador é bloqueado se estiver running
    /* 
  const {
    operatorsReducer,
  } = getState();
  const operators = operatorsReducer.map((operatorItem) =>
    operatorItem.uuid === datasetOperator.uuid
      ? { ...operatorItem, status: 'Running' }
      : operatorItem
  );

  // dispatching fetch operators success action
  dispatch({
    type: operatorActionTypes.FETCH_OPERATORS_SUCCESS,
    operators,
  }); */

    // upload file block
    try {
      dispatch(addLoading(actionTypes.CREATE_DATASET_REQUEST));

      // call api
      const response = await datasetsApi.createDataset(
        file,
        cancelToken,
        (progress) => dispatch(updateDatasetUpload(progress))
      );

      // get dataset from response
      const dataset = response.data;

      if (experimentId) {
        // dispatch success action
        dispatch(
          datasetUploadSuccess(
            dataset,
            projectId,
            experimentId,
            datasetOperator,
            experimentIsSucceeded
          )
        );
      } else {
        dispatch(
          deploymentDatasetUploadSuccess(
            dataset,
            projectId,
            deploymentId,
            datasetOperator
          )
        );
      }

      // on error
    } catch (error) {
      // error not is cancel action
      if (!isCancel(error)) {
        // dispatch fail action
        dispatch(datasetUploadFail());
        dispatch(cancelDatasetUpload());
      }
    } finally {
      dispatch(removeLoading(actionTypes.CREATE_DATASET_REQUEST));
    }
  };

// // // // // // // // // //

// ** UPDATE DATASET COLUMN
/**
 * update dataset column success action
 *
 * @param {object} response Response
 * @returns {object} { type, column }
 */
const updateDatasetColumnSuccess = (response) => (dispatch) => {
  // getting column from response
  const column = response.data;

  // dispatching update dataset column success
  dispatch({
    type: actionTypes.UPDATE_DATASET_COLUMN_SUCCESS,
    column,
  });
};

/**
 * update dataset column fail action
 *
 * @param {object} error Error
 * @returns {object} { type, errorMessage }
 */
const updateDatasetColumnFail = (error) => (dispatch) => {
  // getting error message
  const errorMessage = error.message;

  // dispatching update dataset column fail
  dispatch({
    type: actionTypes.UPDATE_DATASET_COLUMN_FAIL,
    errorMessage,
  });

  message.error(errorMessage, 5);
};

/**
 * update dataset column request action
 *
 * @param {string} columnName COlumn name
 * @param {string} columnNewType Column new type
 * @returns {Function} Dispatch function
 */
export const updateDatasetColumnRequest =
  (columnName, columnNewType) => (dispatch, getState) => {
    // dispatching request action
    dispatch({
      type: actionTypes.UPDATE_DATASET_COLUMN_REQUEST,
    });

    // dispatching dataset operator loading data action
    dispatch(addLoading(actionTypes.UPDATE_DATASET_COLUMN_REQUEST));

    // getting operators and tasks from store
    const { operatorsReducer, tasksReducer } = getState();
    const tasks = tasksReducer.tasks;

    // get dataset name
    const datasetName = utils.getDatasetName(tasks, operatorsReducer);

    // updating dataset columns
    datasetsApi
      .updateDatasetColumn(datasetName, columnName, columnNewType)
      .then((response) => dispatch(updateDatasetColumnSuccess(response)))
      .catch((error) => dispatch(updateDatasetColumnFail(error)))
      .finally(() => {
        dispatch(removeLoading(actionTypes.UPDATE_DATASET_COLUMN_REQUEST));
      });
  };

// // // // // // // // // //

// ** GET DATASET
/**
 * get dataset success action
 *
 * @param {object} response Response
 * @returns {object} { type, columns }
 */
const getDatasetSuccess = (response) => (dispatch) => {
  // getting dataset from response
  const dataset = response.data;
  const featuretypes = utils.getFeaturetypes(dataset);

  // dispatching get dataset success
  dispatch({
    type: actionTypes.GET_DATASET_SUCCESS,
    payload: {
      filename: dataset.filename || '',
      name: dataset.name || '',
      columns: dataset.columns || [],
      featuretypes: featuretypes || '',
    },
  });
};

/**
 * get dataset fail action
 *
 * @param {object} error Error
 * @returns {object} { type, errorMessage }
 */
const getDatasetFail = (error) => (dispatch) => {
  // getting error message
  const errorMessage = error.message;

  // dispatching get dataset fail
  dispatch({
    type: actionTypes.GET_DATASET_FAIL,
    errorMessage,
  });

  message.error(errorMessage, 5);
};

/**
 * get dataset request action
 *
 * @param {string} datasetName Dataset name
 * @returns {Function} Dispatch function
 */
export const getDatasetRequest = (datasetName) => (dispatch) => {
  // dispatching request action
  dispatch({
    type: actionTypes.GET_DATASET_REQUEST,
  });

  if (datasetName) {
    dispatch(addLoading(actionTypes.GET_DATASET_REQUEST));

    datasetsApi
      .getDataset(datasetName)
      .then((response) => dispatch(getDatasetSuccess(response)))
      .catch((error) => dispatch(getDatasetFail(error)))
      .finally(() => {
        dispatch(removeLoading(actionTypes.GET_DATASET_REQUEST));
      });
  } else {
    dispatch(
      getDatasetSuccess({
        data: {
          filename: '',
          name: '',
          columns: [],
        },
      })
    );
  }
};

// // // // // // // // // //

// ** SELECT DATASET
/**
 * select dataset action
 *
 * @param {string} datasetName Dataset name
 * @param {string} projectId Project id
 * @param {string} experimentId Experiment id
 * @returns {Function} Action
 */
export const selectDataset =
  (datasetName, projectId, experimentId) => (dispatch, getState) => {
    // dispatch action
    dispatch({
      type: actionTypes.SELECT_DATASET,
    });

    // get operator reducer from store
    const { operatorReducer, operatorsReducer: operators } = getState();

    // save dataset operator
    const datasetOperator = { ...operatorReducer };

    const experimentIsSucceeded = utils.checkExperimentSuccess({ operators });

    // fetching dataset
    datasetsApi
      .getDataset(datasetName)
      .then((response) => {
        // get dataset from response
        const dataset = response.data;

        // dispatch action to save dataset
        dispatch(
          datasetUploadSuccess(
            dataset,
            projectId,
            experimentId,
            datasetOperator,
            experimentIsSucceeded
          )
        );
      })
      .catch((error) => dispatch(getDatasetFail(error)));
  };

// ** DELETE DATASET

/**
 * delete dataset success action
 *
 * @param {boolean} experimentIsSucceeded Experiment is succeeded
 * @returns {Function} Dispatch function
 */
export const deleteDatasetSuccess = (experimentIsSucceeded) => (dispatch) => {
  dispatch({
    type: actionTypes.DELETE_DATASET_SUCCESS,
    payload: {
      columns: [],
      featuretypes: '',
      filename: '',
      name: '',
      progress: 0,
      file: null,
      status: null,
      isUploading: false,
    },
  });

  if (experimentIsSucceeded) {
    dispatch(
      showWarning(
        'Arquivo atualizado! Algumas tarefas precisam ser reconfiguradas.'
      )
    );
  }
};

/**
 * Dataset upload fail action
 *
 * @returns {Function} Dispatch function
 */
export const deleteDatasetFail = () => (dispatch) => {
  const errorMessage = 'Ocorreu um erro ao excluir arquivo';

  // dispatching create dataset fail
  dispatch({
    type: actionTypes.DELETE_DATASET_FAIL,
    errorMessage,
  });

  message.error(errorMessage, 5);
};

/**
 * Delete dataset request action
 *
 * @param {string} projectId Project Id
 * @param {string} experimentId Experiment Id
 * @returns {Function} Dispatch function
 */
export const deleteDatasetRequest =
  (projectId, experimentId) => async (dispatch, getState) => {
    // dispatching request action
    dispatch({
      type: actionTypes.DELETE_DATASET_REQUEST,
    });

    // get select operator from store
    const { operatorReducer: operator, operatorsReducer: operators } =
      getState();

    const experimentIsSucceeded = utils.checkExperimentSuccess({ operators });

    try {
      dispatch(addLoading(actionTypes.DELETE_DATASET_REQUEST));

      // dispatching clear operator feature parameters
      await dispatch(
        clearOperatorsFeatureParametersRequest(projectId, experimentId, null)
      );

      // update dataset parameter
      await dispatch(
        updateExperimentOperatorRequest(
          projectId,
          experimentId,
          operator,
          'dataset',
          ''
        )
      );

      dispatch(deleteDatasetSuccess(experimentIsSucceeded));
    } catch (e) {
      dispatch(deleteDatasetFail());
    } finally {
      dispatch(removeLoading(actionTypes.DELETE_DATASET_REQUEST));
    }
  };

/**
 * Delete deployment dataset request action
 *
 * @param {string} projectId Project Id
 * @param {string} deploymentId Deployment Id
 * @returns {Function} Dispatch function
 */
export const deleteDeploymentDatasetRequest =
  (projectId, deploymentId) => (dispatch, getState) => {
    // dispatching request action
    dispatch({
      type: actionTypes.DELETE_DATASET_REQUEST,
    });

    // get select operator from store
    const { operatorReducer: operator, operatorsReducer: operators } =
      getState();

    const experimentIsSucceeded = utils.checkExperimentSuccess({ operators });

    try {
      dispatch(addLoading(actionTypes.DELETE_DATASET_REQUEST));

      // update dataset parameter
      dispatch(
        updateDeploymentOperatorRequest(
          projectId,
          deploymentId,
          operator,
          'dataset',
          ''
        )
      );

      dispatch(deleteDatasetSuccess(experimentIsSucceeded));
    } catch (e) {
      dispatch(deleteDatasetFail());
    } finally {
      dispatch(removeLoading(actionTypes.DELETE_DATASET_REQUEST));
    }
  };

export const updateAllDatasetColumnStart = () => (dispatch) => {
  dispatch(addLoading(actionTypes.UPDATE_ALL_DATASET_COLUMNS_REQUEST));
};

export const updateAllDatasetColumnSuccess = (columns) => (dispatch) => {
  dispatch(removeLoading(actionTypes.UPDATE_ALL_DATASET_COLUMNS_REQUEST));

  // dispatching update dataset column success
  dispatch({
    type: actionTypes.UPDATE_ALL_DATASET_COLUMNS_SUCCESS,
    payload: columns,
  });
};

export const updateAllDatasetColumnFail = (errorMessage) => (dispatch) => {
  dispatch(removeLoading(actionTypes.UPDATE_ALL_DATASET_COLUMNS_REQUEST));

  // dispatching update dataset column fail
  dispatch({
    type: actionTypes.UPDATE_ALL_DATASET_COLUMNS_FAIL,
    errorMessage,
  });

  message.error(errorMessage, 5);
};

/**
 * Function to fetch pagineted dataset and dispatch to reducer
 *
 * @param {string} datasetName Dataset name
 * @param {number} page Page number
 * @param {number} pageSize Pge size
 * @returns {Function} DIspatch function
 */
export const fetchPaginatedDataset = (datasetName, page, pageSize) => {
  return (dispatch) => {
    dispatch(addLoading(actionTypes.FETCH_PAGINATED_DATASET));

    return datasetsApi
      .getDataset(datasetName, page, pageSize)
      .then((response) => {
        const dataset = response.data;
        dispatch({
          type: actionTypes.FETCH_PAGINATED_DATASET,
          currentPage: page,
          data: dataset.data,
          pageSize: pageSize,
          total: dataset.total,
        });
      })
      .catch((error) => {
        const errorMessage = error.message;
        message.error(errorMessage, 5);
      })
      .finally(() => {
        dispatch(removeLoading(actionTypes.FETCH_PAGINATED_DATASET));
      });
  };
};

/**
 * Change dataset action
 *
 * @param {object} dataset Dataset
 * @returns {object} { type, payload }
 */
export const changeDataset = (dataset) => async (dispatch) => {
  dispatch({
    type: actionTypes.GET_DATASET_SUCCESS,
    payload: {
      filename: dataset?.value || '',
      name: '',
      columns: [],
      featuretypes: '',
    },
  });
};
