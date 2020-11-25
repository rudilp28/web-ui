// CORE LIBS
import axios from 'axios';

// CONSTANTS
const URL = process.env.REACT_APP_PIPELINES_API || 'http://localhost:8080';
const URL_SELDON = process.env.REACT_APP_SELDON_API;
const pipelinesApi = axios.create({
  baseURL: `${URL}/projects/`,
});
const seldonApi = axios.create({
  baseURL: `${URL_SELDON}`,
});
const deploymentsPath = 'deployments';

const fetchDeployedExperiment = (projectId, deployId) => {
  return pipelinesApi.get(`${projectId}/${deploymentsPath}/${deployId}/runs`);
};

const fetchDeployedExperimentLogs = (projectId, deployId, runId) => {
  return pipelinesApi.get(
    `${projectId}/${deploymentsPath}/${deployId}/runs/${runId}/logs`
  );
};

const deleteDeployedExperiments = (projectId, experimentId) => {
  return pipelinesApi.delete(
    `${projectId}/${deploymentsPath}/${experimentId}/runs`
  );
};

const testDeployedExperiments = (id, body) => {
  return seldonApi.post(`/deployments/${id}/api/v1.0/predictions`, body);
};

const listDeployments = (projectsId) => {
  return pipelinesApi.get(`${projectsId}/${deploymentsPath}`);
};

const createDeployment = (projectsId, body) => {
  return pipelinesApi.post(`${projectsId}/${deploymentsPath}`, body);
};

const updateDeployment = (projectsId, deploymentId, body) => {
  return pipelinesApi.patch(
    `${projectsId}/${deploymentsPath}/${deploymentId}`,
    body
  );
};

const deleteDeployment = (projectsId, deploymentId) => {
  return pipelinesApi.delete(
    `${projectsId}/${deploymentsPath}/${deploymentId}`
  );
};

// EXPORT DEFAULT
export default {
  fetchDeployedExperiment,
  fetchDeployedExperimentLogs,
  testDeployedExperiments,
  deleteDeployedExperiments,
  listDeployments,
  createDeployment,
  updateDeployment,
  deleteDeployment,
};
