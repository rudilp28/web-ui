import React, { useMemo } from 'react';
import RGL, { WidthProvider } from 'react-grid-layout';
import PropTypes from 'prop-types';
import { Empty } from 'antd';

import { BrainPlaceholderComponent } from 'assets';
import { DownloadOperatorDatasetContainer } from 'containers';
import {
  PlotResult,
  CommonTable,
  DatasetResult,
  OperatorResultItem,
} from 'components';

import useResults from './useResults';
import useGridLayout from './useGridLayout';
import useMoveOrResize from './useMoveOrResize';
import ResultsDrawerAddCard from './ResultsDrawerAddCard';
import ResultsDrawerSkeleton from './ResultsDrawerSkeleton';
import { ADD_CARD_KEY, DATASETS_KEY, PARAMETERS_KEY } from './constants';

import './ResultsDrawer.less';

const ReactGridLayout = WidthProvider(RGL);

const PARAMETERS_COLUMNS = [
  {
    title: 'Parâmetro',
    dataIndex: 'name',
    key: 'parameter',
    render(val) {
      return <span style={{ fontWeight: 'bold' }}>{val}</span>;
    },
  },
  {
    title: 'Valor',
    dataIndex: 'value',
    key: 'value',
    render(val) {
      return <span style={{ fontFamily: 'monospace' }}>{val}</span>;
    },
  },
];

const ResultsDrawer = ({
  dataset,
  figures,
  loading,
  parameters,
  datasetScroll,
  selectedCards,
  handleSelectCard,
  onDatasetPageChange,
}) => {
  const {
    showingResults,
    availableResults,
    handleAddResult,
    handleRemoveResult,
    handleSelectResult,
  } = useResults(figures);

  const gridLayout = useGridLayout(showingResults);
  const handleMoveOrResize = useMoveOrResize(showingResults);

  const hasDataToShow = useMemo(() => {
    return figures.length > 0 || parameters.length > 0 || dataset;
  }, [dataset, figures.length, parameters.length]);

  if (loading) {
    return (
      <div className='results-drawer'>
        <ResultsDrawerSkeleton />
      </div>
    );
  }

  if (!hasDataToShow) {
    return (
      <div className='results-drawer'>
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description='Não Existem Resultados!'
        />
      </div>
    );
  }

  return (
    <div className='results-drawer'>
      <ReactGridLayout
        className='results-drawer-react-grid'
        cols={12}
        rowHeight={35}
        layout={gridLayout}
        containerPadding={[8, 8]}
        onDragStop={handleMoveOrResize}
        onResizeStop={handleMoveOrResize}
      >
        {showingResults.map(({ id, selectedResult }) => {
          const figure = selectedResult ? figures[selectedResult] : null;

          const renderCardContent = () => {
            if (selectedResult === DATASETS_KEY && dataset) {
              return (
                <div className='results-drawer-result-table'>
                  <div className='results-drawer-download-dataset'>
                    <DownloadOperatorDatasetContainer />
                  </div>

                  <DatasetResult
                    dataset={dataset}
                    scroll={datasetScroll}
                    onDatasetPageChange={onDatasetPageChange}
                  />
                </div>
              );
            }

            if (selectedResult === PARAMETERS_KEY && parameters) {
              return (
                <div className='results-drawer-result-table'>
                  <CommonTable
                    isLoading={false}
                    dataSource={parameters}
                    columns={PARAMETERS_COLUMNS}
                    rowKey={(record) => record.name}
                    bordered
                  />
                </div>
              );
            }

            if (figure) {
              return (
                <div className='results-drawer-result-scroll'>
                  <PlotResult
                    plotImageClassName='results-drawer-plot-image'
                    plotUrl={figure.plotUrl}
                  />
                </div>
              );
            }

            return (
              <div className='results-drawer-placeholder'>
                <BrainPlaceholderComponent />
              </div>
            );
          };

          return (
            <div key={id}>
              <OperatorResultItem
                cardId={id}
                selectedResult={selectedResult}
                isSelected={!!selectedCards[id]}
                availableResults={availableResults}
                handleSelectCard={handleSelectCard}
                handleSelectResult={handleSelectResult}
                handleRemoveResult={handleRemoveResult}
                isDownloadDisabled
              >
                {renderCardContent()}
              </OperatorResultItem>
            </div>
          );
        })}

        <div key={ADD_CARD_KEY}>
          <ResultsDrawerAddCard handleAddResult={handleAddResult} />
        </div>
      </ReactGridLayout>
    </div>
  );
};

ResultsDrawer.propTypes = {
  dataset: PropTypes.object,
  figures: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  parameters: PropTypes.array,
  datasetScroll: PropTypes.object,
  onDatasetPageChange: PropTypes.func.isRequired,
  selectedCards: PropTypes.object.isRequired,
  handleSelectCard: PropTypes.func.isRequired,
};

ResultsDrawer.defaultProps = {
  activeKey: '1',
  resultsTabStyle: undefined,
  onTabChange: undefined,
};

export default ResultsDrawer;
