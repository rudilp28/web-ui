import React, { useMemo } from 'react';
import { Pagination } from 'antd';
import PropTypes from 'prop-types';

import { CommonTable } from 'components';

const DatasetResult = ({ title, dataset, onDatasetPageChange, scroll }) => {
  const rowsWithId = useMemo(() => {
    if (!dataset.rows) return [];
    return dataset.rows.map((row, index) => ({
      ...row,
      uuid: `uuid-${index}`,
    }));
  }, [dataset.rows]);

  return (
    <div>
      {title && (
        <p>
          <strong>{title}</strong>
        </p>
      )}

      <CommonTable
        size={'middle'}
        scroll={scroll}
        columns={dataset.columns}
        isLoading={false}
        dataSource={rowsWithId}
        rowKey={(record) => record.uuid}
      />

      <br />

      <Pagination
        defaultCurrent={1}
        defaultPageSize={10}
        current={dataset.currentPage}
        pageSize={dataset.pageSize}
        total={dataset.total}
        onChange={onDatasetPageChange}
        onShowSizeChange={onDatasetPageChange}
        style={{ textAlign: 'right' }}
        showSizeChanger
        pageSizeOptions={['10', '20', '30', '40', '50']}
      />
    </div>
  );
};

DatasetResult.propTypes = {
  title: PropTypes.string,
  scroll: PropTypes.object,
  dataset: PropTypes.object,
  onDatasetPageChange: PropTypes.func,
};

DatasetResult.defaultProps = {
  title: '',
  scroll: undefined,
  dataset: {},
  onPageChange: null,
};

export default DatasetResult;
