import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { ConfigProvider, Drawer as AntDrawer, Tabs, Skeleton } from 'antd';

import { CommonTable } from 'components';

const LogsDrawer = ({ handleClose, isLoading, isVisible, logs, title }) => {
  const renderEmpty = () => <span>Não há dados.</span>;

  const logsGroupedByTitle = useMemo(() => {
    const logsObject = {};

    logs.forEach((element) => {
      if (!logsObject[element.title]) {
        logsObject[element.title] = [];
      }

      logsObject[element.title].push(element);
    });

    return logsObject;
  }, [logs]);

  const logsTableColumns = [
    {
      dataIndex: 'createdAt',
      key: 'createdAt',
      title: 'Data',
      width: 175,
      render: (value) => {
        // The value of timestamp is incorrectly formatted
        // so we need to split the string to get the right timestamp
        if (value) return new Date(value.split(' ')[0]).toLocaleString();
        return '-';
      },
    },
    {
      dataIndex: 'level',
      title: 'Nível',
      key: 'level',
      width: 75,
    },
    {
      dataIndex: 'message',
      title: 'Mensagem',
      key: 'message',
      render(value) {
        return <span style={{ fontFamily: 'Monospace' }}>{value}</span>;
      },
    },
  ];

  return (
    <AntDrawer
      width={'65vw'}
      visible={isVisible}
      onClose={handleClose}
      title={<strong>{title}</strong>}
      closable
      destroyOnClose
    >
      {isLoading ? (
        <>
          <Skeleton
            size='large'
            title={false}
            active={true}
            paragraph={{ rows: 1, width: '30%' }}
          />
          <Skeleton
            size='large'
            title={false}
            active={true}
            paragraph={{ rows: 1, width: '30%' }}
          />

          <CommonTable
            size={'small'}
            bordered={true}
            dataSource={[]}
            isLoading={true}
            columns={logsTableColumns}
          />
        </>
      ) : (
        <>
          <div>
            <span style={{ fontSize: '12px' }}>CONTAINERS EM EXECUÇÃO: </span>
            <span style={{ color: '#262626', fontSize: '14px' }}>
              {Object.keys(logsGroupedByTitle).length}
            </span>
          </div>

          <Tabs>
            {Object.entries(logsGroupedByTitle).map(
              ([logTitle, logsList], i) => (
                <Tabs.TabPane tab={logTitle} key={i}>
                  <ConfigProvider renderEmpty={renderEmpty}>
                    <CommonTable
                      size={'small'}
                      bordered={true}
                      isLoading={false}
                      dataSource={logsList}
                      columns={logsTableColumns}
                      rowKey={(record) => {
                        const msgSlice = record.message.substring(0, 50);
                        return `${record.level}-${record.createdAt}-${msgSlice}`;
                      }}
                      pagination={{
                        defaultPageSize: 10,
                        showSizeChanger: true,
                        pageSizeOptions: ['10', '20', '30', '40', '50'],
                      }}
                    />
                  </ConfigProvider>
                </Tabs.TabPane>
              )
            )}
          </Tabs>
        </>
      )}
    </AntDrawer>
  );
};

LogsDrawer.propTypes = {
  handleClose: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  isVisible: PropTypes.bool.isRequired,
  logs: PropTypes.array.isRequired,
  title: PropTypes.string.isRequired,
};

export default LogsDrawer;
