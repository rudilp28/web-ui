import React from 'react';
import { Skeleton, Row, Col, Card } from 'antd';

const ResultsDrawerSkeleton = () => {
  const skeletonColumn = (
    <Col span={12}>
      <Card
        title={
          <div style={{ width: '100%', display: 'flex' }}>
            <Skeleton.Button
              style={{ width: '32px', marginRight: '16px' }}
              active
            />

            <Skeleton.Button style={{ width: '150px' }} active />

            <div style={{ marginLeft: 'auto' }}>
              <Skeleton.Button
                style={{ width: '32px', marginRight: '8px' }}
                active
              />

              <Skeleton.Button style={{ width: '32px' }} active />
            </div>
          </div>
        }
      >
        <Skeleton paragraphConfig={{ rows: 1, width: '100%' }} active />
      </Card>
    </Col>
  );

  return (
    <Row gutter={[30, 30]} className='monitoring-drawer-skeletons'>
      {skeletonColumn}
      {skeletonColumn}
      {skeletonColumn}
    </Row>
  );
};

export default ResultsDrawerSkeleton;
