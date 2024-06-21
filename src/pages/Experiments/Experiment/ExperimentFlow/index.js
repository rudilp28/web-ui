import React, { useMemo, useState, useEffect } from 'react';
import lodash from 'lodash';
import PropTypes from 'prop-types';
import { DropTarget } from 'react-dnd';
import ReactFlow, { Background } from 'react-flow-renderer';

import TaskBox from 'components/TaskBox';
import { LogsButton } from 'components/Buttons';
import { OperatorsEmptyPlaceholder } from 'components/EmptyPlaceholders';

import Vectors, { nodeTypes, edgeTypes } from './CustomNodes';

import './style.less';

const ExperimentFlow = ({
  tasks,
  operators,
  isOver,
  canDrop,
  flowLoading,
  operatorLoading,
  arrowConfigs,
  numberOfLogs,
  connectDropTarget,
  isLogsPanelSelected,
  handleTaskBoxClick,
  handleSavePosition,
  handleToggleLogsPanel,
  handleSaveDependencies,
  handleDeselectOperator,
  handleRemoveOperator,
}) => {
  const [connectClass, setConnectClass] = useState('');
  const [flowInstance, setFlowInstance] = useState(null);

  const handleFitReactFlowView = (reactFlowInstance) => {
    reactFlowInstance.fitView({ includeHiddenNodes: true });
    reactFlowInstance.zoomTo(1);
  };

  const handleLoad = (reactFlowInstance) => {
    setFlowInstance(reactFlowInstance);
    handleFitReactFlowView(reactFlowInstance);
  };

  const handleConnect = (params) => {
    const targetTask = operators.find(({ uuid }) => uuid === params.target);
    const targetDependencies = targetTask.dependencies;
    handleSaveDependencies(params.target, [
      ...targetDependencies,
      params.source,
    ]);
  };

  const handleDeleteConnection = (target, source) => {
    const targetTask = operators.find((el) => el.uuid === target);
    const targetDependencies = targetTask.dependencies;
    const filteredDependencies = targetDependencies.filter(
      (dep) => dep !== source
    );

    handleSaveDependencies(target, filteredDependencies);
  };

  const handleDeleteOperator = (elements) => {
    const element = elements[0];
    if (element.type !== 'cardNode') {
      handleDeleteConnection(element.target, element.source);
    } else if (element.type == 'cardNode') {
      handleRemoveOperator();
    }
  };

  const handleDragStop = (_, task) => {
    handleSavePosition(task.id, task.position);
  };

  const isActive = useMemo(() => {
    return canDrop && isOver;
  }, [canDrop, isOver]);

  const backgroundColor = useMemo(() => {
    if (isActive) return 'rgba(20,250,20,0.1)';
    else if (canDrop) return 'rgba(250,20,20,0.1)';
    return '#ffffff';
  }, [canDrop, isActive]);

  const cardsElements = operators.map((operator) => {
    const arrows = operator.dependencies.map((arrow) => {
      const arrowId = `${operator.uuid}/${arrow}`;
      return {
        id: arrowId,
        type: 'customEdge',
        target: operator.uuid,
        source: arrow,
        animated: arrowId === arrowConfigs.uuid ? arrowConfigs.loading : false,
        data: {
          onDelete: handleDeleteConnection,
        },
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
            <TaskBox
              operator={operator}
              operatorOriginalTask={operatorOriginalTask}
              handleClick={handleTaskBoxClick}
              onConnectingClass={connectClass}
              dependenciesGraph={operators
                .map((el) => ({
                  id: el.uuid,
                  dep: el.dependencies,
                }))
                .reduce(
                  (obj, item) => Object.assign(obj, { [item.id]: item.dep }),
                  {}
                )}
              {...operator}
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

  const cursorStyle = operatorLoading ? { cursor: 'wait' } : {};
  const emptyOperators = operators.length === 0;

  // Without this useEffect, operators located on a negative X or Y will not be shown in the initial render.
  useEffect(() => {
    if (operators?.length && flowInstance) {
      handleFitReactFlowView(flowInstance);
    }
  }, [flowInstance, operators?.length]);

  return (
    <div
      className='experiment-flow'
      style={cursorStyle}
      ref={connectDropTarget}
    >
      <ReactFlow
        deleteKeyCode={46}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        nodesConnectable={true}
        elements={lodash.flattenDeep(cardsElements)}
        onLoad={handleLoad}
        onConnect={handleConnect}
        onNodeDragStop={handleDragStop}
        onPaneClick={handleDeselectOperator}
        onConnectEnd={() => setConnectClass('')}
        onSelectionChange={handleDeselectOperator}
        onPaneContextMenu={(e) => e.preventDefault()}
        onConnectStart={() => setConnectClass('Connecting')}
        onElementsRemove={handleDeleteOperator}
        onlyRenderVisibleElements={false}
      >
        <Background
          gap={25}
          size={1}
          variant='dots'
          color={'#58585850'}
          style={{ backgroundColor }}
        />

        {emptyOperators && (
          <OperatorsEmptyPlaceholder
            className='experiment-flow-empty-operators'
            loading={flowLoading}
            placeholderWhenLoading='Aguarde...'
            placeholder='Para criar um fluxo, arraste e solte as tarefas aqui'
          />
        )}

        <LogsButton
          className='experiment-flow-logs-button'
          errorCount={numberOfLogs}
          isActive={isLogsPanelSelected}
          onClick={handleToggleLogsPanel}
        />

        <Vectors />
      </ReactFlow>
    </div>
  );
};

ExperimentFlow.propTypes = {
  tasks: PropTypes.array.isRequired,
  operators: PropTypes.array.isRequired,
  flowLoading: PropTypes.bool.isRequired,
  operatorLoading: PropTypes.bool.isRequired,
  canDrop: PropTypes.bool.isRequired,
  isOver: PropTypes.bool.isRequired,
  numberOfLogs: PropTypes.number.isRequired,
  arrowConfigs: PropTypes.object.isRequired,
  connectDropTarget: PropTypes.oneOfType([PropTypes.object, PropTypes.func])
    .isRequired,
  isLogsPanelSelected: PropTypes.bool.isRequired,
  handleSavePosition: PropTypes.func.isRequired,
  handleTaskBoxClick: PropTypes.func.isRequired,
  handleToggleLogsPanel: PropTypes.func.isRequired,
  handleDeselectOperator: PropTypes.func.isRequired,
  handleSaveDependencies: PropTypes.func.isRequired,
  handleRemoveOperator: PropTypes.func.isRequired,
};

const ExperimentFlowDrop = DropTarget(
  'TASK',
  {
    canDrop(props) {
      return !props.loading;
    },
    drop: (props, monitor) => {
      const delta = monitor.getClientOffset();
      delta.x = delta.x ?? 435;
      delta.y = delta.y ?? 189;

      const offset = {
        x: props.transformations[0],
        y: props.transformations[1],
        zoom: props.transformations[2],
      };

      const positions = { x: delta.x - 435, y: delta.y - 189 };

      const zoomRealPosition = {
        x: (positions.x - offset.x) / offset.zoom,
        y: (positions.y - offset.y) / offset.zoom,
      };

      return {
        name: 'Flow',
        pos: zoomRealPosition,
      };
    },
  },
  (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop(),
  })
)(ExperimentFlow);

export default ExperimentFlowDrop;
