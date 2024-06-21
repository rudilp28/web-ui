import React from 'react';

import { ExperimentResultsDrawerContainer } from 'containers';

import ExperimentFlowContainer from './ExperimentFlow/ExperimentFlowContainer';

const Experiment = () => {
  return (
    <>
      <ExperimentResultsDrawerContainer />
      <ExperimentFlowContainer />;
    </>
  );
};

export default Experiment;
