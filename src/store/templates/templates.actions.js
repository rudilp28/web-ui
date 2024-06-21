// correção de bug do eslint/jsdoc
/* eslint-disable-next-line */
/* global Templates, TemplateCreatable */

import * as TEMPLATES_TYPES from './templates.actionTypes';

import templatesApi from 'services/TemplatesApi';

import { hideNewTemplateModal } from '../ui/actions';
import { fetchTasksMenuRequest } from '../tasksMenu/actions';
import { showError, showSuccess } from 'store/message/message.actions';
import { addLoading, removeLoading } from 'store/loading';

import { getTemplates } from './templates.selectors';

/**
 * Templates success default action
 *
 * @param {object} successObject Success action default object
 * @param {Templates} successObject.templates New templates state
 * @param {string} successObject.requestActionType Action type request, used in loading
 * @param {string} successObject.successActionType Action type success
 * @param {string=} successObject.message Success message
 * @param {Function} successObject.callback Success function callback
 * @returns {Function} Thunk action
 */
const templatesActionSuccess =
  ({
    templates,
    requestActionType,
    successActionType,
    message = undefined,
    callback = undefined,
  }) =>
  (dispatch) => {
    dispatch({
      type: successActionType,
      payload: { templates },
    });

    if (message) dispatch(showSuccess(message));
    if (callback) callback();

    dispatch(removeLoading(requestActionType));
  };

/**
 * Templates fail default action
 *
 * @param {object} failObject Error action default object
 * @param {string} failObject.requestActionType Action type request, used in loading
 * @param {string} failObject.failActionType Action type fail
 * @param {string=} failObject.message Error message
 * @param {object} failObject.response Error message
 * @param {Function} failObject.callback Fail function callback
 * @returns {Function} Thunk action
 */
const templatesActionFail =
  ({
    requestActionType,
    failActionType,
    message = undefined,
    response,
    callback,
  }) =>
  (dispatch) => {
    dispatch({ type: failActionType });

    const customMessages = {
      TemplateNameExists: 'Um template com o mesmo nome já existe!',
    };

    const customMessage = customMessages[response?.code] || response?.message;
    const errorMessage = customMessage || message;

    if (errorMessage) dispatch(showError(errorMessage));
    if (callback) callback();

    dispatch(removeLoading(requestActionType));
  };

/**
 * Fetch templates request action
 *
 * @returns {Function} Thunk action
 */
export const fetchTemplatesRequest = () => async (dispatch) => {
  const requestActionType = TEMPLATES_TYPES.FETCH_TEMPLATES_REQUEST;

  dispatch({
    type: requestActionType,
  });

  dispatch(addLoading(requestActionType));

  try {
    const response = await templatesApi.listTemplates();

    const {
      data: { templates },
    } = response;

    const successObject = {
      templates,
      requestActionType,
      successActionType: TEMPLATES_TYPES.FETCH_TEMPLATES_SUCCESS,
    };

    dispatch(templatesActionSuccess(successObject));
  } catch (error) {
    const errorObject = {
      requestActionType,
      failActionType: TEMPLATES_TYPES.FETCH_TEMPLATES_FAIL,
      message: error.message,
      response: error.response?.data,
    };

    dispatch(templatesActionFail(errorObject));
  }
};

/**
 * Create template request action
 *
 * @param {TemplateCreatable} templateObject Template creatable object
 * @returns {Function} Thunk action
 */
export const createTemplateRequest =
  (templateObject) => async (dispatch, getState) => {
    const requestActionType = TEMPLATES_TYPES.CREATE_TEMPLATE_REQUEST;

    dispatch({
      type: requestActionType,
    });

    dispatch(addLoading(requestActionType));

    try {
      const response = await templatesApi.createTemplate(templateObject);

      const { data: template } = response;

      const currentState = getState();
      const templatesState = getTemplates(currentState);

      const templates = [...templatesState, template];

      const successCallback = () => {
        dispatch(hideNewTemplateModal());

        dispatch(fetchTasksMenuRequest());
      };

      const successObject = {
        templates,
        requestActionType,
        successActionType: TEMPLATES_TYPES.CREATE_TEMPLATE_SUCCESS,
        message: 'Template criado com sucesso!',
        callback: successCallback,
      };

      dispatch(templatesActionSuccess(successObject));
    } catch (error) {
      const errorObject = {
        requestActionType,
        failActionType: TEMPLATES_TYPES.FETCH_TEMPLATES_FAIL,
        message: error.message,
        response: error.response?.data,
      };

      dispatch(templatesActionFail(errorObject));
    }
  };

/**
 * Delete template request action
 *
 * @param {string[]} templatesList Templates UUID list
 * @param {object[] | undefined} allTasks All tasks list, used in task menu
 * @returns {Function} Thunk action
 */
export const deleteTemplateRequest =
  (templatesList, allTasks) => async (dispatch, getState) => {
    const requestActionType = TEMPLATES_TYPES.DELETE_TEMPLATE_REQUEST;

    dispatch({
      type: requestActionType,
    });

    dispatch(addLoading(requestActionType));

    try {
      await templatesApi.deleteTemplate(templatesList);

      const currentState = getState();
      const templatesState = getTemplates(currentState);

      const templates = templatesState.filter((templateItem) => {
        return !templatesList.includes(templateItem.uuid);
      });

      // TODO: Todo esse bloco será removido quando a store de menu de tarefas for refatorada
      // INICIO ------------->
      let tasks = [];
      if (allTasks) {
        const filteredTemplates = [...allTasks.filtered.TEMPLATES].filter(
          (template) => !templatesList.includes(template.uuid)
        );

        const unfilteredTemplates = [...allTasks.unfiltered.TEMPLATES].filter(
          (template) => !templatesList.includes(template.uuid)
        );

        tasks = {
          unfiltered: {
            ...allTasks.unfiltered,
            TEMPLATES: unfilteredTemplates,
          },
          filtered: {
            ...allTasks.filtered,
            TEMPLATES: filteredTemplates,
          },
        };

        if (tasks.unfiltered.TEMPLATES.length === 0) {
          delete tasks.unfiltered.TEMPLATES;
        }

        if (tasks.filtered.TEMPLATES.length === 0) {
          delete tasks.filtered.TEMPLATES;
        }
      }
      // FIM ------------->

      // TODO: por enquanto precisamos enviar as tarefas no payload, porém quando a store de menu de tarefas for refatorada
      // provavelmente isso poderá ser corrigido
      const customPayload = { templates, tasks };

      const successObject = {
        templates: customPayload,
        requestActionType,
        successActionType: TEMPLATES_TYPES.DELETE_TEMPLATE_SUCCESS,
        message: 'Template excluído com sucesso!',
      };

      dispatch(templatesActionSuccess(successObject));
    } catch (error) {
      const errorObject = {
        failActionType: TEMPLATES_TYPES.DELETE_TEMPLATE_FAIL,
        requestActionType,
        message: error.message,
        response: error.response?.data,
      };

      dispatch(templatesActionFail(errorObject));
    }
  };
