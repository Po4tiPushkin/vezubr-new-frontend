export function fileGetPreviewById(fileId, width, height) {
  return `${window.API_CONFIGS[APP].host}v1/file/preview/${fileId}/${width}/${height}'`;
}

export function fileGetUrlFromRelativePath(relativeUrl) {
  if (!relativeUrl) {
    return undefined;
  }

  return `${window.API_CONFIGS[APP].host.replace(/\/$/, '')}/${relativeUrl.replace(/^\//, '')}`;
}

export function fileOpenInWindow(url) {
  window.open(url);
}

export function fileOpenDataUrl(dataUrl) {
  const newTab = window.open();

  let sFileName = dataUrl;
  let sFileExtension = sFileName.split('.')[sFileName.split('.').length - 1];
  
  if (sFileExtension != 'pdf') {
    newTab.document.body.innerHTML = `<img src="${dataUrl}" />`;
    return;
  }
  newTab.document.body.innerHTML = `<object style="width: 100%; height: 100%;" data="${window.API_CONFIGS[APP].host.replace(/\/$/, '') + dataUrl}" type="application/pdf"><a href="${window.API_CONFIGS[APP].host.replace(/\/$/, '') + dataUrl}" class="object-image"></a></object>`;
}

export function fileGetFileData(file) {
  if (!file) {
    return null
  }
  const fileData = file?.file || file?.fileData || file;
  const fileId = fileData?.id || fileData?.fileId;
  const fileNameOrigin = fileData?.originalName || file?.originalName;
  const fileName = file?.fileName || file?.name || fileNameOrigin;
  const fileType = file?.fileType || fileGetFileTypeByName(fileNameOrigin);

  const fileDataResult = {
    ...file,
    fileData,
    fileId,
    fileName,
    fileType,
    fileNameOrigin,
  };

  if (fileData?.downloadUrl) {
    fileDataResult.download = fileGetUrlFromRelativePath(fileData.downloadUrl);
  }

  if (fileData?.previews) {
    fileDataResult.preview = `${window.API_CONFIGS[APP].host}${Object.values(fileData.previews)[0]?.replace(/^\//, '')}`
  } else if (fileData?.imageFilesPreviewModel) {
    const foundPreview = fileData.imageFilesPreviewModel.find(({ widthInPx }) => widthInPx && widthInPx < 200 && widthInPx > 80);
    if (foundPreview?.downloadUrl) {
      fileDataResult.preview = fileGetUrlFromRelativePath(foundPreview.downloadUrl);
    }
  }

  return fileDataResult;
}

export function fileGetFileTypeByName(fileNameOrigin = '') {
  const foundType = fileNameOrigin.match(/\.([^.]+)$/i);
  if (foundType?.[1]) {
    switch (foundType[1]) {
      case 'jpeg':
      case 'ipg':
        return 'image/jpeg';
      case 'png':
        return 'image/png';
      case 'eps':
        return 'image/x-eps';
      case 'pdf':
        return 'application/pdf';
    }
  }

  return 'unknown';
}

export function fileGetFileIconByType(type) {
  switch (type) {
    case 'image/jpeg':
    case 'image/gif':
    case 'image/png':
    case 'image/x-eps':
      return 'file-image';
    case 'application/pdf':
    case 'pdf':
      return 'file-pdf';
    case 'xlsx':
    case 'xml':
      return 'file-excel';    
    default:
      return 'file-unknown';
  }
}
