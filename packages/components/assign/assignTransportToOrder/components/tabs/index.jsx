import React, { useMemo } from 'react';

const Tabs = (props) => {
  const { setActiveTab, tabs } = props;

  const renderTabs = useMemo(() => {
    if (!Array.isArray(tabs)) {
      return <></>;
    }
    const t = tabs.map((val, key) => (
      <a className={`vz-tab ${val.active ? 'active' : ''}`} key={key} onClick={(e) => { e.preventDefault(); setActiveTab(key) }}>
        {val.title}
      </a>
    ));
    return <div className={'vz-tabs'}>{t}</div>;
  }, [tabs]);


  return (
    <div className='assignModal__tabs'>
      {renderTabs}
    </div>
  )
};

export default Tabs;