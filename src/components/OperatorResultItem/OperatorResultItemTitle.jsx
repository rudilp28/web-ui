import React from 'react';
import PropTypes from 'prop-types';
import { Button, Dropdown, Menu, Space, Checkbox, Select } from 'antd';
import {
  MoreOutlined,
  DeleteOutlined,
  DownloadOutlined,
} from '@ant-design/icons';

import { DragIndicatorComponent } from 'assets';

import './OperatorResult.less';

const OperatorResultItemTitle = ({
  cardId,
  isSelected,
  selectedResult,
  availableResults,
  isDownloadDisabled,
  handleSelectCard,
  handleRemoveResult,
  handleSelectResult,
  handleDownloadResult,
}) => {
  return (
    <>
      <Space>
        <div draggable='true' style={{ cursor: 'grab', paddingRight: 10 }}>
          <DragIndicatorComponent fill='#595959' />
        </div>
      </Space>

      {!isDownloadDisabled && (
        <Checkbox
          className='ant-checkbox-group-item'
          checked={isSelected}
          onChange={() => handleSelectCard(cardId)}
        />
      )}

      <Space>
        <Select
          displayRender={([firstLabel]) => firstLabel}
          placeholder={'Selecione um Resultado'}
          style={{ width: 250, marginLeft: 20 }}
          value={selectedResult}
          onChange={(value) => handleSelectResult(cardId, value)}
        >
          {availableResults.map((result) => {
            return (
              <Select.Option key={result.id} value={result.id}>
                {result.title}
              </Select.Option>
            );
          })}
        </Select>
      </Space>

      <Dropdown
        trigger={['click']}
        overlay={
          <Menu>
            <Menu.Item
              key='remove'
              icon={<DeleteOutlined />}
              onClick={() => handleRemoveResult(cardId)}
            >
              <span>Ocultar</span>
            </Menu.Item>

            {!isDownloadDisabled && selectedResult && (
              <Menu.Item
                key='download'
                icon={<DownloadOutlined />}
                onClick={() => handleDownloadResult(cardId)}
              >
                <span>Fazer Download</span>
              </Menu.Item>
            )}
          </Menu>
        }
      >
        <Button
          type='text'
          icon={<MoreOutlined />}
          style={{ float: 'right' }}
        />
      </Dropdown>
    </>
  );
};

OperatorResultItemTitle.propTypes = {
  cardId: PropTypes.string.isRequired,
  isSelected: PropTypes.array.isRequired,
  selectedResult: PropTypes.number,
  availableResults: PropTypes.array.isRequired,
  isDownloadDisabled: PropTypes.array,
  handleSelectCard: PropTypes.func.isRequired,
  handleRemoveResult: PropTypes.func.isRequired,
  handleSelectResult: PropTypes.func.isRequired,
  handleDownloadResult: PropTypes.func.isRequired,
};

OperatorResultItemTitle.defaultProps = {
  selectedFigure: undefined,
  isDownloadDisabled: false,
};

export default OperatorResultItemTitle;
