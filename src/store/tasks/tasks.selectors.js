export const getPageSize = ({ tasksReducer }) => {
  return tasksReducer.pageSize;
};

export const getTasks = ({ tasksReducer }) => {
  return tasksReducer.tasks;
};

export const getTotalTasks = ({ tasksReducer }) => {
  return tasksReducer.totalTasks;
};

export const getTaskData = ({ tasksReducer }) => {
  return tasksReducer.taskData;
};

export const getActualPage = ({ tasksReducer }) => {
  return tasksReducer.page;
};

export const getTaskName = ({ tasksReducer }) => {
  return tasksReducer.name;
};
