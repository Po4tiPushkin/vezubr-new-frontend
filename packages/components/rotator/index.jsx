import React, { useState, useCallback, useMemo, useRef } from 'react';
import { Ant, IconDeprecated } from '@vezubr/elements';
import { Utils } from '@vezubr/common/common';
import { Document, Page } from 'react-pdf/dist/esm/entry.webpack';

const DEGREES = [270, 180, 90, 0, 90, 180, 270];

const SIZES = [0.2, 0.5, 1, 2, 3];

const DEFAULT_VALUES = {
  size: 2,
  degree: 3
}

const Rotator = (props) => {
  const { image = '', onSave, onClose = () => {} } = props;
  const [degree, setDegree] = useState(3);
  const [size, setSize] = useState(2);
  const [numPages, setNumPages] = useState(0);
  const { id, accessKey, fileType } = Utils.queryString();
  const imgRef = useRef(null);
  const [wrapperHeight, setWrapperHeight] = useState(500);
  const onRotate = useCallback((value = 0) => {
    setDegree((prev) => prev + value);
  }, []);

  const onChangeSize = useCallback((value) => {
    setSize((prev) => prev + value);
  }, []);

  const onSubmit = useCallback(() => {
    if (onSave) {
      onSave(degree);
    }
    onClose();
  }, [degree, onClose, onSave]);

  const renderImage = useMemo(() => {
    const { naturalWidth, naturalHeight, clientHeight, clientWidth } = imgRef?.current || {};
    if (fileType.includes('pdf')) {
      return (
        <Document
          onLoadSuccess={({ numPages }) => setNumPages(numPages)}
          file={window.API_CONFIGS[APP]?.host + `v1/api/download-file/${id}?accessKey=${accessKey}`}
        >
          {Array.from(new Array(numPages), (el, index) => (
            <Page rotate={DEGREES[degree]} scale={SIZES[size]} key={`page_${index + 1}`} pageNumber={index + 1} />
          ))}
        </Document>
      );
    } else {
      return (
        <img
          ref={imgRef}
          src={window.API_CONFIGS[APP]?.host + `v1/api/download-file/${id}?accessKey=${accessKey}`}
          alt=""
          style={{
            transform: `rotate(${DEGREES[degree]}deg)`,
            width: `${naturalWidth * SIZES[size]}px`,
            height: `${naturalHeight * SIZES[size]}px`,
            marginTop: `${DEGREES[degree] % 180 !== 0 ? `${(clientWidth - clientHeight) / 2}px` : '0px'}`,
          }}
        />
      );
    }
  });

  React.useEffect(() => {
    if (imgRef?.current) {
      setWrapperHeight(imgRef?.current?.naturalHeight || 500);
    }
  }, [imgRef]);

  return (
    <div className="rotator">
      <div className="rotator__main">
        <div className="rotator__wrapper">
          <div className="rotator__img">{renderImage}</div>
        </div>
        <div className="rotator__actions flexbox">
          <Ant.Button disabled={degree <= 0} onClick={() => onRotate(-1)} className="rotator__button">
            <IconDeprecated name={'rotateLeftArrow'} />
          </Ant.Button>
          <Ant.Button disabled={degree >= DEGREES.length - 1} onClick={() => onRotate(1)} className="rotator__button">
            <IconDeprecated name={'rotateRightArrow'} />
          </Ant.Button>
          <Ant.Button disabled={size <= 0} onClick={() => onChangeSize(-1)} className="rotator__button">
            <IconDeprecated name={'zoomOutLoop'} />
          </Ant.Button>
          <Ant.Button disabled={size >= SIZES.length - 1} onClick={() => onChangeSize(1)} className="rotator__button">
            <IconDeprecated name={'zoomInLoop'} />
          </Ant.Button>
          <Ant.Button
            disabled={size == 2 && degree == 4}
            onClick={() => {
              setSize(DEFAULT_VALUES.size);
              setDegree(DEFAULT_VALUES.degree);
            }}
          >
            Вернуть
          </Ant.Button>
          <Ant.Button
            onClick={() => window.open(window.API_CONFIGS[APP]?.host + `v1/api/download-file/${id}?accessKey=${accessKey}`)}
          >
            Скачать
          </Ant.Button>

        </div>
      </div>
    </div>
  );
};

export default Rotator;
