import React, { useMemo, useState } from 'react';
import { Drawer } from 'antd';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import utils from 'utils';
import { useIsLoading } from 'hooks';
import { hideOperatorResults } from 'store/ui/actions';
import { getOperatorResultDataset, OPERATOR_TYPES } from 'store/operator';
import ResultsDrawer from 'pages/Experiments/Experiment/Drawer/ResultsDrawer';

import ExperimentResultsDrawerTitle from './ExperimentResultsDrawerTitle';

const isVisibleSelector = ({ uiReducer }) => {
  return uiReducer.operatorResults.showOperatorResults;
};

const operatorIdSelector = ({ operatorReducer }) => {
  return operatorReducer.uuid;
};

const operatorDatasetSelector = ({ operatorReducer }) => {
  return operatorReducer.dataset;
};

const operatorFiguresSelector = ({ operatorReducer }) => {
  return operatorReducer.figures;
};

const operatorParametersSelector = ({ operatorReducer }) => {
  return operatorReducer.parameters;
};

const operatorParametersLatestTrainingSelector = ({ operatorReducer }) => {
  return operatorReducer.parametersLatestTraining;
};

const ExperimentResultsDrawerContainer = () => {
  const { projectId, experimentId } = useParams();
  const dispatch = useDispatch();

  const [selectedCards, setSelectedCards] = useState({});

  const isVisible = useSelector(isVisibleSelector);
  const operatorId = useSelector(operatorIdSelector);
  const operatorDataset = useSelector(operatorDatasetSelector);
  const operatorFigures = useSelector(operatorFiguresSelector);
  const operatorParameters = useSelector(operatorParametersSelector);
  const operatorParametersLatestTraining = useSelector(
    operatorParametersLatestTrainingSelector
  );

  const operatorResultsLoading = useIsLoading(
    OPERATOR_TYPES.GET_OPERATOR_FIGURES_REQUEST
  );

  const numberOfSelectedCards = useMemo(() => {
    const results = Object.values(selectedCards).filter((value) => !!value);
    return results.length;
  }, [selectedCards]);

  const datasetScrollX = useMemo(() => {
    return operatorDataset ? operatorDataset.columns.length * 100 : undefined;
  }, [operatorDataset]);

  // format results parameters to use label from parameter
  // and value from latest training
  const resultsParameters = useMemo(() => {
    const parametersArray = [];

    if (operatorParameters) {
      for (const operatorParameter of operatorParameters) {
        let valueLatestTraining = operatorParametersLatestTraining
          ? operatorParametersLatestTraining[operatorParameter.name]
          : null;

        if (Array.isArray(valueLatestTraining)) {
          valueLatestTraining = valueLatestTraining.join();
        }

        if (typeof valueLatestTraining === 'boolean') {
          valueLatestTraining = valueLatestTraining.toString();
        }

        const labelOrName = operatorParameter.label
          ? operatorParameter.label
          : operatorParameter.name;

        parametersArray.push({
          name: labelOrName,
          value: valueLatestTraining,
        });
      }
    }

    return parametersArray;
  }, [operatorParameters, operatorParametersLatestTraining]);

  const handleClose = () => {
    dispatch(hideOperatorResults());
  };

  const handleOnDatasetPageChange = (page, size) => {
    dispatch(
      getOperatorResultDataset(projectId, experimentId, operatorId, page, size)
    );
  };

  const handleDownloadResult = () => {
    utils.downloadExperimentRunResult({
      projectId,
      experimentId,
      runId: 'latest',
      operatorId,
    });
  };

  const handleSelectCard = (id) => {
    setSelectedCards((currentCards) => {
      const currentCardsClone = { ...currentCards };
      currentCardsClone[id] = !currentCardsClone[id];
      return currentCardsClone;
    });
  };

  return (
    <Drawer
      visible={isVisible}
      width={'90vw'}
      placement='right'
      footer={null}
      isFullScreen={true}
      isVisible={isVisible}
      onClose={handleClose}
      title={
        <ExperimentResultsDrawerTitle
          numberOfSelectedCards={numberOfSelectedCards}
          handleDownloadResult={handleDownloadResult}
        />
      }
      className='operator-drawer'
      bodyStyle={{ background: '#eceff1' }}
    >
      <ResultsDrawer
        dataset={operatorDataset}
        figures={operatorFigures}
        selectedCards={selectedCards}
        parameters={resultsParameters}
        loading={operatorResultsLoading}
        datasetScroll={{ x: datasetScrollX, y: 'calc(50vh - 96px)' }}
        handleSelectCard={handleSelectCard}
        handleDownloadResult={handleDownloadResult}
        onDatasetPageChange={handleOnDatasetPageChange}
      />
    </Drawer>
  );
};

export default ExperimentResultsDrawerContainer;
