import React from 'react';
import { Card } from 'antd';
import PropTypes from 'prop-types';
import { withResizeDetector } from 'react-resize-detector';

import OperatorResultItemTitle from './OperatorResultItemTitle';

import './OperatorResult.less';

const OperatorResultItem = ({
  cardId,
  children,
  isSelected,
  selectedResult,
  availableResults,
  isDownloadDisabled,
  handleSelectCard,
  handleSelectResult,
  handleRemoveResult,
}) => {
  return (
    <Card
      className='operator-result-item'
      title={
        <OperatorResultItemTitle
          cardId={cardId}
          isSelected={isSelected}
          selectedResult={selectedResult}
          availableResults={availableResults}
          isDownloadDisabled={isDownloadDisabled}
          handleSelectCard={handleSelectCard}
          handleSelectResult={handleSelectResult}
          handleRemoveResult={handleRemoveResult}
        />
      }
    >
      {children}
    </Card>
  );
};

OperatorResultItem.propTypes = {
  cardId: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  isSelected: PropTypes.bool.isRequired,
  selectedResult: PropTypes.number,
  availableResults: PropTypes.array.isRequired,
  isDownloadDisabled: PropTypes.array,
  handleSelectCard: PropTypes.func.isRequired,
  handleRemoveResult: PropTypes.func.isRequired,
  handleSelectResult: PropTypes.func.isRequired,
};

OperatorResultItem.defaultProps = {
  selectedResult: undefined,
  isDownloadDisabled: false,
};

export default withResizeDetector(OperatorResultItem);
