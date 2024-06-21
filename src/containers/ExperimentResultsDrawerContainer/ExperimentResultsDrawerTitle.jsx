import React from 'react';
import PropTypes from 'prop-types';
import { Button, Divider, Space, Tooltip } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';

const ExperimentResultsDrawerTitle = ({
  numberOfSelectedCards,
  handleDownloadResult,
}) => {
  const resultText = numberOfSelectedCards === 1 ? 'Resultado' : 'Resultados';

  return (
    <Space>
      <span>
        <strong>Visualizar Resultados</strong>
      </span>

      <Divider type='vertical' />

      <Tooltip placement='bottom' title='Faz download dos resultados exibidos'>
        <Button
          shape='round'
          type='primary-inverse'
          onClick={handleDownloadResult}
        >
          <DownloadOutlined />
          <span>Fazer download</span>
        </Button>
      </Tooltip>

      {numberOfSelectedCards > 0 && (
        <Tooltip
          placement='bottom'
          title='Faz download dos resultados selecionados'
        >
          <Button
            shape='round'
            type='primary-inverse'
            onClick={handleDownloadResult}
          >
            <DownloadOutlined />
            <span>
              Fazer download de {numberOfSelectedCards} {resultText}
            </span>
          </Button>
        </Tooltip>
      )}
    </Space>
  );
};

ExperimentResultsDrawerTitle.propTypes = {
  numberOfSelectedCards: PropTypes.number,
  handleDownloadResult: PropTypes.func,
};

ExperimentResultsDrawerTitle.defaultProps = {
  numberOfSelectedCards: 0,
  handleDownloadResult: null,
};

export default ExperimentResultsDrawerTitle;
