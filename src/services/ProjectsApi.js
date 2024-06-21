// correção de bug do eslint/jsdoc
/* eslint-disable-next-line */
/* global ProjectUpdatable, ProjectCreatable, Projects */

/* API REFERENCE: https://platiagro.github.io/projects/#/Projects */

import { createAxiosInstance } from 'services/factories';

const URL = process.env.REACT_APP_PROJECTS_API || 'http://localhost:8080';

const projectsApi = createAxiosInstance({
  baseURL: URL,
});

const projectsPath = '/projects';

/**
 * Fetch Project
 *
 * @param {string} projectId Project id to fetch
 * @returns {Promise} Fetch project request
 */
const fetchProject = (projectId) => {
  return projectsApi.get(`${projectsPath}/${projectId}`);
};

/**
 * Create Project
 *
 * @param {ProjectCreatable} project Objeto de criação do projeto
 * @returns {Promise} Create project request
 */
const createProject = (project) => {
  return projectsApi.post(projectsPath, project);
};

/**
 * Update Project
 *
 * @param {string} projectId Project id to update
 * @param {ProjectUpdatable} projectUpdate New project data
 * @returns {Promise} Update project request
 */
const updateProject = (projectId, projectUpdate) => {
  return projectsApi.patch(`${projectsPath}/${projectId}`, projectUpdate);
};

/**
 * Delete Projects
 *
 * @param {Projects} projects Projects to delete
 * @returns {Promise} Delete projects request
 */
const deleteProjects = (projects) => {
  return projectsApi.post(`${projectsPath}/deleteprojects`, projects);
};

/**
 * Fetch paginated projects
 *
 * @param {string} name Project filter name
 * @param {number} page Projects table current page
 * @param {number} pageSize Projects table page size
 * @returns {Promise} Fetch paginated projects request
 */
const fetchPaginatedProjects = (name, page, pageSize) => {
  return projectsApi.post(`${projectsPath}/list-projects`, {
    filters: {
      name,
    },
    page,
    page_size: pageSize,
  });
};

export default {
  fetchProject,
  createProject,
  updateProject,
  deleteProjects,
  fetchPaginatedProjects,
  axiosInstance: projectsApi,
};
