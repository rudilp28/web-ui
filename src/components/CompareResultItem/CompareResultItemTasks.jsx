import React, { useMemo } from 'react';
import { Select, Skeleton } from 'antd';
import PropTypes from 'prop-types';

import './CompareResultItem.less';

const CompareResultItemTasks = ({
  selectedExperiment,
  trainingDetail,
  compareResult,
  onUpdate,
  tasks,
}) => {
  const trainingOperatorKeys = useMemo(() => {
    if (!trainingDetail?.operators) return [];
    return Object.keys(trainingDetail.operators);
  }, [trainingDetail?.operators]);

  const selectedExperimentOperators = useMemo(() => {
    const operatorsObject = {};
    selectedExperiment?.operators?.forEach((operator) => {
      operatorsObject[operator.uuid] = operator;
    });
    return operatorsObject;
  }, [selectedExperiment?.operators]);

  const trainingTasks = useMemo(() => {
    const tasksObject = {};
    tasks?.forEach((task) => {
      tasksObject[task.uuid] = task;
    });
    return tasksObject;
  }, [tasks]);

  const handleChange = (value) => {
    const updatedCompareResult = { ...compareResult, operatorId: value };
    onUpdate(updatedCompareResult, true);
  };

  const getSelectLabel = (operatorName, taskName) => {
    if (operatorName) return operatorName;
    else if (taskName) return `${taskName} - (Tarefa Excluída)`;
    return '* Tarefa Excluída *';
  };

  if (!compareResult.runId || !selectedExperiment) {
    return (
      <Skeleton
        size='large'
        title={false}
        active={true}
        paragraph={{ rows: 1, width: '100%' }}
      />
    );
  }

  return (
    <>
      <Select
        key={compareResult.operatorId}
        onChange={handleChange}
        optionLabelProp='label'
        style={{ width: '100%' }}
        placeholder={'Selecione a tarefa'}
        defaultValue={compareResult.operatorId}
      >
        {trainingOperatorKeys.map((key) => {
          const operator = selectedExperimentOperators[key] || {};
          const trainingOperator = trainingDetail.operators[key];
          const task = trainingTasks[trainingOperator.taskId] || {};
          const selectLabel = getSelectLabel(operator.name, task.name);

          return (
            <Select.Option key={key} value={key} label={selectLabel}>
              {selectLabel}
            </Select.Option>
          );
        })}
      </Select>
      <br />
      <br />
    </>
  );
};

CompareResultItemTasks.propTypes = {
  selectedExperiment: PropTypes.object,
  trainingDetail: PropTypes.object,
  compareResult: PropTypes.object,
  onUpdate: PropTypes.func,
  tasks: PropTypes.array,
};

export default CompareResultItemTasks;
