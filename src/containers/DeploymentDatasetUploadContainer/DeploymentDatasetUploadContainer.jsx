import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';

import {
  changeDataset,
  cancelDatasetUpload,
  startFileDatasetUpload,
  deleteDeploymentDatasetRequest,
} from 'store/dataset/actions';
import DATASETS_TYPES from 'store/dataset/actionTypes';
import { UploadInputBlock } from 'components/InputBlocks';
import { useDeepEqualSelector, useIsLoading } from 'hooks';

const datasetFileNameSelector = ({ datasetReducer }) => {
  return datasetReducer.filename;
};

const datasetStatusSelector = ({ datasetReducer }) => {
  return datasetReducer.status;
};

const uploadProgressSelector = ({ datasetReducer }) => {
  return datasetReducer.progress;
};

const isUploadingSelector = ({ datasetReducer }) => {
  return datasetReducer.isUploading;
};

const selectedOperatorDatasetSelector = ({ operatorReducer }) => {
  return operatorReducer.parameters.find((param) => param.name === 'dataset');
};

const DeploymentDatasetUploadContainer = () => {
  const { projectId, deploymentId } = useParams();

  const dispatch = useDispatch();

  const title = 'Arquivo local';
  const tip = 'Selecione os dados de entrada.';
  const buttonText = 'Importar';
  const actionUrl = `${process.env.REACT_APP_DATASET_API}/datasets`;

  const datasetSelected = useDeepEqualSelector(selectedOperatorDatasetSelector);
  const datasetFileName = useDeepEqualSelector(datasetFileNameSelector);
  const uploadProgress = useDeepEqualSelector(uploadProgressSelector);
  const datasetStatus = useDeepEqualSelector(datasetStatusSelector);
  const isUploading = useDeepEqualSelector(isUploadingSelector);

  const datasetsLoading = useIsLoading(DATASETS_TYPES.FETCH_DATASETS_REQUEST);

  const defaultFileList = isUploading
    ? [
        {
          uid: datasetFileName,
          name: datasetFileName,
          status: datasetStatus,
          percent: uploadProgress,
        },
      ]
    : datasetFileName && [
        {
          uid: datasetFileName,
          name: datasetFileName,
          status: 'done',
        },
      ];

  useEffect(() => {
    dispatch(changeDataset(datasetSelected));
  }, [dispatch, datasetSelected]);

  const containerHandleUploadCancel = () =>
    isUploading
      ? dispatch(cancelDatasetUpload())
      : dispatch(deleteDeploymentDatasetRequest(projectId, deploymentId));

  const customUploadHandler = (data) =>
    dispatch(startFileDatasetUpload(data.file, projectId, null, deploymentId));

  // rendering component
  return (
    <>
      <UploadInputBlock
        actionUrl={actionUrl}
        buttonText={buttonText}
        datasets={[]}
        datasetsLoading={datasetsLoading}
        handleUploadCancel={containerHandleUploadCancel}
        customRequest={customUploadHandler}
        tip={tip}
        title={title}
        defaultFileList={defaultFileList}
        deployment={true}
      />

      <p style={{ padding: '16px' }}>
        <span>OBS: O limite máximo de linhas para arquivos CSV é de </span>
        <strong>1000 linhas</strong>
        <span>.</span>
      </p>
    </>
  );
};

// EXPORT DEFAULT
export default DeploymentDatasetUploadContainer;
