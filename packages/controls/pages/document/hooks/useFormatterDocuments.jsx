import { useMemo } from 'react';
import { fileGetUrlFromRelativePath } from "@vezubr/common/utils";

const useFormatterDocuments = (documents) => {
  return useMemo(() => documents && documents.map((doc) => {
    if (doc?.files) {
      const files = doc.files.map((item) => {
        return {
          ...item,
          fileId: item.file?.id,
          fileName: item.file?.originalName,
          download: fileGetUrlFromRelativePath(item.file?.downloadUrl),
          preview: fileGetUrlFromRelativePath(item.file?.imageFilesPreviewModel[2]?.downloadUrl),
          fileType: 'unknown',
        }
      });

      return {
        ...doc,
        ...{ files },
      }
    }
    return doc;
  }), [documents]);
}

export default useFormatterDocuments;