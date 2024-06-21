import React, { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import utils from 'utils';
import { useIsLoading } from 'hooks';
import { fetchDatasetsRequest } from 'store/datasets/actions';
import DATASETS_TYPES from 'store/datasets/actionTypes';
import DATASET_TYPES from 'store/dataset/actionTypes';
import {
  UploadInputBlock,
  GoogleUploadInputBlock,
} from 'components/InputBlocks';
import {
  selectDataset,
  cancelDatasetUpload,
  deleteDatasetRequest,
  startFileDatasetUpload,
  startGoogleDatasetUpload,
} from 'store/dataset/actions';

const datasetsSelector = ({ datasetsReducer }) => {
  return datasetsReducer;
};

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

const datasetNameSelector = ({ datasetReducer }) => {
  return datasetReducer.name;
};

const operatorTaskNameSelector = ({ operatorReducer }) => {
  return operatorReducer?.task?.name || '';
};

const isDisabledSelector = ({ uiReducer }) => {
  return uiReducer.experimentTraining.loading;
};

const operatorsSelector = ({ operatorsReducer }) => {
  return operatorsReducer;
};

const tip = 'Selecione os dados de entrada.';
const title = 'Dados de entrada';
const buttonText = 'Importar';
const actionUrl = `${process.env.REACT_APP_DATASET_API}/datasets`;

const DatasetUploadInputBlockContainer = () => {
  const { projectId, experimentId } = useParams();
  const dispatch = useDispatch();

  const operatorTaskName = useSelector(operatorTaskNameSelector);
  const datasetFileName = useSelector(datasetFileNameSelector);
  const uploadProgress = useSelector(uploadProgressSelector);
  const datasetStatus = useSelector(datasetStatusSelector);
  const isUploading = useSelector(isUploadingSelector);
  const datasetName = useSelector(datasetNameSelector);
  const isDisabled = useSelector(isDisabledSelector);
  const operators = useSelector(operatorsSelector);
  const datasets = useSelector(datasetsSelector);

  const datasetsLoading = useIsLoading(DATASETS_TYPES.FETCH_DATASETS_REQUEST);

  const isLoading = useIsLoading(
    DATASET_TYPES.FETCH_DATASET_COLUMNS_REQUEST,
    DATASET_TYPES.CREATE_DATASET_REQUEST,
    DATASET_TYPES.UPDATE_DATASET_COLUMN_REQUEST,
    DATASET_TYPES.GET_DATASET_REQUEST,
    DATASET_TYPES.DELETE_DATASET_REQUEST,
    DATASET_TYPES.FETCH_PAGINATED_DATASET
  );

  const defaultFileList = useMemo(() => {
    return isUploading
      ? [
          {
            uid: datasetFileName,
            name: datasetFileName,
            status: datasetStatus,
            percent: uploadProgress,
          },
        ]
      : datasetName && [
          {
            uid: datasetName,
            name: datasetName,
            status: 'done',
          },
        ];
  }, [
    datasetFileName,
    datasetName,
    datasetStatus,
    isUploading,
    uploadProgress,
  ]);

  const isGoogleDrive = useMemo(() => {
    const expectedTaskName = 'Google Drive'.toLowerCase();
    return operatorTaskName.toLowerCase().includes(expectedTaskName);
  }, [operatorTaskName]);

  const experimentIsSucceeded = useMemo(() => {
    return utils.checkExperimentSuccess({ operators });
  }, [operators]);

  const handleUploadCancel = () => {
    if (isUploading) dispatch(cancelDatasetUpload());
    else dispatch(deleteDatasetRequest(projectId, experimentId));
  };

  const handleSelectDataset = (dataset) => {
    dispatch(selectDataset(dataset, projectId, experimentId));
  };

  const handleCustomRequest = (data) => {
    dispatch(startFileDatasetUpload(data.file, projectId, experimentId));
  };

  const handleGoogleDataset = (file) => {
    dispatch(startGoogleDatasetUpload(file, projectId, experimentId));
  };

  useEffect(() => {
    dispatch(fetchDatasetsRequest());
  }, [dispatch]);

  return isGoogleDrive ? (
    <GoogleUploadInputBlock
      tip={tip}
      title={title}
      isLoading={isLoading}
      isDisabled={isDisabled}
      defaultFileList={defaultFileList}
      experimentIsSucceeded={experimentIsSucceeded}
      handleCreateGoogleDataset={handleGoogleDataset}
      handleUploadCancel={handleUploadCancel}
    />
  ) : (
    <UploadInputBlock
      tip={tip}
      title={title}
      datasets={datasets}
      actionUrl={actionUrl}
      isLoading={isLoading}
      isDisabled={isDisabled}
      buttonText={buttonText}
      defaultFileList={defaultFileList}
      datasetsLoading={datasetsLoading}
      customRequest={handleCustomRequest}
      handleSelectDataset={handleSelectDataset}
      experimentIsSucceeded={experimentIsSucceeded}
      handleUploadCancel={handleUploadCancel}
    />
  );
};

export default DatasetUploadInputBlockContainer;
