import React from 'react';
import { Tooltip } from 'antd';
import PropTypes from 'prop-types';

import StatusTooltip from './Tooltip';
import DropdownMenu from './DropdownMenu';

import './style.less';

const DeploymentFlowBox = (props) => {
  const {
    title,
    icon,
    settedUp,
    status,
    selected,
    onSelect,
    onDeselect,
    operator,
    leftFlowHandle,
    rightFlowHandle,
    onEdit,
    operatorOriginalTask,
  } = props;

  const settedUpClass = settedUp ? 'setted-up' : '';
  const statusClass = status?.toLowerCase();
  const selectedClass = selected ? 'selected' : '';
  const mainClassName = `card ${settedUpClass} ${statusClass} ${selectedClass}`;

  const canShowTheOperatorOriginalName =
    !!operatorOriginalTask?.name && operatorOriginalTask.name !== title;

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (selected) onDeselect(operator);
    else onSelect(operator);
  };

  const handleEdit = () => {
    onEdit(operator);
  };

  return (
    <DropdownMenu onEdit={handleEdit}>
      <div className='deploymentFlowBox'>
        <div
          className={mainClassName}
          onClick={handleClick}
          role='presentation'
        >
          <div className='siders'>
            {leftFlowHandle}

            <Tooltip
              placement='left'
              title={
                canShowTheOperatorOriginalName
                  ? `Nome Original: ${operatorOriginalTask.name}`
                  : ''
              }
            >
              <div className='icon'>{icon}</div>
            </Tooltip>
          </div>

          <div className='middle'>
            <div className='ellipsis'>{title}</div>
          </div>

          <div className='siders'>
            <StatusTooltip status={status} />
            {rightFlowHandle}
          </div>
        </div>
      </div>
    </DropdownMenu>
  );
};

DeploymentFlowBox.propTypes = {
  icon: PropTypes.node.isRequired,
  leftFlowHandle: PropTypes.node,
  onDeselect: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
  operator: PropTypes.object.isRequired,
  rightFlowHandle: PropTypes.node,
  selected: PropTypes.bool,
  settedUp: PropTypes.bool,
  status: PropTypes.oneOf([
    '',
    'Running',
    'Pending',
    'Interrupted',
    'Succeeded',
    'Failed',
    'Waiting',
    'Ready',
    'Setted up',
  ]),
  title: PropTypes.string.isRequired,
  operatorOriginalTask: PropTypes.object,
};

DeploymentFlowBox.defaultProps = {
  settedUp: false,
  status: '',
  selected: false,
  leftFlowHandle: undefined,
  rightFlowHandle: undefined,
  operatorOriginalTask: null,
};

export default DeploymentFlowBox;
