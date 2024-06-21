import { createAxiosInstance } from 'services/factories';

const taskApi = createAxiosInstance({
  baseURL: process.env.REACT_APP_PROJECTS_API || 'http://localhost:8080',
});

/**
 * Create task
 *
 * @param {object} task A Task
 * @returns {Promise} Request promise
 */
const createTask = (task) => {
  return taskApi.post('/tasks', task);
};

/**
 * Delete task
 *
 * @param {string} id Task id
 * @returns {Promise} Request promise
 */
const deleteTask = (id) => {
  return taskApi.delete(`/tasks/${id}`);
};

/**
 * Get all tasks
 *
 * @param {object} filters Filters object
 * @param {string} filters.category Category to filter
 * @returns {Promise} The request promise
 */
const getAllTasks = ({ category } = {}) => {
  const filters = category ? { category } : undefined;
  return taskApi.post('/tasks/list-tasks', {
    filters,
  });
};

/**
 * Get paginated tasks
 *
 * @param {object} filters Filters object
 * @param {number} filters.page Current task page
 * @param {number} filters.pageSize Number of tasks per page
 * @param {string} filters.name Name to filter
 * @param {string} filters.category Category to filter
 * @returns {Promise} Request promise
 */
const getPaginatedTasks = ({ page, pageSize, name, category } = {}) => {
  return taskApi.post('/tasks/list-tasks', {
    filters: {
      name,
      category,
    },
    page,
    page_size: pageSize,
  });
};

/**
 * Update task (PATCH)
 *
 * @param {string} uuid Task id
 * @param {object} taskData Task data
 * @returns {Promise} Request promise
 */
const updateTask = (uuid, taskData) => {
  return taskApi.patch(`/tasks/${uuid}`, taskData);
};

/**
 * Get task data
 *
 * @param {string} uuid Task id
 * @returns {Promise} Request promise
 */
const getTaskData = (uuid) => {
  return taskApi.get(`/tasks/${uuid}`);
};

/**
 * Send task via email
 *
 * @param {string} uuid Task id
 * @param {string[]} emails Email
 * @returns {Promise} Request promise
 */
const sendTaskViaEmail = (uuid, emails) => {
  return taskApi.post(`/tasks/${uuid}/emails`, { emails });
};

export default {
  createTask,
  deleteTask,
  getAllTasks,
  getPaginatedTasks,
  updateTask,
  getTaskData,
  sendTaskViaEmail,
  axiosInstance: taskApi,
};
