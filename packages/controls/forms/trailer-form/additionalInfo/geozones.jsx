import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Ant, VzForm, ButtonDeprecated, GeoZonesElement, IconDeprecated } from '@vezubr/elements';
import moment from 'moment';
const GeozonesAdditional = (props) => {
  const { geozones = [], geozonePasses = [], setGeozonePasses } = props;
  const renderOptions = useMemo(() => {
    return geozones.map((el) => {
      return (
        <Ant.Select.Option disabled={geozonePasses.find((item) => item.geozoneId === el.id)} key={el.id} value={el.id}>
          {el.name}
        </Ant.Select.Option>
      );
    });
  }, [geozones, geozonePasses]);

  const onChangeGeozone = useCallback(
    (type, index, value) => {
      // onClear в Select только с 4 версии ant
      if (type === 'geozoneId' && !value) {
        onRemove(index);
        return;
      }
      const geozonePassesInput = [...geozonePasses];
      geozonePassesInput[index] = { ...geozonePassesInput[index], [type]: value };
      setGeozonePasses(geozonePassesInput);
    },
    [geozonePasses],
  );

  const onRemove = useCallback(
    (index) => {
      const geozonePassesInput = [...geozonePasses.filter((el, elIndex) => index !== elIndex)];
      setGeozonePasses(geozonePassesInput);
    },
    [geozonePasses],
  );

  const renderGeopasses = useMemo(() => {
    return geozones.map((el, index) => {
      if (index > 0 && !geozonePasses[index - 1]?.geozoneId) {
        return;
      }
      return (
        <VzForm.Row key={el.id}>
          <VzForm.Col span={12}>
            <VzForm.Item label={'Тип пропуска'}>
              <Ant.Select
                placeholder={'Выберите тип пропуска'}
                allowClear={true}
                value={geozonePasses[index]?.geozoneId || null}
                onChange={(e) => onChangeGeozone('geozoneId', index, e)}
              >
                {renderOptions}
              </Ant.Select>
            </VzForm.Item>
          </VzForm.Col>
          {geozonePasses[index]?.geozoneId && (
            <VzForm.Col span={12}>
              <VzForm.Item error={!geozonePasses[index]?.expiresOnDate ? 'Годен до - обязательное поле' : ''} label={'Годен до'}>
                <Ant.DatePicker
                  onChange={(e) => onChangeGeozone('expiresOnDate', index, e ? e.format('YYYY-MM-DD') : e)}
                  value={geozonePasses[index]?.expiresOnDate ? moment(geozonePasses[index]?.expiresOnDate) : null}
                />
              </VzForm.Item>
            </VzForm.Col>
          )}
        </VzForm.Row>
      );
    });
  }, [renderOptions, geozonePasses, geozones]);
  return <div>{renderGeopasses}</div>;
};

export default GeozonesAdditional;
