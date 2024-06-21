import React, { useEffect, useRef } from 'react';
import { Button } from 'antd';
import { CSVLink } from 'react-csv';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { DownloadOutlined, LoadingOutlined } from '@ant-design/icons';

import utils from 'utils';
import { useIsLoading } from 'hooks';
import { downloadOperatorResultDataset, OPERATOR_TYPES } from 'store/operator';

const operatorSelector = ({ operatorReducer }) => {
  return operatorReducer;
};

const downloadDatasetSelector = ({ operatorReducer }) => {
  return operatorReducer.downloadDataset;
};

const DownloadOperatorDatasetContainer = () => {
  const { projectId, experimentId } = useParams();
  const dispatch = useDispatch();
  const csvLinkRef = useRef();

  const operator = useSelector(operatorSelector);
  const downloadDataset = useSelector(downloadDatasetSelector);

  const isDownloadingDataset = useIsLoading(
    OPERATOR_TYPES.DOWNLOAD_OPERATOR_DATASET_RESULT_REQUEST
  );

  const handleDownloadOperatorResultDataset = (operatorId) => {
    dispatch(
      downloadOperatorResultDataset(projectId, experimentId, operatorId)
    );
  };

  const handleDownload = () => {
    if (downloadDataset && downloadDataset.length > 0) {
      csvLinkRef.current.link.click();
    } else {
      handleDownloadOperatorResultDataset(operator.uuid);
    }
  };

  useEffect(() => {
    const handleCSVLinkClick = async () => {
      // This is necessary to wait csv link button to render with the new data
      await utils.sleep(1000);
      csvLinkRef.current.link.click();
    };

    if (downloadDataset && downloadDataset.length > 0) {
      handleCSVLinkClick();
    }
  }, [downloadDataset]);

  return (
    <>
      <CSVLink
        data={downloadDataset ? downloadDataset : []}
        filename={'resultDataset.csv'}
        ref={csvLinkRef}
      />

      <Button
        disabled={isDownloadingDataset}
        onClick={handleDownload}
        type={'default'}
      >
        {isDownloadingDataset ? <LoadingOutlined /> : <DownloadOutlined />}
        Fazer download do dataset
      </Button>
    </>
  );
};

export default DownloadOperatorDatasetContainer;
