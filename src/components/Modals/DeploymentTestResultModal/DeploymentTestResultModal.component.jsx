import React from 'react';
import { Modal, Skeleton } from 'antd';
import PropTypes from 'prop-types';

import DeploymentTestResultModalContent from './DeploymentTestResultModalContent';

const DeploymentTestResultModal = ({
  testResult,
  testStatus,
  isTestingFlow,
  isShowingModal,
  handleTryAgain,
  handleShowLogs,
  handleHideModal,
}) => {
  return (
    <Modal
      width='70vw'
      footer={null}
      visible={isShowingModal}
      onCancel={handleHideModal}
      title={<strong>Visualizar Resultados do Teste do Fluxo</strong>}
    >
      {isTestingFlow ? (
        <Skeleton
          size='large'
          title={false}
          active={true}
          paragraph={{ rows: 10, width: '100%' }}
        />
      ) : (
        <DeploymentTestResultModalContent
          testResult={testResult}
          testStatus={testStatus}
          handleShowLogs={handleShowLogs}
          handleTryAgain={handleTryAgain}
        />
      )}
    </Modal>
  );
};

DeploymentTestResultModal.propTypes = {
  testResult: PropTypes.object,
  testStatus: PropTypes.string,
  isTestingFlow: PropTypes.bool.isRequired,
  isShowingModal: PropTypes.bool.isRequired,
  handleTryAgain: PropTypes.func.isRequired,
  handleShowLogs: PropTypes.func.isRequired,
  handleHideModal: PropTypes.func.isRequired,
};

DeploymentTestResultModal.defaultProps = {
  testResult: null,
  testStatus: '',
};

export default DeploymentTestResultModal;
