// CORE LIBS
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';

// COMPONENTS
import ExperimentFlow from './index';

// ACTIONS
import { selectOperator } from '../../../../../../store/operator/actions';
import { getTrainExperimentStatusRequest } from '../../../../../../store/pipelines/actions';

// DISPATCHS
const mapDispatchToProps = (dispatch) => {
  return {
    // show operator details action
    handleShowOperatorDetails: (operator) => dispatch(selectOperator(operator)),
    // getting training experiment status
    handleGetTrainExperimentStatus: (experimentId) =>
      dispatch(getTrainExperimentStatusRequest(experimentId)),
  };
};

// STATES
const mapStateToProps = (state) => {
  return {
    operators: state.operators,
    datasetName: state.experiment.dataset,
    loading: state.ui.experimentOperators.loading,
  };
};

// CONSTANTS
// polling time in miliseconds;
const pollingTime = 5000;

// TODO: Implementar "Conexão" Drawer
// TODO: Implementar "setagem" de parâmetros para tarefa
// TODO: Implementar excluir tarefa
/**
 * Experiment Flow Container.
 * This component is responsible for create a logic container for experiment flow
 * with redux.
 */
const ExperimentFlowContainer = ({
  operators,
  loading,
  handleShowOperatorDetails,
  handleGetTrainExperimentStatus,
}) => {
  // CONSTANTS
  // getting experiment uuid
  const { projectId, experimentId } = useParams();

  // HOOKS
  // did mount hook
  useEffect(() => {
    // polling experiment status
    const polling = setInterval(
      () => handleGetTrainExperimentStatus(experimentId),
      pollingTime
    );

    return () => clearInterval(polling);
  });

  // RENDER
  return (
    <ExperimentFlow
      components={operators}
      loading={loading}
      handleTaskBoxClick={handleShowOperatorDetails}
    />
  );
};

// EXPORT
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ExperimentFlowContainer);
