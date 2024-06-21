import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { DownOutlined, SearchOutlined } from '@ant-design/icons';
import {
  Tag,
  Input,
  Space,
  Button,
  Popover,
  Tooltip,
  Skeleton,
  Popconfirm,
  Typography,
} from 'antd';

import { CommonTable } from 'components';

import './style.less';

const TasksTable = ({
  tasks,
  isLoading,
  handleCopyTask,
  handleDeleteTask,
  handleSeeTaskCode,
  handleSearchTasks,
  handleOpenTaskDetails,
}) => {
  const searchInputRef = useRef(null);
  const confirmPopupRef = useRef(null);

  const handleSearch = (search, confirm) => {
    confirm();
    handleSearchTasks(search);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    handleSearchTasks('');
  };

  const columnsConfig = [
    {
      title: <strong>Nome da Tarefa</strong>,
      dataIndex: 'name',
      key: 'name',
      width: '25%',
      filterDropdown(filterDropdownProps) {
        const { setSelectedKeys, selectedKeys, confirm, clearFilters } =
          filterDropdownProps;

        return (
          <div style={{ padding: 8 }}>
            <Input
              ref={searchInputRef}
              placeholder={`Nome`}
              value={selectedKeys[0]}
              onChange={(e) =>
                setSelectedKeys(e.target.value ? [e.target.value] : [])
              }
              onPressEnter={() => handleSearch(selectedKeys[0], confirm)}
              style={{ width: 188, marginBottom: 8, display: 'block' }}
            />

            <Space>
              <Button
                size='small'
                type='primary'
                style={{ width: 90 }}
                icon={<SearchOutlined />}
                onClick={() => handleSearch(selectedKeys[0], confirm)}
              >
                Buscar
              </Button>

              <Button
                size='small'
                style={{ width: 90 }}
                onClick={() => handleReset(clearFilters)}
              >
                Resetar
              </Button>
            </Space>
          </div>
        );
      },
      onFilterDropdownVisibleChange: (visible) => {
        if (visible) {
          setTimeout(() => searchInputRef.current?.focus(), 100);
        }
      },
      filterIcon(filtered) {
        return (
          <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
        );
      },
      render(value, record) {
        return (
          <div>
            <Button
              type='link'
              style={{ textAlign: 'left', width: '75%' }}
              onClick={() => handleOpenTaskDetails(record)}
            >
              <Typography.Text
                style={{ color: '#0050B3', width: '100%' }}
                ellipsis
              >
                <Tooltip placement='topLeft' title={value}>
                  {value}
                </Tooltip>
              </Typography.Text>
            </Button>
          </div>
        );
      },
    },
    {
      title: <strong>Descrição</strong>,
      dataIndex: 'description',
      key: 'description',
      width: '35%',
      ellipsis: {
        showTitle: false,
      },
      render(value) {
        return isLoading ? (
          <Skeleton
            active
            paragraph={{ rows: 1, width: 250 }}
            size='large'
            title={false}
          />
        ) : (
          <Tooltip placement='topLeft' title={value}>
            {value}
          </Tooltip>
        );
      },
    },
    {
      title: <strong>Origem</strong>,
      dataIndex: 'source',
      key: 'source',
      width: '17%',
      render(_, record) {
        return (
          <Space size={8}>
            <Space size={8}>
              <Button
                style={{
                  border: 0,
                  color: 'white',
                  backgroundColor: '#389E0D',
                }}
                shape='circle'
              >
                P
              </Button>

              <Button className='btnTaskOrigin' type='link'>
                platiagro
              </Button>
            </Space>

            {record.createdAt !== record.updatedAt ? (
              <Tag>Modificada</Tag>
            ) : null}
          </Space>
        );
      },
    },
    {
      title: <strong>Ação</strong>,
      dataIndex: 'action',
      key: 'action',
      width: '18%',
      render(_, record) {
        return (
          <Space size={8}>
            <Button
              className='btnTaskActions'
              onClick={() => handleSeeTaskCode(record.name)}
              type='link'
            >
              Ver código-fonte
            </Button>

            <span>|</span>

            <Popover
              overlayClassName='more-actions-popover'
              placement='bottom'
              onVisibleChange={(visible) => {
                if (!visible && confirmPopupRef.current.props.visible) {
                  confirmPopupRef.current.onClick();
                }
              }}
              content={
                <div style={{ width: '140px' }}>
                  <Button
                    className='btnTaskMoreActions'
                    type='text'
                    onClick={() => handleCopyTask(record)}
                  >
                    Fazer uma cópia
                  </Button>

                  <Popconfirm
                    ref={confirmPopupRef}
                    title='Você tem certeza que deseja excluir essa tarefa?'
                    onConfirm={() => handleDeleteTask(record.uuid)}
                    placement='bottomRight'
                    cancelText='Não'
                    okText='Sim'
                  >
                    <Button className='btnTaskMoreActions' type='text'>
                      Excluir
                    </Button>
                  </Popconfirm>
                </div>
              }
            >
              <Button className='btnTaskActions' type='link'>
                Mais <DownOutlined />
              </Button>
            </Popover>
          </Space>
        );
      },
    },
  ];

  return (
    <CommonTable
      dataSource={tasks}
      isLoading={isLoading}
      className='tasksTable'
      columns={columnsConfig}
      rowKey={(record) => record.uuid}
    />
  );
};

TasksTable.propTypes = {
  tasks: PropTypes.array.isRequired,
  isLoading: PropTypes.bool.isRequired,
  handleCopyTask: PropTypes.func.isRequired,
  handleDeleteTask: PropTypes.func.isRequired,
  handleSeeTaskCode: PropTypes.func.isRequired,
  handleSearchTasks: PropTypes.func.isRequired,
  handleOpenTaskDetails: PropTypes.func.isRequired,
};

export default TasksTable;
