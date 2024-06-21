import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Empty, Spin, Tabs, Button } from 'antd';
import { LoadingOutlined, DownloadOutlined } from '@ant-design/icons';

import { CommonTable, PlotResult, DatasetResult } from 'components';
import { DownloadOperatorDatasetContainer } from 'containers';

import './ResultData.less';

const parametersColumns = [
  {
    title: 'Parâmetro',
    dataIndex: 'name',
    key: 'parameter',
    render(val) {
      return <span style={{ fontWeight: 'bold' }}>{val}</span>;
    },
  },
  {
    title: 'Valor',
    dataIndex: 'value',
    key: 'value',
    render(val) {
      return <span style={{ fontFamily: 'monospace' }}>{val}</span>;
    },
  },
];

const ResultData = ({
  activeKey,
  dataset,
  datasetScroll,
  figures,
  isToShowDownloadButtons,
  loading,
  onDatasetPageChange,
  onTabChange,
  parameters,
  resultsTabStyle,
  scroll,
  handleDownloadResult,
}) => {
  const hasResult = useMemo(() => {
    return figures.length > 0 || parameters.length > 0 || dataset;
  }, [dataset, figures.length, parameters.length]);

  if (loading) {
    return (
      <div className='result-data'>
        <Spin indicator={<LoadingOutlined />} />
      </div>
    );
  }

  if (!hasResult) {
    return (
      <div className='result-data'>
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description='Não existem resultados!'
        />
      </div>
    );
  }

  return (
    <div className='result-data'>
      {isToShowDownloadButtons && (
        <Button
          className='download-result-button'
          onClick={handleDownloadResult}
          type='default'
        >
          <DownloadOutlined />
          <span>Fazer download do resultado</span>
        </Button>
      )}

      <Tabs defaultActiveKey={activeKey} onChange={onTabChange}>
        {figures.map((result, index) => {
          return (
            <Tabs.TabPane tab={`Figura ${index + 1}`} key={index}>
              <div style={resultsTabStyle}>
                <div className='tab-content'>
                  <PlotResult key={result.uuid} plotUrl={result.plotUrl} />
                </div>
              </div>
            </Tabs.TabPane>
          );
        })}

        <Tabs.TabPane
          disabled={!dataset}
          key={figures.length + 1}
          tab={<span>Dataset</span>}
        >
          {!!dataset && (
            <DatasetResult
              dataset={dataset}
              scroll={datasetScroll}
              onDatasetPageChange={onDatasetPageChange}
            />
          )}

          {isToShowDownloadButtons && <DownloadOperatorDatasetContainer />}
        </Tabs.TabPane>

        <Tabs.TabPane
          key={figures.length + 3}
          tab={<span>Parâmetros</span>}
          disabled={parameters.length <= 0}
        >
          <CommonTable
            scroll={scroll}
            isLoading={false}
            dataSource={parameters}
            columns={parametersColumns}
            rowKey={(record) => record.name}
            bordered
          />
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
};

ResultData.propTypes = {
  activeKey: PropTypes.string,
  dataset: PropTypes.object,
  datasetScroll: PropTypes.object,
  figures: PropTypes.array.isRequired,
  isToShowDownloadButtons: PropTypes.bool,
  loading: PropTypes.bool.isRequired,
  onDatasetPageChange: PropTypes.func.isRequired,
  onTabChange: PropTypes.func,
  parameters: PropTypes.array,
  scroll: PropTypes.object,
  resultsTabStyle: PropTypes.object,
  handleDownloadResult: PropTypes.func,
};

ResultData.defaultProps = {
  activeKey: '1',
  scroll: undefined,
  resultsTabStyle: undefined,
  onTabChange: undefined,
};

export default ResultData;
