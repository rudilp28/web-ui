import React, { useLayoutEffect, useMemo } from 'react';
import { Pagination, Tabs, Button, Modal } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';

import {
  fetchPaginatedDataset,
  updateDatasetColumnRequest,
  updateAllDatasetColumnSuccess,
  updateAllDatasetColumnFail,
  updateAllDatasetColumnStart,
} from 'store/dataset/actions';
import { useIsLoading } from 'hooks';
import { OPERATORS_TYPES } from 'store/operators';
import { UploadButton } from 'components/Buttons';
import { hideDataViewModal } from 'store/ui/actions';
import DATASET_TYPES from 'store/dataset/actionTypes';
import { CommonTable, DatasetColumnsTable } from 'components';
import { OPERATOR_TYPES, saveTargetAttribute } from 'store/operator';

import './DataViewModalContainer.less';

const datasetColumnsSelector = ({ datasetReducer }) => {
  return datasetReducer.columns;
};

const datasetCurrentPageSelector = ({ datasetReducer }) => {
  return datasetReducer.currentPage;
};

const datasetDataSelector = ({ datasetReducer }) => {
  return datasetReducer.data;
};

const datasetFeaturetypesSelector = ({ datasetReducer }) => {
  return datasetReducer.featuretypes;
};

const datasetNameSelector = ({ datasetReducer }) => {
  return datasetReducer.name;
};

const datasetPageSizeSelector = ({ datasetReducer }) => {
  return datasetReducer.pageSize;
};

const datasetTotalSelector = ({ datasetReducer }) => {
  return datasetReducer.total;
};

const isVisibleSelector = ({ uiReducer }) => {
  return uiReducer.dataViewModal.isVisible;
};

const datasetOperatorSelector = ({ operatorReducer }) => {
  return operatorReducer;
};

const DataViewModalContainer = () => {
  const dispatch = useDispatch();

  const datasetColumns = useSelector(datasetColumnsSelector);
  const datasetCurrentPage = useSelector(datasetCurrentPageSelector);
  const datasetData = useSelector(datasetDataSelector);
  const datasetFeaturetypes = useSelector(datasetFeaturetypesSelector);
  const datasetName = useSelector(datasetNameSelector);
  const datasetPageSize = useSelector(datasetPageSizeSelector);
  const datasetTotal = useSelector(datasetTotalSelector);
  const isVisible = useSelector(isVisibleSelector);
  const datasetOperator = useSelector(datasetOperatorSelector);

  const isUpdatingAllDatasetColumns = useIsLoading(
    DATASET_TYPES.UPDATE_ALL_DATASET_COLUMNS_REQUEST
  );

  const isLoadingParameter = useIsLoading(
    OPERATORS_TYPES.CLEAR_OPERATORS_FEATURE_PARAMETERS_REQUEST,
    OPERATOR_TYPES.UPDATE_OPERATOR_REQUEST
  );

  const isLoadingDataset = useIsLoading(
    DATASET_TYPES.FETCH_DATASET_COLUMNS_REQUEST,
    DATASET_TYPES.CREATE_DATASET_REQUEST,
    DATASET_TYPES.UPDATE_DATASET_COLUMN_REQUEST,
    DATASET_TYPES.GET_DATASET_REQUEST,
    DATASET_TYPES.DELETE_DATASET_REQUEST,
    DATASET_TYPES.FETCH_PAGINATED_DATASET
  );

  const datasetDataWithId = useMemo(() => {
    if (!datasetData) return [];
    return datasetData.map((item, index) => ({
      ...item,
      uuid: `uuid-${index}`,
    }));
  }, [datasetData]);

  const actionUrl = useMemo(() => {
    return `${process.env.REACT_APP_DATASET_API}/datasets/${datasetName}`;
  }, [datasetName]);

  const attributesCount = useMemo(() => {
    return new Intl.NumberFormat('pt-BR').format(datasetColumns.length);
  }, [datasetColumns.length]);

  const observationsCount = useMemo(() => {
    return new Intl.NumberFormat('pt-BR').format(datasetTotal);
  }, [datasetTotal]);

  const columns = useMemo(() => {
    return datasetColumns.map((column, index) => {
      return {
        title: column.name,
        dataIndex: index,
      };
    });
  }, [datasetColumns]);

  const selectedRows = useMemo(() => {
    const featureParameter = datasetOperator?.parameters.find(
      (parameter) => parameter.name === 'target'
    );

    return featureParameter ? [featureParameter.value] : [];
  }, [datasetOperator?.parameters]);

  const handleClose = () => {
    dispatch(hideDataViewModal());
  };

  const handleUpdateDatasetColumn = (columnName, columnNewType) => {
    dispatch(updateDatasetColumnRequest(columnName, columnNewType));
  };

  const handleUpdateAllDatasetColumnSuccess = (allColumns) => {
    dispatch(updateAllDatasetColumnSuccess(allColumns));
  };

  const handleUpdateAllDatasetColumnFail = (message) => {
    dispatch(updateAllDatasetColumnFail(message));
  };

  const handleUpdateAllDatasetColumnStart = () => {
    dispatch(updateAllDatasetColumnStart());
  };

  const handleTargetAttribute = (parameters, projectId, experimentId) => {
    dispatch(saveTargetAttribute(projectId, experimentId, parameters));
  };

  const handleChangePagination = (page, size) => {
    dispatch(fetchPaginatedDataset(datasetName, page, size));
  };

  useLayoutEffect(() => {
    if (isVisible) {
      dispatch(fetchPaginatedDataset(datasetName, 1, 10));
    }
  }, [datasetName, dispatch, isVisible]);

  return (
    <Modal
      className='data-view-modal-container modalFullScreen'
      onCancel={handleClose}
      title='Visualizar dados'
      visible={isVisible}
      footer={null}
      centered
    >
      <div className='data-view-modal'>
        <div className='data-view-modal-data-header'>
          <span style={{ fontSize: '12px' }}>ATRIBUTOS: </span>

          <span style={{ color: '#262626', fontSize: '14px' }}>
            {attributesCount}
          </span>

          <span style={{ marginLeft: '25px', fontSize: '12px' }}>
            OBSERVAÇÕES:{' '}
          </span>

          <span style={{ color: '#262626', fontSize: '14px' }}>
            {observationsCount}
          </span>
        </div>

        <Tabs defaultActiveKey='1'>
          <Tabs.TabPane tab='Atributos' key='1'>
            <div className='attributes-table'>
              <DatasetColumnsTable
                columns={datasetColumns}
                selectedRows={selectedRows}
                setParameterLoading={isLoadingParameter}
                handleRowSelection={handleTargetAttribute}
                handleSetColumnType={handleUpdateDatasetColumn}
              />
            </div>

            <div className='data-view-attributes-download'>
              <h2>Tipos dos atributos</h2>

              <a
                href={`data:text/plain;base64,${btoa(datasetFeaturetypes)}`}
                download='featuretypes.txt'
              >
                <Button
                  disabled={!datasetFeaturetypes}
                  loading={false}
                  type={'default'}
                  icon={<DownloadOutlined />}
                >
                  Fazer download
                </Button>
              </a>
            </div>

            <div className='data-view-attributes-upload'>
              <h2>Altere todos os tipos de uma só vez</h2>

              <p>
                Faça download dos tipos dos atributos, altere os tipos
                necessários e importe novamente o arquivo.
              </p>

              <h3>Dicas</h3>

              <ul>
                <li>Os tipos podem ser: Categórico, Data/Hora ou Numérico.</li>

                <li>
                  Cada linha do arquivo contém um tipo de atributo, na mesma
                  ordem das colunas dos dados de entrada;
                </li>
              </ul>

              <UploadButton
                method='PATCH'
                isDisabled={false}
                actionUrl={actionUrl}
                parameterName='featuretypes'
                buttonText='Importar arquivo'
                isLoading={isUpdatingAllDatasetColumns}
                handleUploadFail={handleUpdateAllDatasetColumnFail}
                handleUploadStart={handleUpdateAllDatasetColumnStart}
                handleUploadSuccess={handleUpdateAllDatasetColumnSuccess}
              />
            </div>
          </Tabs.TabPane>

          <Tabs.TabPane tab='Observações' key='2'>
            <div className='data-view-observations'>
              <CommonTable
                size={'small'}
                columns={columns}
                isLoading={isLoadingDataset}
                dataSource={datasetDataWithId}
                rowKey={(record) => record.uuid}
                scroll={{
                  x: columns.length > 10 ? 2000 : 1000,
                  y: window.innerHeight / 2,
                }}
              />

              <br />

              <Pagination
                defaultCurrent={1}
                defaultPageSize={10}
                total={datasetTotal}
                pageSize={datasetPageSize}
                current={datasetCurrentPage}
                style={{ textAlign: 'right' }}
                onChange={handleChangePagination}
                onShowSizeChange={handleChangePagination}
                pageSizeOptions={['10', '20', '30', '40', '50']}
                showSizeChanger
              />
            </div>
          </Tabs.TabPane>
        </Tabs>
      </div>
    </Modal>
  );
};

export default DataViewModalContainer;
