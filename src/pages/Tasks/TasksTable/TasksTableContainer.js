import React, { useLayoutEffect } from 'react';
import { ConfigProvider } from 'antd';
import { useDispatch, useSelector } from 'react-redux';

import { useIsLoading } from 'hooks';
import { TASK_CATEGORIES } from 'configs';
import { TasksEmptyPlaceholder } from 'components/EmptyPlaceholders';
import {
  TASKS_TYPES,
  deleteTask,
  createTask,
  getPageSize,
  fetchPaginatedTasks,
} from 'store/tasks';

import TasksTable from './index';
import { useHistory } from 'react-router';
import TasksTablePaginationContainer from '../TasksTablePagination/TasksTablePaginationContainer';

const tasksSelector = ({ tasksReducer }) => {
  const tasks = tasksReducer.tasks || [];
  return tasks.filter((task) => {
    return task.tags.indexOf(TASK_CATEGORIES.DATASETS) <= -1;
  });
};

const TasksTableContainer = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const tasks = useSelector(tasksSelector);
  const pageSize = useSelector(getPageSize);

  const isLoadingOrDeleting = useIsLoading(
    TASKS_TYPES.FETCH_TASKS_PAGE_REQUEST,
    TASKS_TYPES.DELETE_TASK_REQUEST
  );

  const handleSeeTaskCode = (taskName) => {
    window.open(
      `/jupyterlab/tree/tasks/${taskName}/?reset&open=Experiment.ipynb,Deployment.ipynb`
    );
  };

  const handleDeleteTask = (id) => {
    dispatch(deleteTask(id));
  };

  const handleCopyTask = (task) => {
    const taskCopy = {
      copyFrom: task.uuid,
    };

    dispatch(
      createTask(taskCopy, (newTask) => {
        history.push(`/tarefas/${newTask.uuid}`);
      })
    );
  };

  const handleOpenTaskDetails = (task) => {
    history.push(`/tarefas/${task.uuid}`);
  };

  const handleSearchTasks = (search) => {
    dispatch(fetchPaginatedTasks(1, pageSize, search));
  };

  useLayoutEffect(() => {
    dispatch(fetchPaginatedTasks(1, 10));
  }, [dispatch]);

  return (
    <div className='tasksContainer'>
      <ConfigProvider renderEmpty={() => <TasksEmptyPlaceholder />}>
        <TasksTable
          tasks={tasks}
          isLoading={isLoadingOrDeleting}
          handleCopyTask={handleCopyTask}
          handleDeleteTask={handleDeleteTask}
          handleSeeTaskCode={handleSeeTaskCode}
          handleSearchTasks={handleSearchTasks}
          handleOpenTaskDetails={handleOpenTaskDetails}
        />
      </ConfigProvider>

      <br />

      <TasksTablePaginationContainer />
    </div>
  );
};

export default TasksTableContainer;
