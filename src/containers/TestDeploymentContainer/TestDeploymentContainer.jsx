import React, { useEffect } from 'react';
import { Button } from 'antd';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  StopOutlined,
  PlayCircleFilled,
  BarChartOutlined,
} from '@ant-design/icons';

import {
  interruptPrediction,
  getPredictionResult,
  getRunningPrediction,
  fetchPredictionRequest,
  createPredictionWithDataset,
} from 'store/prediction';
import { useBooleanState } from 'hooks';
import { TASK_CATEGORIES } from 'configs';
import { showLogsPanel } from 'store/ui/actions';
import { DeploymentTestResultModal } from 'components/Modals';
import { getDeployExperimentLogs } from 'store/deploymentLogs/actions';

const datasetOperatorUploadedFileNameSelector = ({ operatorsReducer }) => {
  const datasetOperator = operatorsReducer.find((operator) => {
    return operator.tags.includes(TASK_CATEGORIES.DATASETS.key);
  });

  const datasetParameter = datasetOperator?.parameters?.find((parameter) => {
    return parameter.name === 'dataset';
  });

  return datasetParameter?.value || '';
};

const TestDeploymentContainer = () => {
  const { projectId, deploymentId } = useParams();
  const dispatch = useDispatch();

  const [isShowingModal, handleShowModal, handleHideModal] =
    useBooleanState(false);

  const predictionResult = useSelector(
    getPredictionResult(projectId, deploymentId)
  );

  const runningPrediction = useSelector(
    getRunningPrediction(projectId, deploymentId)
  );

  const datasetOperatorUploadedFileName = useSelector(
    datasetOperatorUploadedFileNameSelector
  );

  const isTestingDeployment = !!runningPrediction;

  const handleShowLogs = () => {
    handleHideModal();
    dispatch(showLogsPanel());
    dispatch(getDeployExperimentLogs(projectId, deploymentId, false));
  };

  const handleCreatePrediction = () => {
    if (datasetOperatorUploadedFileName) {
      dispatch(
        createPredictionWithDataset(
          projectId,
          deploymentId,
          datasetOperatorUploadedFileName
        )
      );
    }
  };

  const handleTryAgain = () => {
    handleHideModal();
    handleCreatePrediction();
  };

  const handleInterruptPrediction = () => {
    dispatch(interruptPrediction(projectId, deploymentId));
  };

  useEffect(() => {
    if (runningPrediction) {
      const predictionId = runningPrediction.predictionId;
      dispatch(fetchPredictionRequest(projectId, deploymentId, predictionId));

      const polling = setInterval(() => {
        dispatch(fetchPredictionRequest(projectId, deploymentId, predictionId));
      }, 5000);

      return () => clearInterval(polling);
    }
  }, [deploymentId, dispatch, projectId, runningPrediction]);

  return (
    <>
      <DeploymentTestResultModal
        isShowingModal={isShowingModal}
        isTestingFlow={!!runningPrediction}
        testStatus={predictionResult?.status}
        testResult={predictionResult?.predictionData}
        handleShowLogs={handleShowLogs}
        handleTryAgain={handleTryAgain}
        handleHideModal={handleHideModal}
      />

      {!!predictionResult && (
        <Button
          icon={<BarChartOutlined />}
          onClick={handleShowModal}
          type='primary'
          shape='round'
        >
          Ver Resultados do Teste
        </Button>
      )}

      {isTestingDeployment ? (
        <Button
          onClick={handleInterruptPrediction}
          icon={<StopOutlined />}
          type='primary-inverse'
          shape='round'
        >
          Interromper
        </Button>
      ) : (
        <Button
          disabled={!datasetOperatorUploadedFileName}
          onClick={handleCreatePrediction}
          icon={<PlayCircleFilled />}
          type='secondary'
          shape='round'
        >
          Testar Fluxo
        </Button>
      )}
    </>
  );
};

export default TestDeploymentContainer;
