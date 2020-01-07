import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Icon } from 'antd';

import { setTemplate } from '../../../store/actions/experimentActions';

// FIXME: alterar nome do componente para nome descritivo, sugestão ProjectMenuTemplateItem
/**
 * Common project menu template item.
 */
const LeftSideMenuTemplateItem = ({
  disabled = false,
  experimentId = null,
  projectId,
  onSetTemplate,
  template,
}) => (
  <div
    onClick={() => {
      onSetTemplate(projectId, experimentId, template);
    }}
    className={`collapse-menu-items${template.disabled ? ' disabled' : ''}${
      disabled ? ' disabled' : ''
    }`}
    role='presentation'
  >
    <Icon className='icon-collapse-header' type='more' />
    {template.name}
  </div>
);

const mapStateToProps = (state) => {
  return {
    projectId: state.experiment.projectId,
    experimentId: state.experiment.uuid,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onSetTemplate: (projectId, experimentId, template) =>
      dispatch(setTemplate(projectId, experimentId, template)),
  };
};

LeftSideMenuTemplateItem.propTypes = {
  /** item is disabled */
  disabled: PropTypes.bool,
  /** current experiment id */
  experimentId: PropTypes.string,
  /** current project id */
  projectId: PropTypes.string,
  /** on set template handle function */
  onSetTemplate: PropTypes.func.isRequired,
  /** item template */
  template: PropTypes.objectOf(PropTypes.any).isRequired,
};

LeftSideMenuTemplateItem.defaultProps = {
  /** disabled prop default is null */
  disabled: false,
  /** current experiment id default is null */
  experimentId: null,
  /** current project id default is null */
  projectId: null,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LeftSideMenuTemplateItem);
