import React, { useMemo } from 'react';
import { Button } from 'antd';
import PropTypes from 'prop-types';
import { CopyOutlined, DownloadOutlined } from '@ant-design/icons';

import utils from 'utils';
import { CommonTable } from 'components';
import { PREDICTION_STATUS } from 'configs';

import DeploymentTestResultModalData from './DeploymentTestResultModalData';
import InferenceTestResultModalError from './DeploymentTestResultModalError';

const DeploymentTestResultModalContent = ({
  testResult,
  testStatus,
  handleShowLogs,
  handleTryAgain,
}) => {
  const canShowTable = useMemo(() => {
    const hasNames = !!testResult?.names;
    const hasNdArray = !!testResult?.ndarray;
    const hasTensorValues = !!testResult?.tensor?.values;
    const hasDataToShow = hasNdArray || hasTensorValues;
    return hasNames && hasDataToShow;
  }, [testResult?.names, testResult?.ndarray, testResult?.tensor?.values]);

  const dataArray = useMemo(() => {
    if (testResult?.ndarray) return testResult.ndarray;
    else if (testResult?.tensor?.values) {
      const shape = testResult.tensor.shape;
      const values = testResult.tensor.values;
      return utils.formatTensorValues(values, shape);
    }
    return null;
  }, [
    testResult?.ndarray,
    testResult?.tensor?.shape,
    testResult?.tensor?.values,
  ]);

  const dataSource = useMemo(() => {
    const names = testResult?.names;
    if (!dataArray || !names) return [];

    return dataArray.map((value, index) => {
      const data = { key: index };
      const isNumericValue = typeof value === 'number';
      const isStringValue = typeof value === 'string';

      names.forEach((name, nameIndex) => {
        data[name] = isNumericValue || isStringValue ? value : value[nameIndex];
      });

      return data;
    });
  }, [dataArray, testResult?.names]);

  const columns = useMemo(() => {
    if (!testResult?.names) return [];

    return testResult.names.map((name) => ({
      title: name,
      dataIndex: name,
      key: name,
      width: 100,
    }));
  }, [testResult]);

  if (!testResult && ['', PREDICTION_STATUS.FAILED].includes(testStatus)) {
    return (
      <InferenceTestResultModalError
        handleShowLogs={handleShowLogs}
        handleTryAgain={handleTryAgain}
      />
    );
  }

  return (
    <>
      {canShowTable ? (
        <CommonTable
          isLoading={false}
          columns={columns}
          dataSource={dataSource}
          rowKey={({ key }) => key}
          scroll={{ x: 800, y: 250 }}
          pagination={{
            defaultPageSize: 10,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '30', '40', '50'],
          }}
        />
      ) : (
        <div className='container-difference'>
          <DeploymentTestResultModalData testResult={testResult} />
        </div>
      )}

      <div className='predict-options-buttons'>
        <Button
          type='primary'
          icon={<CopyOutlined />}
          style={{ margin: '6px 6px 0px 0px' }}
          onClick={() => utils.copyToClipboard(testResult)}
        >
          Copiar
        </Button>

        <a
          href={utils.downloadFile(testResult)}
          download={
            utils.getSeldonObjectMimeType(testResult) === 'data:text/csv'
              ? 'predict-file.csv'
              : 'predict-file'
          }
        >
          <Button
            type='primary'
            icon={<DownloadOutlined />}
            style={{ margin: '6px 6px 0px 0px' }}
          >
            Fazer Download
          </Button>
        </a>
      </div>
    </>
  );
};

DeploymentTestResultModalContent.propTypes = {
  testResult: PropTypes.any,
  testStatus: PropTypes.string,
  handleShowLogs: PropTypes.func.isRequired,
  handleTryAgain: PropTypes.func.isRequired,
};

DeploymentTestResultModalContent.defaultProps = {
  testResult: null,
  testStatus: '',
};

export default DeploymentTestResultModalContent;
