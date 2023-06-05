import React from 'react';
import PropTypes from 'prop-types';

const DocFileType = PropTypes.shape({
  id: PropTypes.number,
  file: PropTypes.object,
  createdAt: PropTypes.number,
  previews: PropTypes.arrayOf(PropTypes.object),
});

const DocInfoType = PropTypes.shape({
  name: PropTypes.string.isRequired,
  editMode: PropTypes.bool.isRequired,
  doc: DocFileType,
});

const DocSectionType = PropTypes.arrayOf(
  PropTypes.shape({
    section: PropTypes.shape({
      className: PropTypes.string,
      title: PropTypes.string,
      description: PropTypes.node,
    }),
    docs: PropTypes.arrayOf(DocInfoType),
  }),
);

const DocsType = PropTypes.oneOfType([PropTypes.arrayOf(DocInfoType), PropTypes.arrayOf(DocSectionType)]);

export { DocFileType, DocInfoType, DocSectionType, DocsType };
