import { Ant, VzForm } from '@vezubr/elements';
import PropTypes from 'prop-types';
import React from 'react';

function ActionEditSharingContent(props) {
  const { treeData, onChange, checkedValues, isDeleting, reason, setReason } = props;

  // const tree = React.useMemo(() => treeData, [treeData])
  // const loading = React.useMemo(() => !treeData?.length, [treeData])
  // const total = React.useMemo(() => treeData?.[0]?.length, [treeData])
  const { tree, loading, total, available } = React.useMemo(() => {
    const tree = treeData;
    const loading = !treeData.length;
    const total = treeData?.[0]?.children?.length;
    const available = (treeData?.[0]?.children || []).filter(el => !el.disabled).length
    return {
      tree,
      loading,
      total,
      available
    }
  }, [treeData])

  if (loading) {
    return (
      <div className={'loader flexbox justify-center'}>
        <Ant.Icon type="loading" />
      </div>
    );
  };

  return (
    <>
      <div className="flexbox wrap choose-additional-filters column size-1">
        <VzForm.Item
          label={`Подрядчики (для публикации доступно: ${available} из ${total})`}
        >
          <Ant.TreeSelect
            treeData={tree}
            dropdownClassName={'sharing-tariff-tree-select'}
            treeCheckable={true}
            treeDefaultExpandedKeys={['0']}
            showSearch
            defaultOpen={true}
            treeNodeFilterProp={'title'}
            placeholder={'Выберите подрядчиков'}
            onChange={onChange}
            maxTagCount={6}
            maxTagTextLength={50}
            dropdownStyle={{
              maxHeight: '58vh'
            }}
            value={checkedValues}
          />
        </VzForm.Item>
        {
          isDeleting && (
            <VzForm.Col className={'margin-top-15'} span={24}>
              <VzForm.Item label="Причина отмены рейса для Подрядчиков">
                <Ant.Input.TextArea value={reason} onChange={(e) => setReason(e.target.value)} />
              </VzForm.Item>
            </VzForm.Col>
          )
        }
      </div>
    </>
  );
}

ActionEditSharingContent.propTypes = {
  treeData: PropTypes.array,
  expandAll: PropTypes.bool,
  onChange: PropTypes.func,
  loading: PropTypes.bool,
  defaultValue: PropTypes.array,
};


export default ActionEditSharingContent;
