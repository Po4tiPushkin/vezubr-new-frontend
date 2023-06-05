import React from 'react';

function LoaderLeftSide(props) {
  const { loader } = props;
  const previewUri = React.useMemo(() => {
    return loader?.photoFile
      ? loader?.photoFile.previews && loader?.photoFile.previews.length
        ? loader?.photoFile.previews.find((el) => el && el.widthInPx === 328)?.downloadUrl.replace('/', '')
        : loader?.photoFile.downloadUrl.replace('/', '')
      : null;
  }, [loader?.photoFile]);

  if (!previewUri) return null

  return (
    <div className={'profile-box left'}>
      {previewUri && <div className={'profile-avatar padding-16'} style={{ height: 250 }}>
        <img style={{ width: '100%', height: '100%' }} src={`${window.API_CONFIGS[APP].host}${previewUri}`} />
      </div>}
    </div>
  );
}

export default LoaderLeftSide;
