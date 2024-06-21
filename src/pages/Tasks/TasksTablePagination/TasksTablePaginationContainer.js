import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  getTaskName,
  getPageSize,
  getTotalTasks,
  getActualPage,
  fetchPaginatedTasks,
} from 'store/tasks';

import TasksTablePagination from './index';

const TasksTablePaginationContainer = () => {
  const dispatch = useDispatch();

  const pageSize = useSelector(getPageSize);
  const taskName = useSelector(getTaskName);
  const totalTasks = useSelector(getTotalTasks);
  const actualPage = useSelector(getActualPage);

  const handleChange = (page, size) => {
    if (pageSize === size) dispatch(fetchPaginatedTasks(page, size, taskName));
    else dispatch(fetchPaginatedTasks(1, size, taskName));
  };

  return (
    <TasksTablePagination
      pageSize={pageSize}
      total={totalTasks}
      page={actualPage}
      onChange={handleChange}
    />
  );
};

export default TasksTablePaginationContainer;
