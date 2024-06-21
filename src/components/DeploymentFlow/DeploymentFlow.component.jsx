import React, { useMemo, useState, useEffect } from 'react';
import lodash from 'lodash';
import PropTypes from 'prop-types';
import ReactFlow, { Background, Handle } from 'react-flow-renderer';

import { LogsButton } from 'components/Buttons';
import { OperatorsEmptyPlaceholder } from 'components/EmptyPlaceholders';
import Vectors, {
  nodeTypes,
  edgeTypes,
} from 'pages/Experiments/Experiment/ExperimentFlow/CustomNodes';

import DeploymentFlowBox from './DeploymentFlowBox';

import './DeploymentFlow.style.less';

const DeploymentFlow = ({
  tasks,
  loading,
  operators,
  numberOfLogs,
  selectedOperatorId,
  isLogsPanelSelected,
  handleSavePosition,
  handleSelectOperator,
  handleToggleLogsPanel,
  handleDeselectOperator,
}) => {
  const [flowInstance, setFlowInstance] = useState(null);

  const handleFitReactFlowView = (reactFlowInstance) => {
    reactFlowInstance.fitView({ includeHiddenNodes: true });
    reactFlowInstance.zoomTo(1);
  };

  const handleLoad = (reactFlowInstance) => {
    setFlowInstance(reactFlowInstance);
    handleFitReactFlowView(reactFlowInstance);
  };

  const handleDragStop = (_, task) => {
    handleSavePosition(task.id, task.position);
  };

  const dependencyGraph = useMemo(() => {
    return operators
      .map((el) => ({
        id: el.uuid,
        dep: el.dependencies,
      }))
      .reduce((obj, item) => Object.assign(obj, { [item.id]: item.dep }), {});
  }, [operators]);

  const cardsElements = useMemo(() => {
    return operators.map((operator) => {
      const arrows = operator.dependencies.map((arrow) => {
        const arrowId = `${operator.uuid}/${arrow}`;
        return {
          id: arrowId,
          target: operator.uuid,
          source: arrow,
          type: 'customEdge',
        };
      });

      const operatorOriginalTask = tasks?.find(
        ({ uuid }) => uuid === operator.taskId
      );

      const card = {
        id: operator.uuid,
        sourcePosition: 'right',
        targetPosition: 'left',
        type: 'cardNode',
        data: {
          label: (
            <div
              id={operator.uuid}
              style={{ width: 200 }}
              className='task-elements'
            >
              <DeploymentFlowBox
                operator={operator}
                title={operator.name}
                status={operator.status}
                icon={operator.icon}
                settedUp={operator.settedUp}
                operatorOriginalTask={operatorOriginalTask}
                selected={selectedOperatorId === operator.uuid}
                onEdit={handleSelectOperator}
                onSelect={handleSelectOperator}
                onDeselect={handleDeselectOperator}
                dependenciesGraph={dependencyGraph}
                leftFlowHandle={
                  <Handle
                    type='target'
                    position='left'
                    className='arrow-handler left'
                    isValidConnection={() => false}
                  />
                }
                rightFlowHandle={
                  <Handle
                    type='source'
                    position='right'
                    className='arrow-handler right'
                    isValidConnection={() => false}
                  />
                }
              />
            </div>
          ),
        },
        position: {
          x: operator.positionX,
          y: operator.positionY,
        },
      };

      return [card, ...arrows];
    });
  }, [
    dependencyGraph,
    handleDeselectOperator,
    handleSelectOperator,
    operators,
    selectedOperatorId,
    tasks,
  ]);

  // Without this useEffect, operators located on a negative X or Y will not be shown in the initial render.
  useEffect(() => {
    if (operators?.length && flowInstance) {
      handleFitReactFlowView(flowInstance);
    }
  }, [flowInstance, operators]);

  return (
    <div className='deployment-flow'>
      <ReactFlow
        deleteKeyCode={46}
        edgeTypes={edgeTypes}
        nodeTypes={nodeTypes}
        nodesConnectable={false}
        elements={lodash.flattenDeep(cardsElements)}
        onLoad={handleLoad}
        onNodeDragStop={handleDragStop}
        onPaneClick={handleDeselectOperator}
        onSelectionChange={handleDeselectOperator}
        onPaneContextMenu={(e) => e.preventDefault()}
        onlyRenderVisibleElements={false}
      >
        <Background
          variant='dots'
          gap={25}
          size={1}
          color={'#58585850'}
          style={{ backgroundColor: 'white' }}
        />

        {!operators?.length && (
          <OperatorsEmptyPlaceholder
            className='deployment-flow-empty-operators'
            loading={loading}
            placeholderWhenLoading='Aguarde...'
            placeholder='Crie um fluxo de pré-implantação para visualizar aqui'
          />
        )}

        <LogsButton
          className='deployment-flow-logs-button'
          errorCount={numberOfLogs}
          isActive={isLogsPanelSelected}
          onClick={handleToggleLogsPanel}
        />

        <Vectors />
      </ReactFlow>
    </div>
  );
};

DeploymentFlow.propTypes = {
  tasks: PropTypes.array,
  loading: PropTypes.bool,
  operators: PropTypes.array,
  numberOfLogs: PropTypes.number,
  selectedOperatorId: PropTypes.string,
  isLogsPanelSelected: PropTypes.bool,
  handleSavePosition: PropTypes.func,
  handleSelectOperator: PropTypes.func,
  handleToggleLogsPanel: PropTypes.func,
  handleDeselectOperator: PropTypes.func,
};

export default DeploymentFlow;
