/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Lightbox from 'react-image-lightbox';
import { DownloadOutlined } from '@ant-design/icons';

import './styles.less';

import 'react-image-lightbox/style.css';

const ImageLightbox = ({ className, plotUrl, draggable }) => {
  const [hasZoom, setHasZoom] = useState(false);

  const handleShowWithZoom = () => {
    setHasZoom(true);
  };

  return (
    <>
      {hasZoom && (
        <Lightbox
          mainSrc={plotUrl}
          wrapperClassName='imageLightbox'
          onCloseRequest={() => setHasZoom(false)}
          toolbarButtons={[
            <a
              key='DOWNLOAD_LINK'
              className='download-link'
              href={plotUrl}
              download={`Resultado`}
            >
              <DownloadOutlined />
            </a>,
          ]}
        />
      )}

      <img
        className={className}
        style={{ cursor: 'pointer' }}
        onClick={handleShowWithZoom}
        draggable={draggable}
        src={plotUrl}
        alt='plot'
      />
    </>
  );
};

ImageLightbox.propTypes = {
  className: PropTypes.string,
  draggable: PropTypes.bool,
  plotUrl: PropTypes.string.isRequired,
};

ImageLightbox.defaultProps = {
  className: '',
  draggable: false,
};

export default ImageLightbox;
