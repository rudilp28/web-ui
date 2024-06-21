import React, { useLayoutEffect } from 'react';
import { message } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';

import {
  createTask,
  getTaskData,
  TASKS_TYPES,
  fetchTaskData,
  clearTaskData,
} from 'store/tasks';
import { useIsLoading } from 'hooks';

import MarketplaceTaskDetailsData from './MarketplaceTaskDetailsData';
import MarketplaceTaskDetailsHeader from './MarketplaceTaskDetailsHeader';
import MarketplaceTaskDetailsChanges from './MarketplaceTaskDetailsChanges';

import './MarketplaceTaskDetails.style.less';

const MarketplaceTaskDetails = () => {
  const { taskId } = useParams();
  const dispatch = useDispatch();
  const history = useHistory();

  const taskData = useSelector(getTaskData);

  const isCopyingTask = useIsLoading(TASKS_TYPES.COPY_TASK_REQUEST);
  const isLoadingTask = useIsLoading(TASKS_TYPES.FETCH_TASK_DATA_REQUEST);

  const handleGoBack = () => {
    history.goBack();
  };

  const handleSearch = (search) => {
    history.push({
      pathname: '/marketplace/tarefas',
      search: `?${new URLSearchParams({ search })}`,
    });
  };

  const handleCopyTask = () => {
    const taskCopy = { copyFrom: taskData.uuid };
    dispatch(
      createTask(taskCopy, () => {
        message.success('Tarefa copiada!');
      })
    );
  };

  useLayoutEffect(() => {
    if (taskId) dispatch(fetchTaskData(taskId));
    return () => dispatch(clearTaskData());
  }, [dispatch, taskId]);

  return (
    <div className='marketplace-task-details'>
      <MarketplaceTaskDetailsHeader
        handleGoBack={handleGoBack}
        handleSearch={handleSearch}
      />

      <div className='marketplace-task-details-content'>
        <MarketplaceTaskDetailsData
          taskData={taskData || {}}
          isLoadingTask={isLoadingTask}
          isCopyingTask={isCopyingTask}
          handleCopyTask={handleCopyTask}
        />

        <MarketplaceTaskDetailsChanges
          taskData={taskData || {}}
          isLoadingTask={isLoadingTask}
        />
      </div>
    </div>
  );
};

export default MarketplaceTaskDetails;
