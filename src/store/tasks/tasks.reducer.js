import * as TASKS_TYPES from './tasks.actionTypes';

export const initialState = {
  tasks: [],
  pageSize: 0,
  totalTasks: 0,
  taskData: null,
  page: 1,
  name: '',
};

export const tasksReducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case TASKS_TYPES.CREATE_TASK_SUCCESS:
    case TASKS_TYPES.COPY_TASK_SUCCESS: {
      const tasksListAux = [action.task, ...state.tasks];
      const sortedTasks = [...tasksListAux].sort((taskA, taskB) =>
        taskA.name.localeCompare(taskB.name, undefined, {
          numeric: true,
          sensitivity: 'base',
        })
      );

      return {
        ...state,
        tasks: sortedTasks,
      };
    }

    case TASKS_TYPES.DELETE_TASK_SUCCESS: {
      return {
        ...state,
        tasks: state.tasks.filter((task) => task.uuid !== action.id),
      };
    }

    case TASKS_TYPES.FETCH_TASKS_PAGE_SUCCESS: {
      return {
        ...state,
        tasks: action.tasks,
        totalTasks: action.totalTasks,
        pageSize: action.pageSize,
        page: action.page,
        name: action.name,
      };
    }

    case TASKS_TYPES.FETCH_TASKS_SUCCESS: {
      return {
        ...state,
        tasks: action.tasks,
        totalTasks: action.totalTasks,
      };
    }

    case TASKS_TYPES.UPDATE_TASK_SUCCESS: {
      const updatedTask = action.task;
      const tasksAux = [...state.tasks];
      const taskIndex = tasksAux.findIndex(
        (task) => task.uuid === updatedTask.uuid
      );
      tasksAux[taskIndex] = updatedTask;
      tasksAux.sort((a, b) => a.name.localeCompare(b.name));

      const canUpdateTaskData = state.taskData?.uuid === updatedTask.uuid;
      const taskData = canUpdateTaskData
        ? { ...state.taskData, ...updatedTask }
        : state.taskData;

      return {
        ...state,
        taskData,
        tasks: tasksAux,
      };
    }

    case TASKS_TYPES.CLEAR_TASK_DATA:
    case TASKS_TYPES.FETCH_TASK_DATA_FAIL: {
      return {
        ...state,
        taskData: null,
      };
    }

    case TASKS_TYPES.FETCH_TASK_DATA_SUCCESS: {
      return {
        ...state,
        taskData: action.taskData,
      };
    }

    default:
      return state;
  }
};
