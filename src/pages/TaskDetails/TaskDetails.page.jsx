import React, { useLayoutEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';

import {
  TASKS_TYPES,
  getTaskData,
  deleteTask,
  updateTask,
  fetchTaskData,
  clearTaskData,
  sendTaskViaEmail,
  uploadTaskExperimentNotebook,
  uploadTaskDeploymentNotebook,
} from 'store/tasks';
import { useIsLoading, useBooleanState } from 'hooks';
import { ShareTaskModal, NotebooksExplanationModal } from 'components';

import TaskDetailsForm from './TaskDetailsForm';
import TaskDetailsDocker from './TaskDetailsDocker';
import TaskDetailsHeader from './TaskDetailsHeader';
import TaskDetailsUploads from './TaskDetailsUploads';
import TaskDetailsNotebooks from './TaskDetailsNotebooks';
import TaskDetailsInfoFooter from './TaskDetailsInfoFooter';

import './TaskDetails.style.less';

const TaskDetails = () => {
  const { taskId } = useParams();
  const dispatch = useDispatch();
  const history = useHistory();

  const taskData = useSelector(getTaskData);

  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [hasEditedSomething, setHasEditedSomething] = useState(false);

  const [
    isShowingNotebooksModal,
    handleShowNotebooksModal,
    handleHideNotebooksModal,
  ] = useBooleanState(false);

  const [
    isShowingShareTaskModal,
    handleShowShareTaskModal,
    handleHideShareTaskModal,
  ] = useBooleanState(false);

  const isLoadingTask = useIsLoading(TASKS_TYPES.FETCH_TASK_DATA_REQUEST);
  const isEditingTask = useIsLoading(TASKS_TYPES.UPDATE_TASK_REQUEST);

  const isSendingTaskViaEmail = useIsLoading(
    TASKS_TYPES.SEND_TASK_VIA_EMAIL_REQUEST
  );

  const isUploadingExperimentNotebook = useIsLoading(
    TASKS_TYPES.UPLOAD_TASK_EXPERIMENT_NOTEBOOK_REQUEST
  );

  const isUploadingDeploymentNotebook = useIsLoading(
    TASKS_TYPES.UPLOAD_TASK_DEPLOYMENT_NOTEBOOK_REQUEST
  );

  const handleUploadExperimentNotebook = (fileInstance) => {
    dispatch(
      uploadTaskExperimentNotebook(taskId, fileInstance, () => {
        setUploadedFiles((currentFiles) => [...currentFiles, fileInstance]);
      })
    );
  };

  const handleUploadDeploymentNotebook = (fileInstance) => {
    dispatch(
      uploadTaskDeploymentNotebook(taskId, fileInstance, () => {
        setUploadedFiles((currentFiles) => [...currentFiles, fileInstance]);
      })
    );
  };

  const handleOpenExperimentNotebook = () => {
    if (!taskData?.name) return;
    window.open(
      `/jupyterlab/tree/tasks/${taskData.name}/?reset&open=Experiment.ipynb`
    );
  };

  const handleOpenDeploymentNotebook = () => {
    if (!taskData?.name) return;
    window.open(
      `/jupyterlab/tree/tasks/${taskData.name}/?reset&open=Deployment.ipynb`
    );
  };

  const handleDeleteTask = () => {
    dispatch(
      deleteTask(taskId, () => {
        if (history.length === 0) history.push('/tarefas');
        else history.goBack();
      })
    );
  };

  const handleEditTaskName = (taskName) => {
    if (!taskData) return;
    const taskWithNewName = { name: taskName };
    dispatch(updateTask(taskId, taskWithNewName));
  };

  const handleUpdateTaskData = (field, value) => {
    if (!taskData) return;
    const taskDataToUpdate = { [field]: value };
    const successCallback = () => setHasEditedSomething(true);
    dispatch(updateTask(taskId, taskDataToUpdate, successCallback));
  };

  const handleSendTaskCopyToEmail = (email) => {
    dispatch(sendTaskViaEmail(taskId, email, handleHideShareTaskModal));
  };

  useLayoutEffect(() => {
    if (taskId) dispatch(fetchTaskData(taskId));
    return () => {
      dispatch(clearTaskData());
    };
  }, [dispatch, taskId]);

  return (
    <div className='task-details-page'>
      <NotebooksExplanationModal
        isShowingModal={isShowingNotebooksModal}
        handleHideModal={handleHideNotebooksModal}
      />

      <ShareTaskModal
        isShowingModal={isShowingShareTaskModal}
        isSendingTaskViaEmail={isSendingTaskViaEmail}
        handleHideModal={handleHideShareTaskModal}
        handleSendTaskCopyToEmail={handleSendTaskCopyToEmail}
      />

      <TaskDetailsHeader
        taskData={taskData}
        isLoadingTask={isLoadingTask}
        isEditingTask={isEditingTask}
        handleDeleteTask={handleDeleteTask}
        hasEditedSomething={hasEditedSomething}
        handleEditTaskName={handleEditTaskName}
        handleShowShareTaskModal={handleShowShareTaskModal}
      />

      <div className='task-details-page-content'>
        <div className='task-details-page-content-panels'>
          <TaskDetailsForm
            taskData={taskData}
            handleUpdateTaskData={handleUpdateTaskData}
            isLoadingTask={isLoadingTask}
          />

          <div className='task-details-page-content-info'>
            {!isLoadingTask && !!taskData?.hasNotebook && (
              <>
                <TaskDetailsNotebooks
                  isUploadingDeploymentNotebook={isUploadingDeploymentNotebook}
                  isUploadingExperimentNotebook={isUploadingExperimentNotebook}
                  handleShowNotebooksModal={handleShowNotebooksModal}
                  handleOpenDeploymentNotebook={handleOpenDeploymentNotebook}
                  handleOpenExperimentNotebook={handleOpenExperimentNotebook}
                  handleUploadDeploymentNotebook={
                    handleUploadDeploymentNotebook
                  }
                  handleUploadExperimentNotebook={
                    handleUploadExperimentNotebook
                  }
                />

                <TaskDetailsUploads uploadedFiles={uploadedFiles} />
              </>
            )}

            {!isLoadingTask && !taskData?.hasNotebook && (
              <TaskDetailsDocker
                taskData={taskData}
                handleUpdateTaskData={handleUpdateTaskData}
              />
            )}

            {!isLoadingTask && (
              <TaskDetailsInfoFooter hasEditedSomething={hasEditedSomething} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetails;
