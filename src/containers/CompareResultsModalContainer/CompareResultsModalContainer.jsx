import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import RGL, { WidthProvider } from 'react-grid-layout';
import { useSelector, useDispatch } from 'react-redux';
import {
  Button,
  Card,
  Col,
  Divider,
  Row,
  Space,
  Tooltip,
  Skeleton,
  Modal,
} from 'antd';
import {
  PlusOutlined,
  LoadingOutlined,
  DownloadOutlined,
} from '@ant-design/icons';

import {
  addCompareResult,
  deleteCompareResult,
  fetchCompareResults,
  updateCompareResult,
  fetchTrainingHistory,
  fetchCompareResultsResults,
  getCompareResultDatasetPaginated,
} from 'store/compareResults/actions';
import utils from 'utils';
import { useIsLoading } from 'hooks';
import { CommonTable, CompareResultItem } from 'components';
import COMPARE_RESULTS_TYPES from 'store/compareResults/actionTypes';
import { getExperiments } from 'store/projects/experiments/experiments.selectors';
import { changeVisibilityCompareResultsModal } from 'store/ui/actions';

import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const ADD_COMPARE_RESULT_GRID_KEY = 'add-compare-result-grid-key';
const ReactGridLayout = WidthProvider(RGL);

const experimentsSelector = (projectId) => (state) => {
  return getExperiments(state, projectId);
};

const compareResultsSelector = ({ compareResultsReducer }) => {
  return compareResultsReducer.compareResults;
};

const experimentsOptionsSelector = ({ compareResultsReducer }) => {
  return compareResultsReducer.experimentsOptions;
};

const isVisibleSelector = ({ uiReducer }) => {
  return uiReducer.compareResultsModal.isVisible;
};

const tasksSelector = ({ tasksReducer }) => {
  return tasksReducer.tasks;
};

const experimentsTrainingHistorySelector = ({ compareResultsReducer }) => {
  return compareResultsReducer.experimentsTrainingHistory;
};

const CompareResultsModalContainer = () => {
  const { projectId } = useParams();
  const dispatch = useDispatch();

  const experiments = useSelector(experimentsSelector(projectId));

  const compareResults = useSelector(compareResultsSelector);
  const experimentsOptions = useSelector(experimentsOptionsSelector);
  const isVisible = useSelector(isVisibleSelector);
  const tasks = useSelector(tasksSelector);
  const experimentsTrainingHistory = useSelector(
    experimentsTrainingHistorySelector
  );

  const isAdding = useIsLoading(COMPARE_RESULTS_TYPES.ADD_COMPARE_RESULT);
  const isLoading = useIsLoading(COMPARE_RESULTS_TYPES.FETCH_COMPARE_RESULTS);
  const isDeleting = useIsLoading(COMPARE_RESULTS_TYPES.DELETE_COMPARE_RESULT);

  const handleDownloadResults = () => {
    compareResults?.forEach(({ experimentId, runId, operatorId }) => {
      if (experimentId && runId && operatorId) {
        utils.downloadExperimentRunResult({
          projectId,
          experimentId,
          runId,
          operatorId,
        });
      }
    });
  };

  useEffect(() => {
    if (isVisible) {
      dispatch(fetchCompareResults(projectId));
    }
  }, [dispatch, isVisible, projectId]);

  const title = (
    <Space>
      <span>
        <strong>Comparar resultados</strong>
      </span>

      <Divider type='vertical' />

      <Tooltip placement='bottom' title='Faz download dos resultados exibidos'>
        <Button
          shape='round'
          type='primary-inverse'
          onClick={handleDownloadResults}
        >
          <DownloadOutlined />
          Fazer download
        </Button>
      </Tooltip>
    </Space>
  );

  const renderLoadingCard = () => {
    return (
      <Col span={12}>
        <Card
          title={
            <Skeleton
              size='large'
              title={false}
              isActive={true}
              paragraph={{ rows: 1, width: '100%' }}
            />
          }
          style={{ height: 450, overflowX: 'scroll' }}
        >
          <Skeleton
            size='large'
            title={false}
            active={true}
            paragraph={{ rows: 1, width: '100%' }}
          />
          <CommonTable
            columns={[
              { title: '' },
              { title: '' },
              { title: '' },
              { title: '' },
            ]}
            size={'small'}
            isLoading={true}
            skeletonRowsAmount={5}
            rowKey={(record) => record.uuid}
          />
        </Card>
      </Col>
    );
  };

  const renderCompareResultItem = () => {
    return compareResults.map((compareResult) => {
      return (
        <div key={compareResult.uuid}>
          <CompareResultItem
            tasks={tasks}
            experiments={experiments}
            compareResult={compareResult}
            experimentsOptions={experimentsOptions}
            experimentsTrainingHistory={experimentsTrainingHistory}
            onDelete={(id) => {
              dispatch(deleteCompareResult(projectId, id));
            }}
            onFetchResults={(results) => {
              dispatch(fetchCompareResultsResults(results));
            }}
            onResultDatasetPageChange={(results, page, pageSize) => {
              dispatch(
                getCompareResultDatasetPaginated(results, page, pageSize)
              );
            }}
            handleDownloadResult={(experimentId, runId, operatorId) => {
              utils.downloadExperimentRunResult({
                projectId,
                experimentId,
                runId,
                operatorId,
              });
            }}
            onLoadTrainingHistory={(experimentId) => {
              dispatch(fetchTrainingHistory(projectId, experimentId));
            }}
            onUpdate={(results, isToDispatchAction) => {
              dispatch(updateCompareResult(results, isToDispatchAction));
            }}
          />
        </div>
      );
    });
  };

  const generateGridLayout = () => {
    let totalW = 0;

    const gridLayout = compareResults.map((item) => {
      let itemLayout = item.layout;
      if (!itemLayout) {
        itemLayout = {
          x: (Math.floor(totalW / 6) % 2) * 6,
          y: 9999,
          w: 6,
          h: 12,
        };
      }
      totalW += itemLayout.w;
      itemLayout.i = item.uuid;
      itemLayout.minW = 6;
      itemLayout.minH = 12;
      return itemLayout;
    });

    gridLayout.push({
      i: ADD_COMPARE_RESULT_GRID_KEY,
      x: (Math.floor(totalW / 6) % 2) * 6,
      y: 99999,
      w: 6,
      h: 2,
      isBounded: true,
      isDraggable: true,
      isResizable: false,
    });

    return gridLayout;
  };

  const handleUpdateCompareResultLayout = (layout, oldItem, newItem) => {
    if (newItem.i !== ADD_COMPARE_RESULT_GRID_KEY) {
      for (const layoutItem of layout) {
        if (layoutItem.i !== ADD_COMPARE_RESULT_GRID_KEY) {
          let compareResult = compareResults.find(
            (e) => e.uuid === layoutItem.i
          );

          compareResult.layout = {
            x: layoutItem.x,
            y: layoutItem.y,
            w: layoutItem.w,
            h: layoutItem.h,
          };

          dispatch(updateCompareResult(compareResult, false));
        }
      }
    }
  };

  const modalBody = () => {
    if (isLoading || isDeleting) {
      return <Row gutter={[8, 8]}>{renderLoadingCard()}</Row>;
    }

    return (
      <ReactGridLayout
        className={'layout'}
        cols={12}
        rowHeight={35}
        layout={generateGridLayout()}
        onDragStop={handleUpdateCompareResultLayout}
        onResizeStop={handleUpdateCompareResultLayout}
      >
        {renderCompareResultItem()}
        <div key={ADD_COMPARE_RESULT_GRID_KEY}>
          <Card
            style={{
              border: '2px dashed #D9D9D9',
              textAlign: 'center',
              margin: 0,
            }}
          >
            <Button
              shape='round'
              type='default'
              disabled={isAdding}
              onClick={() => {
                dispatch(addCompareResult(projectId));
              }}
            >
              <Space style={{ color: '#0050B3' }}>
                {isAdding ? <LoadingOutlined /> : <PlusOutlined />}
                Adicionar resultado
              </Space>
            </Button>
          </Card>
        </div>
      </ReactGridLayout>
    );
  };

  return (
    <Modal
      bodyStyle={{
        backgroundColor: '#ECEFF1',
        overflowX: 'scroll',
        height: '80vh',
      }}
      centered
      footer={null}
      title={title}
      width={'90%'}
      visible={isVisible}
      onCancel={() => dispatch(changeVisibilityCompareResultsModal(false))}
    >
      {modalBody()}
    </Modal>
  );
};

export default CompareResultsModalContainer;
