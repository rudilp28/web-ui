import utils from 'utils';
import tasksApi from 'services/TasksApi';
import { showError, showSuccess } from 'store/message';
import { addLoading, removeLoading } from 'store/loading';

import * as TASKS_TYPES from './tasks.actionTypes';

/**
 * Fetch paginated tasks success action creator
 *
 * @param {object} task Added Task
 * @returns {object} Action
 */
export const createTaskSuccess = (task) => {
  return {
    type: TASKS_TYPES.CREATE_TASK_SUCCESS,
    task,
  };
};

/**
 * Add task fail action creator
 *
 * @returns {object} Action
 */
export const createTaskFail = () => {
  return {
    type: TASKS_TYPES.CREATE_TASK_FAIL,
  };
};

/**
 * Add task
 *
 * @param {object} task A Task
 * @param {Function} successCallback Success callback that receive the created task as param
 * @returns {Function} Dispatch function
 */
export const createTask = (task, successCallback) => async (dispatch) => {
  try {
    dispatch(addLoading(TASKS_TYPES.CREATE_TASK_REQUEST));
    const response = await tasksApi.createTask(task);
    const responseTask = response.data;
    dispatch(createTaskSuccess(responseTask));
    dispatch(showSuccess(`Tarefa criada com sucesso.`));
    if (successCallback) successCallback(responseTask);
  } catch (e) {
    dispatch(createTaskFail());
    const errorMessage = e.response?.data?.message || e.message;
    if (errorMessage && errorMessage.includes('name already exist')) {
      dispatch(showError('Já existe uma tarefa com este nome!'));
    } else {
      dispatch(showError(errorMessage));
    }
  } finally {
    dispatch(removeLoading(TASKS_TYPES.CREATE_TASK_REQUEST));
  }
};

/**
 * Delete task success action creator
 *
 * @param {string} id Task id
 * @returns {object} Action
 */
export const deleteTaskSuccess = (id) => {
  return {
    type: TASKS_TYPES.DELETE_TASK_SUCCESS,
    id,
  };
};

/**
 * Delete task fail action creator
 *
 * @returns {object} Action
 */
export const deleteTaskFail = () => {
  return {
    type: TASKS_TYPES.DELETE_TASK_FAIL,
  };
};

/**
 * Delete task
 *
 * @param {string} id Task id
 * @param {Function} successCallback Success callback
 * @returns {Function} Dispatch function
 */
export const deleteTask = (id, successCallback) => async (dispatch) => {
  try {
    dispatch(addLoading(TASKS_TYPES.DELETE_TASK_REQUEST));
    await tasksApi.deleteTask(id);
    dispatch(deleteTaskSuccess(id));
    dispatch(showSuccess('Tarefa excluída'));
    if (successCallback) successCallback();
  } catch (e) {
    const isForbidden = e.response?.status === 403;
    const errorMessage = isForbidden
      ? 'Não foi possível excluir esta tarefa, pois ela está associada a um experimento.'
      : e.message;

    dispatch(deleteTaskFail());
    dispatch(showError(errorMessage));
  } finally {
    dispatch(removeLoading(TASKS_TYPES.DELETE_TASK_REQUEST));
  }
};

/**
 * Fetch paginated tasks success action creator
 *
 * @param {object} data Tasks Object
 * @param {Array} data.tasks Tasks Array
 * @param {number} data.total Total Tasks
 * @param {number} data.pageSize Page size
 * @param {number} data.page Page number
 * @param {string} data.name Task name
 * @returns {object} Action
 */
export const fetchPaginatedTasksSuccess = ({
  total,
  tasks,
  pageSize,
  page,
  name,
}) => {
  return {
    type: TASKS_TYPES.FETCH_TASKS_PAGE_SUCCESS,
    totalTasks: total,
    tasks,
    pageSize,
    page,
    name,
  };
};

/**
 * Fetch paginated tasks fail action creator
 *
 * @returns {object} Action
 */
export const fetchPaginatedTasksFail = () => {
  return {
    type: TASKS_TYPES.FETCH_TASKS_PAGE_FAIL,
  };
};

/**
 * Fetch tasks with pagination
 *
 * @param {number} page Page number
 * @param {number} pageSize Page size
 * @param {string} name Task name to search
 * @returns {Function} Dispatch function
 */
export const fetchPaginatedTasks =
  (page, pageSize, name = '') =>
  async (dispatch) => {
    try {
      dispatch(addLoading(TASKS_TYPES.FETCH_TASKS_PAGE_REQUEST));

      const { data } = await tasksApi.getPaginatedTasks({
        name,
        page,
        pageSize,
      });

      const { total, tasks } = data;

      dispatch(
        fetchPaginatedTasksSuccess({
          total,
          tasks,
          pageSize,
          page,
          name,
        })
      );
    } catch (e) {
      dispatch(fetchPaginatedTasksFail());
      dispatch(showError(e.message));
    } finally {
      dispatch(removeLoading(TASKS_TYPES.FETCH_TASKS_PAGE_REQUEST));
    }
  };

/**
 * Fetch tasks success action creator
 *
 * @param {Array} tasks Tasks array
 * @returns {object} Action
 */
export const fetchTasksSuccess = (tasks) => {
  return {
    type: TASKS_TYPES.FETCH_TASKS_SUCCESS,
    tasks,
  };
};

/**
 * Fetch tasks fail action creator
 *
 * @returns {object} Action
 */
export const fetchTasksFail = () => {
  return {
    type: TASKS_TYPES.FETCH_TASKS_FAIL,
  };
};

/**
 * Fetch tasks
 *
 * @param {object} filters Filters
 * @returns {Function} Dispatch function
 */
export const fetchTasks = (filters) => async (dispatch) => {
  try {
    dispatch(addLoading(TASKS_TYPES.FETCH_TASKS_REQUEST));
    const response = await tasksApi.getAllTasks(filters);
    const { tasks } = response.data;
    dispatch(fetchTasksSuccess(tasks));
  } catch (e) {
    dispatch(fetchTasksFail());
    dispatch(showError(e.message));
  } finally {
    dispatch(removeLoading(TASKS_TYPES.FETCH_TASKS_REQUEST));
  }
};

/**
 * Update task fail action creator
 *
 * @param {object} task A task
 * @returns {object} Action
 */
export const updateTaskSuccess = (task) => {
  return {
    type: TASKS_TYPES.UPDATE_TASK_SUCCESS,
    task,
  };
};

/**
 * Update task fail action creator
 *
 * @returns {object} Action
 */
export const updateTaskFail = () => {
  return {
    type: TASKS_TYPES.UPDATE_TASK_FAIL,
  };
};

/**
 * Update task
 *
 * @param {string} uuid The ID
 * @param {object} task The task
 * @param {Function} successCallback Success callback
 * @returns {Function} Dispatch function
 */
export const updateTask = (uuid, task, successCallback) => async (dispatch) => {
  try {
    dispatch(addLoading(TASKS_TYPES.UPDATE_TASK_REQUEST));
    const response = await tasksApi.updateTask(uuid, task);
    dispatch(updateTaskSuccess(response.data));
    dispatch(showSuccess(`Alteração realizada com sucesso.`));
    if (successCallback) successCallback();
  } catch (e) {
    dispatch(updateTaskFail());
    const errorMessage = e.response?.data?.message || e.message;
    if (errorMessage.includes('name already exist')) {
      dispatch(showError('Já existe uma tarefa com este nome!'));
    } else {
      dispatch(showError(errorMessage));
    }
  } finally {
    dispatch(removeLoading(TASKS_TYPES.UPDATE_TASK_REQUEST));
  }
};

/**
 * Fetch task data success action creator
 *
 * @param {object} taskData Task data
 * @returns {object} Action
 */
export const fetchTaskDataSuccess = (taskData) => {
  return {
    type: TASKS_TYPES.FETCH_TASK_DATA_SUCCESS,
    taskData,
  };
};

/**
 * Fetch task data fail action creator
 *
 * @returns {object} Action
 */
export const fetchTaskDataFail = () => {
  return {
    type: TASKS_TYPES.FETCH_TASK_DATA_FAIL,
  };
};

/**
 * Fetch task data
 *
 * @param {string} taskId Task ID
 * @returns {Function} Dispatch function
 */
export const fetchTaskData = (taskId) => async (dispatch) => {
  try {
    dispatch(addLoading(TASKS_TYPES.FETCH_TASK_DATA_REQUEST));
    const response = await tasksApi.getTaskData(taskId);
    const task = response.data;
    dispatch(fetchTaskDataSuccess(task));
  } catch (e) {
    dispatch(fetchTaskDataFail());
    dispatch(showError(e.message));
  } finally {
    dispatch(removeLoading(TASKS_TYPES.FETCH_TASK_DATA_REQUEST));
  }
};

/**
 * send task via email success action creator
 *
 * @returns {object} Action
 */
export const sendTaskViaEmailSuccess = () => {
  return {
    type: TASKS_TYPES.SEND_TASK_VIA_EMAIL_SUCCESS,
  };
};

/**
 * send task via email FAIL action creator
 *
 * @returns {object} Action
 */
export const sendTaskViaEmailFail = () => {
  return {
    type: TASKS_TYPES.SEND_TASK_VIA_EMAIL_FAIL,
  };
};

/**
 * send task via email
 *
 * @param {string} taskId Task Id
 * @param {string} email Email
 * @param {Function} successCallback Success callback
 * @returns {Function} Dispatch function
 */
export const sendTaskViaEmail =
  (taskId, email, successCallback) => async (dispatch) => {
    try {
      dispatch(addLoading(TASKS_TYPES.SEND_TASK_VIA_EMAIL_REQUEST));
      await tasksApi.sendTaskViaEmail(taskId, [email]);
      dispatch(sendTaskViaEmailSuccess());
      dispatch(showSuccess(`E-mail enviado com sucesso!`));
      if (successCallback) successCallback();
    } catch (e) {
      dispatch(sendTaskViaEmailFail());
      dispatch(showError(e.message));
    } finally {
      dispatch(removeLoading(TASKS_TYPES.SEND_TASK_VIA_EMAIL_REQUEST));
    }
  };

/**
 * Clear task data from state
 *
 * @returns {object} Action
 */
export const clearTaskData = () => {
  return {
    type: TASKS_TYPES.CLEAR_TASK_DATA,
  };
};

/**
 * Upload task experiment notebook success action creator
 *
 * @returns {object} Action
 */
export const uploadTaskExperimentNotebookSuccess = () => {
  return {
    type: TASKS_TYPES.UPLOAD_TASK_EXPERIMENT_NOTEBOOK_SUCCESS,
  };
};

/**
 * Upload task experiment notebook fail action creator
 *
 * @returns {object} Action
 */
export const uploadTaskExperimentNotebookFail = () => {
  return {
    type: TASKS_TYPES.UPLOAD_TASK_EXPERIMENT_NOTEBOOK_FAIL,
  };
};

/**
 * Upload task experiment notebook
 *
 * @param {string} uuid Task ID
 * @param {File} file Experiment Notebook file
 * @param {Function} successCallback Success callback
 * @returns {Function} Dispatch function
 */
export const uploadTaskExperimentNotebook =
  (uuid, file, successCallback) => async (dispatch) => {
    try {
      dispatch(addLoading(TASKS_TYPES.UPLOAD_TASK_EXPERIMENT_NOTEBOOK_REQUEST));
      const fileContent = await utils.readFileContent(file);
      const fileContentJson = JSON.parse(fileContent);
      await tasksApi.updateTask(uuid, { experimentNotebook: fileContentJson });
      dispatch(showSuccess(`Upload do notebook de experimentação concluído`));
      dispatch(uploadTaskExperimentNotebookSuccess());
      if (successCallback) successCallback();
    } catch (e) {
      const errorMessage = e.response?.data?.message || e.message;
      dispatch(showError(errorMessage));
      dispatch(uploadTaskExperimentNotebookFail());
    } finally {
      dispatch(
        removeLoading(TASKS_TYPES.UPLOAD_TASK_EXPERIMENT_NOTEBOOK_REQUEST)
      );
    }
  };

/**
 * Upload task deployment notebook success action creator
 *
 * @returns {object} Action
 */
export const uploadTaskDeploymentNotebookSuccess = () => {
  return {
    type: TASKS_TYPES.UPLOAD_TASK_DEPLOYMENT_NOTEBOOK_SUCCESS,
  };
};

/**
 * Upload task deployment notebook fail action creator
 *
 * @returns {object} Action
 */
export const uploadTaskDeploymentNotebookFail = () => {
  return {
    type: TASKS_TYPES.UPLOAD_TASK_DEPLOYMENT_NOTEBOOK_FAIL,
  };
};

/**
 * Upload task deployment notebook
 *
 * @param {string} uuid Task ID
 * @param {file} file Deployment Notebook file
 * @param {Function} successCallback Success callback
 * @returns {Function} Dispatch function
 */
export const uploadTaskDeploymentNotebook =
  (uuid, file, successCallback) => async (dispatch) => {
    try {
      dispatch(addLoading(TASKS_TYPES.UPLOAD_TASK_DEPLOYMENT_NOTEBOOK_REQUEST));
      const fileContent = await utils.readFileContent(file);
      const fileContentJson = JSON.parse(fileContent);
      await tasksApi.updateTask(uuid, { deploymentNotebook: fileContentJson });
      dispatch(showSuccess('Upload do notebook de pré-implantação concluído'));
      dispatch(uploadTaskDeploymentNotebookSuccess());
      if (successCallback) successCallback();
    } catch (e) {
      const errorMessage = e.response?.data?.message || e.message;
      dispatch(showError(errorMessage));
      dispatch(uploadTaskDeploymentNotebookFail());
    } finally {
      dispatch(
        removeLoading(TASKS_TYPES.UPLOAD_TASK_DEPLOYMENT_NOTEBOOK_REQUEST)
      );
    }
  };
