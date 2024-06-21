import * as TASKS_TYPES from '../tasks.actionTypes';
import { tasksReducer, initialState } from '../tasks.reducer';

describe('Tasks Action Types', () => {
  it('should add created task in the state', () => {
    const action = {
      type: TASKS_TYPES.COPY_TASK_SUCCESS,
      task: { uuid: '1' },
    };

    const newState = tasksReducer(initialState, action);
    expect(newState.tasks).toEqual([action.task]);
  });

  it('should add created task in the state and sort tasks by task name', () => {
    const action = {
      type: TASKS_TYPES.COPY_TASK_SUCCESS,
      task: { uuid: '2', name: 'b bb bbb' },
    };

    const existingTask1 = { uuid: '1', name: 'a aa aaa' };
    const existingTask2 = { uuid: '3', name: 'c cc ccc' };

    const newState = tasksReducer(
      { ...initialState, tasks: [existingTask2, existingTask1] },
      action
    );

    expect(newState.tasks).toEqual([existingTask1, action.task, existingTask2]);
  });

  it('should remove task from the state by id', () => {
    const action = {
      type: TASKS_TYPES.DELETE_TASK_SUCCESS,
      id: '1',
    };

    const newState = tasksReducer(
      { ...initialState, tasks: [{ uuid: '1' }, { uuid: '2' }] },
      action
    );

    expect(newState.tasks).toHaveLength(1);
    expect(newState.tasks).toEqual([{ uuid: '2' }]);
  });

  it('should set pagination and search data in the state', () => {
    const action = {
      type: TASKS_TYPES.FETCH_TASKS_PAGE_SUCCESS,
      tasks: [{ uuid: '1' }],
      totalTasks: 1,
      pageSize: 1,
      page: 1,
      name: 'Task',
    };

    const newState = tasksReducer(initialState, action);

    expect(newState).toEqual({
      ...initialState,
      name: 'Task',
      tasks: action.tasks,
      totalTasks: action.totalTasks,
      pageSize: action.pageSize,
    });
  });

  it('should set tasks array in the state', () => {
    const action = {
      type: TASKS_TYPES.FETCH_TASKS_SUCCESS,
      tasks: [{ uuid: '1' }],
    };

    const newState = tasksReducer(initialState, action);
    expect(newState.tasks).toEqual(action.tasks);
  });

  it('should update a task in the array and the task data', () => {
    const action = {
      type: TASKS_TYPES.UPDATE_TASK_SUCCESS,
      task: {
        uuid: '1',
        name: 'Other Task Name',
      },
    };

    const oldTask1 = { uuid: '1', name: 'Task Name' };
    const oldTask2 = { uuid: '2', name: 'My Task' };

    const newState = tasksReducer(
      { ...initialState, tasks: [oldTask1, oldTask2], taskData: oldTask1 },
      action
    );

    expect(newState).toEqual({
      ...initialState,
      // OldTask2 comes first because the tasks array was sorted
      tasks: [oldTask2, action.task],
      taskData: action.task, // Update the taskData too
    });
  });

  it('should only update a task in the array of tasks', () => {
    const action = {
      type: TASKS_TYPES.UPDATE_TASK_SUCCESS,
      task: {
        uuid: '1',
        name: 'Other Task Name',
      },
    };

    const oldTask1 = { uuid: '1', name: 'Task Name' };
    const oldTask2 = { uuid: '2', name: 'My Task' };

    const newState = tasksReducer(
      { ...initialState, tasks: [oldTask1, oldTask2], taskData: oldTask2 },
      action
    );

    expect(newState).toEqual({
      ...initialState,
      // OldTask2 comes first because the tasks array was sorted
      tasks: [oldTask2, action.task],
      taskData: oldTask2, // Task data is the same after the update
    });
  });

  it('should clear the task data in the state', () => {
    const action = {
      type: TASKS_TYPES.CLEAR_TASK_DATA,
    };

    const newState = tasksReducer(
      { ...initialState, taskData: { uuid: '1' } },
      action
    );

    expect(newState.taskData).toEqual(initialState.taskData);
  });

  it('should clear the task data in the state when fetch request fails', () => {
    const action = {
      type: TASKS_TYPES.FETCH_TASK_DATA_FAIL,
    };

    const newState = tasksReducer(
      { ...initialState, taskData: { uuid: '1' } },
      action
    );

    expect(newState.taskData).toEqual(initialState.taskData);
  });

  it('should set the task data in the state', () => {
    const action = {
      type: TASKS_TYPES.FETCH_TASK_DATA_SUCCESS,
      taskData: {
        uuid: '1',
      },
    };

    const newState = tasksReducer(initialState, action);
    expect(newState.taskData).toEqual(action.taskData);
  });
});
