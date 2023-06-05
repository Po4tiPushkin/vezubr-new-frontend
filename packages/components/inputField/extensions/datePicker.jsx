import React from 'react';
import moment from 'moment';
import t from '@vezubr/common/localization';
import { ButtonIconDeprecated } from '@vezubr/elements';
import DatePicker, { registerLocale, setDefaultLocale } from 'react-datepicker';
import ru from 'date-fns/locale/ru';
registerLocale('ru', ru);

const datePicker = (other) => {
  const {
    onChange,
    error,
    minDate = true,
    value,
    maxDate: maxDateInput,
    dateFormat: dateFormatInput,
    readonly,
    strictFormat = false,
    showErrorInfo = true,
    minimalDate: minDateInput,
  } = other;
  const dateFormat = dateFormatInput || 'DD.MM.YYYY';
  const valueDate = moment(value, dateFormat);
  const selected = valueDate.isValid() ? valueDate.toDate() : new Date();
  const maxDate = maxDateInput ? (moment(maxDateInput).isValid() ? moment(maxDateInput).toDate() : null) : null;
  const minDateVal = minDateInput ? (moment(minDateInput).isValid() ? moment(minDateInput).toDate() : null) : minDate ? new Date() : null
  return (
    <div className={`bottom-right ${error && showErrorInfo ? 'right-30' : ''}`}>
      <DatePicker
        minDate={minDateVal}
        locale={t.calendarLocale}
        selected={selected}
        maxDate={maxDate}
        popperPlacement={'top-end'}
        disabled={readonly || false}
        showYearDropdown={true}
        dropdownMode="scroll"
        yearDropdownItemNumber={30}
        popperClassName={'vz-datepicker'}
        customInput={
          <div>
            <ButtonIconDeprecated
              default={true}
              style={{ top: `${error && showErrorInfo ? '5px' : '0'}` }}
              svgIcon={readonly ? 'calendarBlack' : 'calendarBlue'}
            />
          </div>
        }
        onChange={(date) => {
          const mDate = moment(date);
          onChange(strictFormat ? mDate.format(dateFormat) : mDate);
        }}
      />
    </div>
  );
};

export default datePicker;
