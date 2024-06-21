import React from 'react';
import { Pagination } from 'antd';
import PropTypes from 'prop-types';

const TasksTablePagination = ({ pageSize, total, onChange, page }) => {
  return (
    <Pagination
      total={total}
      defaultCurrent={1}
      current={page}
      onChange={onChange}
      pageSize={pageSize}
      style={{ textAlign: 'right' }}
      pageSizeOptions={['10', '20', '30', '40', '50']}
      showSizeChanger
    />
  );
};

TasksTablePagination.propTypes = {
  pageSize: PropTypes.number,
  total: PropTypes.number,
  page: PropTypes.number,
  onChange: PropTypes.func,
};

export default TasksTablePagination;
