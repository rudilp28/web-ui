import thunk from 'redux-thunk';
import MockAdapter from 'axios-mock-adapter';
import configureStore from 'redux-mock-store';

import TasksApi from 'services/TasksApi';
import { ADD_LOADING, REMOVE_LOADING } from 'store/loading';

import * as TASKS_TYPES from '../tasks.actionTypes';
import {
  createTaskSuccess,
  createTaskFail,
  createTask,
  deleteTaskSuccess,
  deleteTaskFail,
  deleteTask,
  fetchPaginatedTasksSuccess,
  fetchPaginatedTasksFail,
  fetchPaginatedTasks,
  fetchTasksSuccess,
  fetchTasksFail,
  fetchTasks,
  updateTaskSuccess,
  updateTaskFail,
  updateTask,
  fetchTaskDataSuccess,
  fetchTaskDataFail,
  fetchTaskData,
  sendTaskViaEmailSuccess,
  sendTaskViaEmailFail,
  sendTaskViaEmail,
  clearTaskData,
  uploadTaskExperimentNotebookSuccess,
  uploadTaskExperimentNotebookFail,
  uploadTaskExperimentNotebook,
  uploadTaskDeploymentNotebookSuccess,
  uploadTaskDeploymentNotebookFail,
  uploadTaskDeploymentNotebook,
} from '../tasks.actions';

describe('Tasks Action', () => {
  const mockStore = configureStore([thunk]);
  const store = mockStore({});

  const mockAxios = new MockAdapter(TasksApi.axiosInstance);

  beforeEach(() => {
    mockAxios.reset();
    jest.clearAllMocks();
  });

  const fakeTask = {
    uuid: '1',
    name: 'Task 1',
  };

  const fakeTasks = [
    {
      uuid: '1',
      name: 'Task 1',
    },
    {
      uuid: '2',
      name: 'Task 2',
    },
  ];

  it('should create the task creation success action', () => {
    expect(createTaskSuccess(fakeTask)).toEqual({
      type: TASKS_TYPES.CREATE_TASK_SUCCESS,
      task: fakeTask,
    });
  });

  it('should create the task creation fail action', () => {
    expect(createTaskFail()).toEqual({
      type: TASKS_TYPES.CREATE_TASK_FAIL,
    });
  });

  it('should run the task creation async action correctly', async () => {
    const successCallbackMock = jest.fn();
    mockAxios.onPost().reply(200, fakeTask);
    await store.dispatch(createTask(fakeTask, successCallbackMock));
    const actions = store.getActions();

    expect(successCallbackMock).toBeCalledWith(fakeTask);

    expect(actions).toEqual(
      expect.arrayContaining([
        {
          type: ADD_LOADING,
          payload: { [TASKS_TYPES.CREATE_TASK_REQUEST]: true },
        },
        {
          type: TASKS_TYPES.CREATE_TASK_SUCCESS,
          task: fakeTask,
        },
        {
          type: REMOVE_LOADING,
          payload: [TASKS_TYPES.CREATE_TASK_REQUEST],
        },
      ])
    );
  });

  it('should handle errors in the task creation async action', async () => {
    mockAxios.onPost().reply(500, { message: 'Error Message' });
    await store.dispatch(createTask(fakeTask));
    const actions = store.getActions();

    expect(actions).toEqual(
      expect.arrayContaining([
        {
          type: ADD_LOADING,
          payload: { [TASKS_TYPES.CREATE_TASK_REQUEST]: true },
        },
        {
          type: TASKS_TYPES.CREATE_TASK_FAIL,
        },
        {
          type: REMOVE_LOADING,
          payload: [TASKS_TYPES.CREATE_TASK_REQUEST],
        },
      ])
    );
  });

  it('should create the task deletion success action', () => {
    expect(deleteTaskSuccess('1')).toEqual({
      type: TASKS_TYPES.DELETE_TASK_SUCCESS,
      id: '1',
    });
  });

  it('should create the task deletion fail action', () => {
    expect(deleteTaskFail()).toEqual({
      type: TASKS_TYPES.DELETE_TASK_FAIL,
    });
  });

  it('should run the task deletion async action correctly', async () => {
    const taskId = '1';
    const successCallbackMock = jest.fn();
    mockAxios.onDelete().reply(200);
    await store.dispatch(deleteTask(taskId, successCallbackMock));
    const actions = store.getActions();

    expect(successCallbackMock).toBeCalled();

    expect(actions).toEqual(
      expect.arrayContaining([
        {
          type: ADD_LOADING,
          payload: { [TASKS_TYPES.DELETE_TASK_REQUEST]: true },
        },
        {
          type: TASKS_TYPES.DELETE_TASK_SUCCESS,
          id: taskId,
        },
        {
          type: REMOVE_LOADING,
          payload: [TASKS_TYPES.DELETE_TASK_REQUEST],
        },
      ])
    );
  });

  it('should handle errors in the task deletion async action', async () => {
    mockAxios.onDelete().reply(500);
    await store.dispatch(deleteTask('1'));
    const actions = store.getActions();

    expect(actions).toEqual(
      expect.arrayContaining([
        {
          type: ADD_LOADING,
          payload: { [TASKS_TYPES.DELETE_TASK_REQUEST]: true },
        },
        {
          type: TASKS_TYPES.DELETE_TASK_FAIL,
        },
        {
          type: REMOVE_LOADING,
          payload: [TASKS_TYPES.DELETE_TASK_REQUEST],
        },
      ])
    );
  });

  it('should create the fetch paginated task success action', () => {
    expect(
      fetchPaginatedTasksSuccess({
        total: fakeTasks.length,
        tasks: fakeTasks,
        pageSize: 10,
        page: 1,
        name: 'Task',
      })
    ).toEqual({
      type: TASKS_TYPES.FETCH_TASKS_PAGE_SUCCESS,
      totalTasks: fakeTasks.length,
      tasks: fakeTasks,
      pageSize: 10,
      page: 1,
      name: 'Task',
    });
  });

  it('should create the fetch paginated task fail action', () => {
    expect(fetchPaginatedTasksFail()).toEqual({
      type: TASKS_TYPES.FETCH_TASKS_PAGE_FAIL,
    });
  });

  it('should run the fetch paginated tasks async action correctly', async () => {
    mockAxios
      .onPost()
      .reply(200, { tasks: fakeTasks, total: fakeTasks.length });

    await store.dispatch(fetchPaginatedTasks(1, 10));
    const actions = store.getActions();

    expect(actions).toEqual(
      expect.arrayContaining([
        {
          type: ADD_LOADING,
          payload: { [TASKS_TYPES.FETCH_TASKS_PAGE_REQUEST]: true },
        },
        {
          type: TASKS_TYPES.FETCH_TASKS_PAGE_SUCCESS,
          totalTasks: fakeTasks.length,
          tasks: fakeTasks,
          pageSize: 10,
          page: 1,
          name: '',
        },
        {
          type: REMOVE_LOADING,
          payload: [TASKS_TYPES.FETCH_TASKS_PAGE_REQUEST],
        },
      ])
    );
  });

  it('should handle errors in the fetch paginated tasks async action', async () => {
    mockAxios.onPost().reply(500, { message: 'Error Message' });
    await store.dispatch(fetchPaginatedTasks(1, 10));
    const actions = store.getActions();

    expect(actions).toEqual(
      expect.arrayContaining([
        {
          type: ADD_LOADING,
          payload: { [TASKS_TYPES.FETCH_TASKS_PAGE_REQUEST]: true },
        },
        {
          type: TASKS_TYPES.FETCH_TASKS_PAGE_FAIL,
        },
        {
          type: REMOVE_LOADING,
          payload: [TASKS_TYPES.FETCH_TASKS_PAGE_REQUEST],
        },
      ])
    );
  });

  it('should create the fetch tasks success action', () => {
    expect(fetchTasksSuccess(fakeTasks)).toEqual({
      type: TASKS_TYPES.FETCH_TASKS_SUCCESS,
      tasks: fakeTasks,
    });
  });

  it('should create the fetch tasks fail action', () => {
    expect(fetchTasksFail()).toEqual({
      type: TASKS_TYPES.FETCH_TASKS_FAIL,
    });
  });

  it('should run the fetch tasks async action correctly', async () => {
    mockAxios.onPost().reply(200, { tasks: fakeTasks });
    await store.dispatch(fetchTasks({ category: 'MONITORING' }));
    const actions = store.getActions();

    expect(actions).toEqual(
      expect.arrayContaining([
        {
          type: ADD_LOADING,
          payload: { [TASKS_TYPES.FETCH_TASKS_REQUEST]: true },
        },
        {
          type: TASKS_TYPES.FETCH_TASKS_SUCCESS,
          tasks: fakeTasks,
        },
        {
          type: REMOVE_LOADING,
          payload: [TASKS_TYPES.FETCH_TASKS_REQUEST],
        },
      ])
    );
  });

  it('should handle errors in the fetch tasks async action', async () => {
    mockAxios.onPost().reply(500, { message: 'Error Message' });
    await store.dispatch(fetchTasks({ category: 'MONITORING' }));
    const actions = store.getActions();

    expect(actions).toEqual(
      expect.arrayContaining([
        {
          type: ADD_LOADING,
          payload: { [TASKS_TYPES.FETCH_TASKS_REQUEST]: true },
        },
        {
          type: TASKS_TYPES.FETCH_TASKS_FAIL,
        },
        {
          type: REMOVE_LOADING,
          payload: [TASKS_TYPES.FETCH_TASKS_REQUEST],
        },
      ])
    );
  });

  it('should create the update task success action', () => {
    expect(updateTaskSuccess(fakeTask)).toEqual({
      type: TASKS_TYPES.UPDATE_TASK_SUCCESS,
      task: fakeTask,
    });
  });

  it('should create the update task fail action', () => {
    expect(updateTaskFail()).toEqual({
      type: TASKS_TYPES.UPDATE_TASK_FAIL,
    });
  });

  it('should run the update task async action correctly', async () => {
    const successCallbackMock = jest.fn();
    mockAxios.onPatch().reply(200, fakeTask);
    await store.dispatch(updateTask('1', fakeTask, successCallbackMock));
    const actions = store.getActions();

    expect(successCallbackMock).toBeCalled();

    expect(actions).toEqual(
      expect.arrayContaining([
        {
          type: ADD_LOADING,
          payload: { [TASKS_TYPES.UPDATE_TASK_REQUEST]: true },
        },
        {
          type: TASKS_TYPES.UPDATE_TASK_SUCCESS,
          task: fakeTask,
        },
        {
          type: REMOVE_LOADING,
          payload: [TASKS_TYPES.UPDATE_TASK_REQUEST],
        },
      ])
    );
  });

  it('should handle errors in the update task async action', async () => {
    mockAxios.onPatch().reply(500, { message: 'Error message' });
    await store.dispatch(updateTask('1', fakeTask));
    const actions = store.getActions();

    expect(actions).toEqual(
      expect.arrayContaining([
        {
          type: ADD_LOADING,
          payload: { [TASKS_TYPES.UPDATE_TASK_REQUEST]: true },
        },
        {
          type: TASKS_TYPES.UPDATE_TASK_FAIL,
        },
        {
          type: REMOVE_LOADING,
          payload: [TASKS_TYPES.UPDATE_TASK_REQUEST],
        },
      ])
    );
  });

  it('should create the fetch task data success action', () => {
    expect(fetchTaskDataSuccess(fakeTask)).toEqual({
      type: TASKS_TYPES.FETCH_TASK_DATA_SUCCESS,
      taskData: fakeTask,
    });
  });

  it('should create the fetch task data fail action', () => {
    expect(fetchTaskDataFail()).toEqual({
      type: TASKS_TYPES.FETCH_TASK_DATA_FAIL,
    });
  });

  it('should run the fetch task data async action correctly', async () => {
    mockAxios.onGet().reply(200, fakeTask);
    await store.dispatch(fetchTaskData('1'));
    const actions = store.getActions();

    expect(actions).toEqual(
      expect.arrayContaining([
        {
          type: ADD_LOADING,
          payload: { [TASKS_TYPES.FETCH_TASK_DATA_REQUEST]: true },
        },
        {
          type: TASKS_TYPES.FETCH_TASK_DATA_SUCCESS,
          taskData: fakeTask,
        },
        {
          type: REMOVE_LOADING,
          payload: [TASKS_TYPES.FETCH_TASK_DATA_REQUEST],
        },
      ])
    );
  });

  it('should handle errors in the fetch task data async action', async () => {
    mockAxios.onGet().reply(500, { message: 'Error Message' });
    await store.dispatch(fetchTaskData('1'));
    const actions = store.getActions();

    expect(actions).toEqual(
      expect.arrayContaining([
        {
          type: ADD_LOADING,
          payload: { [TASKS_TYPES.FETCH_TASK_DATA_REQUEST]: true },
        },
        {
          type: TASKS_TYPES.FETCH_TASK_DATA_FAIL,
        },
        {
          type: REMOVE_LOADING,
          payload: [TASKS_TYPES.FETCH_TASK_DATA_REQUEST],
        },
      ])
    );
  });

  it('should create the send task via email success action', () => {
    expect(sendTaskViaEmailSuccess()).toEqual({
      type: TASKS_TYPES.SEND_TASK_VIA_EMAIL_SUCCESS,
    });
  });

  it('should create the send task via email fail action', () => {
    expect(sendTaskViaEmailFail()).toEqual({
      type: TASKS_TYPES.SEND_TASK_VIA_EMAIL_FAIL,
    });
  });

  it('should run the send task via email async action correctly', async () => {
    const successCallbackMock = jest.fn();
    mockAxios.onPost().reply(200);
    await store.dispatch(sendTaskViaEmail('1', 'a@a.com', successCallbackMock));
    const actions = store.getActions();

    expect(successCallbackMock).toBeCalled();

    expect(actions).toEqual(
      expect.arrayContaining([
        {
          type: ADD_LOADING,
          payload: { [TASKS_TYPES.SEND_TASK_VIA_EMAIL_REQUEST]: true },
        },
        {
          type: TASKS_TYPES.SEND_TASK_VIA_EMAIL_SUCCESS,
        },
        {
          type: REMOVE_LOADING,
          payload: [TASKS_TYPES.SEND_TASK_VIA_EMAIL_REQUEST],
        },
      ])
    );
  });

  it('should handle errors in the send task via email async action', async () => {
    mockAxios.onPost().reply(500);
    await store.dispatch(sendTaskViaEmail('1', 'a@a.com'));
    const actions = store.getActions();

    expect(actions).toEqual(
      expect.arrayContaining([
        {
          type: ADD_LOADING,
          payload: { [TASKS_TYPES.SEND_TASK_VIA_EMAIL_REQUEST]: true },
        },
        {
          type: TASKS_TYPES.SEND_TASK_VIA_EMAIL_FAIL,
        },
        {
          type: REMOVE_LOADING,
          payload: [TASKS_TYPES.SEND_TASK_VIA_EMAIL_REQUEST],
        },
      ])
    );
  });

  it('should create the clear task data action', () => {
    expect(clearTaskData()).toEqual({
      type: TASKS_TYPES.CLEAR_TASK_DATA,
    });
  });

  it('should create the upload task experiment notebook success action', () => {
    expect(uploadTaskExperimentNotebookSuccess()).toEqual({
      type: TASKS_TYPES.UPLOAD_TASK_EXPERIMENT_NOTEBOOK_SUCCESS,
    });
  });

  it('should create the upload task experiment notebook fail action', () => {
    expect(uploadTaskExperimentNotebookFail()).toEqual({
      type: TASKS_TYPES.UPLOAD_TASK_EXPERIMENT_NOTEBOOK_FAIL,
    });
  });

  it('should run the upload task experiment notebook async action correctly', async () => {
    const successCallbackMock = jest.fn();
    mockAxios.onPatch().reply(200);
    const file = new File(['{"value": "text"}'], 'notebook.ipynb');
    await store.dispatch(
      uploadTaskExperimentNotebook('1', file, successCallbackMock)
    );

    const actions = store.getActions();
    expect(successCallbackMock).toBeCalled();

    expect(actions).toEqual(
      expect.arrayContaining([
        {
          type: ADD_LOADING,
          payload: {
            [TASKS_TYPES.UPLOAD_TASK_EXPERIMENT_NOTEBOOK_REQUEST]: true,
          },
        },
        {
          type: TASKS_TYPES.UPLOAD_TASK_EXPERIMENT_NOTEBOOK_SUCCESS,
        },
        {
          type: REMOVE_LOADING,
          payload: [TASKS_TYPES.UPLOAD_TASK_EXPERIMENT_NOTEBOOK_REQUEST],
        },
      ])
    );
  });

  it('should handle errors in the upload task experiment notebook async action', async () => {
    mockAxios.onPatch().reply(500);
    const file = new File(['{"value": "text"}'], 'notebook.ipynb');
    await store.dispatch(uploadTaskExperimentNotebook('1', file));
    const actions = store.getActions();

    expect(actions).toEqual(
      expect.arrayContaining([
        {
          type: ADD_LOADING,
          payload: {
            [TASKS_TYPES.UPLOAD_TASK_EXPERIMENT_NOTEBOOK_REQUEST]: true,
          },
        },
        {
          type: TASKS_TYPES.UPLOAD_TASK_EXPERIMENT_NOTEBOOK_FAIL,
        },
        {
          type: REMOVE_LOADING,
          payload: [TASKS_TYPES.UPLOAD_TASK_EXPERIMENT_NOTEBOOK_REQUEST],
        },
      ])
    );
  });

  it('should the upload task experiment notebook request fails if file content is not a valid JSON', async () => {
    const file = new File(['{ not a valid JSON }'], 'notebook.ipynb');
    await store.dispatch(uploadTaskExperimentNotebook('1', file));
    const actions = store.getActions();

    expect(actions).toEqual(
      expect.arrayContaining([
        {
          type: ADD_LOADING,
          payload: {
            [TASKS_TYPES.UPLOAD_TASK_EXPERIMENT_NOTEBOOK_REQUEST]: true,
          },
        },
        {
          type: TASKS_TYPES.UPLOAD_TASK_EXPERIMENT_NOTEBOOK_FAIL,
        },
        {
          type: REMOVE_LOADING,
          payload: [TASKS_TYPES.UPLOAD_TASK_EXPERIMENT_NOTEBOOK_REQUEST],
        },
      ])
    );
  });

  it('should create the upload task deployment notebook success action', () => {
    expect(uploadTaskDeploymentNotebookSuccess()).toEqual({
      type: TASKS_TYPES.UPLOAD_TASK_DEPLOYMENT_NOTEBOOK_SUCCESS,
    });
  });

  it('should create the upload task deployment notebook fail action', () => {
    expect(uploadTaskDeploymentNotebookFail()).toEqual({
      type: TASKS_TYPES.UPLOAD_TASK_DEPLOYMENT_NOTEBOOK_FAIL,
    });
  });

  it('should run the upload task deployment notebook async action correctly', async () => {
    const successCallbackMock = jest.fn();
    mockAxios.onPatch().reply(200);
    const file = new File(['{"value": "text"}'], 'notebook.ipynb');
    await store.dispatch(
      uploadTaskDeploymentNotebook('1', file, successCallbackMock)
    );

    const actions = store.getActions();
    expect(successCallbackMock).toBeCalled();

    expect(actions).toEqual(
      expect.arrayContaining([
        {
          type: ADD_LOADING,
          payload: {
            [TASKS_TYPES.UPLOAD_TASK_DEPLOYMENT_NOTEBOOK_REQUEST]: true,
          },
        },
        {
          type: TASKS_TYPES.UPLOAD_TASK_DEPLOYMENT_NOTEBOOK_SUCCESS,
        },
        {
          type: REMOVE_LOADING,
          payload: [TASKS_TYPES.UPLOAD_TASK_DEPLOYMENT_NOTEBOOK_REQUEST],
        },
      ])
    );
  });

  it('should handle errors in the upload task deployment notebook async action', async () => {
    mockAxios.onPatch().reply(500);
    const file = new File(['{"value": "text"}'], 'notebook.ipynb');
    await store.dispatch(uploadTaskDeploymentNotebook('1', file));
    const actions = store.getActions();

    expect(actions).toEqual(
      expect.arrayContaining([
        {
          type: ADD_LOADING,
          payload: {
            [TASKS_TYPES.UPLOAD_TASK_DEPLOYMENT_NOTEBOOK_REQUEST]: true,
          },
        },
        {
          type: TASKS_TYPES.UPLOAD_TASK_DEPLOYMENT_NOTEBOOK_FAIL,
        },
        {
          type: REMOVE_LOADING,
          payload: [TASKS_TYPES.UPLOAD_TASK_DEPLOYMENT_NOTEBOOK_REQUEST],
        },
      ])
    );
  });

  it('should the upload task deployment notebook request fails if file content is not a valid JSON', async () => {
    const file = new File(['{ not a valid JSON }'], 'notebook.ipynb');
    await store.dispatch(uploadTaskDeploymentNotebook('1', file));
    const actions = store.getActions();

    expect(actions).toEqual(
      expect.arrayContaining([
        {
          type: ADD_LOADING,
          payload: {
            [TASKS_TYPES.UPLOAD_TASK_DEPLOYMENT_NOTEBOOK_REQUEST]: true,
          },
        },
        {
          type: TASKS_TYPES.UPLOAD_TASK_DEPLOYMENT_NOTEBOOK_FAIL,
        },
        {
          type: REMOVE_LOADING,
          payload: [TASKS_TYPES.UPLOAD_TASK_DEPLOYMENT_NOTEBOOK_REQUEST],
        },
      ])
    );
  });
});
