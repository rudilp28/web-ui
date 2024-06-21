import React, { useEffect, useMemo } from 'react';
import { message } from 'antd';
import { useHistory } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';

import { useIsLoading } from 'hooks';
import { TASK_CATEGORIES_WITHOUT_TEMPLATES } from 'configs';
import { getTasks, fetchTasks, createTask, TASKS_TYPES } from 'store/tasks';

import NewTaskList from './NewTaskList.';
import NewTaskHeader from './NewTaskHeader';
import NewTaskSkeleton from './NewTaskSkeleton';
import NewTaskDefaultTemplates from './NewTaskDefaultTemplates';
import NewTaskMarketplacePanel from './NewTaskMarketplacePanel';

import './NewTask.style.less';

const NewTask = () => {
  const history = useHistory();
  const dispatch = useDispatch();

  const tasks = useSelector(getTasks);
  const isCreatingTask = useIsLoading(TASKS_TYPES.CREATE_TASK_REQUEST);
  const isLoadingTasks = useIsLoading(TASKS_TYPES.FETCH_TASKS_REQUEST);

  const tasksGroupedByCategory = useMemo(() => {
    return Object.values(TASK_CATEGORIES_WITHOUT_TEMPLATES).map((category) => {
      const tasksOfThisCategory = tasks.filter((task) => {
        return !!task.tags && task.tags.includes(category.key);
      });

      return {
        key: category.key,
        name: category.name,
        tasks: tasksOfThisCategory,
      };
    });
  }, [tasks]);

  const handleGoBack = () => {
    history.goBack();
  };

  const handleGoToMarketPlace = () => {
    history.replace('/marketplace'); // TODO: Put the correct route path here
  };

  const handleCreateBlankTask = () => {
    dispatch(
      createTask({ category: 'DEFAULT', hasNotebook: true }, (newTask) => {
        history.replace(`/tarefas/${newTask.uuid}`);
      })
    );
  };

  const handleCreateDockerTask = () => {
    const dockerTaskData = {
      category: 'DEFAULT',
      hasNotebook: false,
      image: 'docker.io/busybox:latest',
      commands: ['/bin/sh', '-c'],
      arguments: ['echo', "'hello world'"],
    };

    dispatch(
      createTask(dockerTaskData, (newTask) => {
        history.replace(`/tarefas/${newTask.uuid}`);
      })
    );
  };

  const handleCreateTaskCopy = (task) => {
    const taskCopy = {
      copyFrom: task.uuid,
    };

    dispatch(
      createTask(taskCopy, (newTask) => {
        history.replace(`/tarefas/${newTask.uuid}`);
      })
    );
  };

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  useEffect(() => {
    if (isCreatingTask) {
      message.loading({
        key: 'isCreatingTask',
        content: 'Criando Nova Tarefa',
      });
    } else {
      message.destroy('isCreatingTask');
    }
  }, [isCreatingTask]);

  return (
    <div className='new-task-page'>
      <NewTaskHeader handleGoBack={handleGoBack} />

      <div className='new-task-page-content'>
        <div className='new-task-page-content-panels'>
          <div className='new-task-page-content-panels-left'>
            <NewTaskDefaultTemplates
              handleCreateBlankTask={handleCreateBlankTask}
              handleCreateDockerTask={handleCreateDockerTask}
            />

            <NewTaskList
              isLoadingTasks={isLoadingTasks}
              handleCreateTaskCopy={handleCreateTaskCopy}
              tasksGroupedByCategory={tasksGroupedByCategory}
            />

            {isLoadingTasks && <NewTaskSkeleton />}
          </div>

          <NewTaskMarketplacePanel
            handleGoToMarketPlace={handleGoToMarketPlace}
          />
        </div>
      </div>
    </div>
  );
};

export default NewTask;
