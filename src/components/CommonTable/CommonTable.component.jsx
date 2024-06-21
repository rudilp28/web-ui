import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

import { Table, Skeleton } from 'antd';

const CommonTable = ({
  bordered,
  className,
  columns,
  dataSource,
  isLoading,
  locale,
  pagination,
  rowClassName,
  rowKey,
  rowSelection,
  scroll,
  size,
  skeletonRowsAmount,
}) => {
  const skeletonColumns = useMemo(() => {
    return columns.map((column) => {
      return {
        ...column,
        render(value, record) {
          return (
            <Skeleton
              key={`${record.uuid}-${value}`}
              size='large'
              title={false}
              active={true}
              paragraph={{ rows: 1, width: '100%' }}
            />
          );
        },
      };
    });
  }, [columns]);

  const skeletonDataSource = useMemo(() => {
    return new Array(skeletonRowsAmount).fill(0).map((_, index) => {
      const row = {
        uuid: `uuid-${index}`,
      };

      columns.forEach((column) => {
        row[column.key] = `${column.key}-${index}`;
      });

      return row;
    });
  }, [columns, skeletonRowsAmount]);

  return (
    <Table
      className={className}
      rowClassName={rowClassName}
      rowSelection={rowSelection}
      rowKey={rowKey}
      size={size}
      scroll={scroll}
      locale={locale}
      bordered={bordered}
      pagination={pagination}
      columns={isLoading ? skeletonColumns : columns}
      dataSource={isLoading ? skeletonDataSource : dataSource}
    />
  );
};

CommonTable.propTypes = {
  bordered: PropTypes.bool,
  className: PropTypes.string,
  columns: PropTypes.arrayOf(PropTypes.object).isRequired,
  dataSource: PropTypes.array,
  isLoading: PropTypes.bool,
  locale: PropTypes.object,
  pagination: PropTypes.any,
  rowClassName: PropTypes.func,
  rowKey: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  rowSelection: PropTypes.object,
  scroll: PropTypes.object,
  size: PropTypes.string,
  skeletonRowsAmount: PropTypes.number,
};

CommonTable.defaultProps = {
  bordered: false,
  className: undefined,
  rowSelection: undefined,
  isLoading: true,
  pagination: false,
  scroll: undefined,
  size: undefined,
  skeletonRowsAmount: 10,
};

export default CommonTable;
