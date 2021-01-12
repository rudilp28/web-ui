// CORE LIBS
import axios from 'axios';

// CONSTANTS
// api base url
const URL = process.env.REACT_APP_PROJECTS_API || 'http://localhost:8080';
// projects path
const projectsPath = '/projects';
// api object
const operatorsApi = axios.create({
  baseURL: `${URL}${projectsPath}`,
});
// experiments path
const experimentsPath = '/experiments';
// operators path
const operatorsPath = '/operators';

// API METHODS
/**
 * List Operators
 *
 * @param {string} projectId
 * @param experimentId
 * @returns {Promise}
 */
const listOperators = (projectId, experimentId) => {
  return operatorsApi.get(
    `/${projectId}${experimentsPath}/${experimentId}${operatorsPath}`
  );
};

/**
 * Create Operator
 *
 * @param {string} projectId
 * @param {string} experimentId
 * @param {object} body
 * @returns {Promise}
 */
const createOperator = (
  projectId,
  experimentId,
  body
) => {
  return operatorsApi.post(
    `/${projectId}${experimentsPath}/${experimentId}${operatorsPath}`,
    body
  );
};

/**
 * Delete Operator
 *
 * @param {string} projectId
 * @param {string} experimentId
 * @param {string} operatorId
 * @returns {Promise}
 */
const deleteOperator = (projectId, experimentId, operatorId) => {
  return operatorsApi.delete(
    `/${projectId}${experimentsPath}/${experimentId}${operatorsPath}/${operatorId}`
  );
};

/**
 * Update Operator
 *
 * @param {string} projectId
 * @param {string} experimentId
 * @param {string} operatorId
 * @param {object} operator
 * @returns {Promise}
 */
const updateOperator = (projectId, experimentId, operatorId, operator) => {
  return operatorsApi.patch(
    `/${projectId}${experimentsPath}/${experimentId}${operatorsPath}/${operatorId}`,
    operator
  );
};

// EXPORT DEFAULT
export default {
  listOperators,
  createOperator,
  deleteOperator,
  updateOperator,
};
