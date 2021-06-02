import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useIsLoading } from 'hooks';
import {
  TASKS_TYPES,
  createTask,
  closeTasksModal,
  getErrorMessage,
  getNewTaskRecord,
  getModalIsVisible,
  getModalValidateStatus,
} from 'store/tasks';

import NewTaskModal from './index';

const tasksSelector = ({ tasksReducer }) => {
  const tasks = tasksReducer.tasks || [];

  const filteredTasks = tasks
    .filter((itemTask) => !itemTask.tags.includes('DATASETS'))
    .sort((a, b) => a.name.localeCompare(b.name));

  filteredTasks.push({
    uuid: 'uuid',
    name: 'Template em branco',
  });

  return filteredTasks;
};

const NewTaskModalContainer = () => {
  const dispatch = useDispatch();

  const tasks = useSelector(tasksSelector);
  const visible = useSelector(getModalIsVisible);
  const errorMessage = useSelector(getErrorMessage);
  const copyTaskRecord = useSelector(getNewTaskRecord);
  const modalValidateStatus = useSelector(getModalValidateStatus);

  const isCreatingTask = useIsLoading(TASKS_TYPES.CREATE_TASK_REQUEST);

  const handleAddTask = (task) => {
    dispatch(createTask(task));
  };

  const handleCloseTasksModal = () => {
    dispatch(closeTasksModal());
  };

  return (
    <NewTaskModal
      visible={visible}
      templates={tasks}
      loading={isCreatingTask}
      errorMessage={errorMessage}
      copyTaskRecord={copyTaskRecord}
      modalValidateStatus={modalValidateStatus}
      handleNewTask={handleAddTask}
      handleCloseModal={handleCloseTasksModal}
    />
  );
};

export default NewTaskModalContainer;
