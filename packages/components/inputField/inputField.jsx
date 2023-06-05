import React from 'react';
import ReactTooltip from 'react-tooltip';
import InputMask from 'react-input-mask';
import _isObject from 'lodash/isObject';
import { IconDeprecated, ButtonIconDeprecated } from '@vezubr/elements';
import { DatePicker, DropDown } from './extensions';
import autobind from 'autobind-decorator';
import Static from '@vezubr/common/constants/static';
import { DaData as DDService } from '@vezubr/services';
import moment from 'moment';
const patterns = Static.patterns;
const times = Static.times;
const regex = /^[0-9,]*\.?[0-9]*$/;
const regex2 = /^[0-9]*$/;
const regexNegative = /-?[0-9]*\.?[0-9]+/g;
///^[0-9.,\b]+$/;
const validateWholeInputText = (event, allowDot, allowNegative) => {
  const val = event.target.value;
  const t = typeof allowDot !== 'undefined' && allowDot ? regex.test(val) : regex2.test(val);
  if (allowNegative) {
    const negReg = regexNegative.test(val);
    return negReg && t;
  }
  return t;
};

class InputField extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showDropDown: props.showDropDown,
      hasError: {},
      txt: '',
      suggestions: [],
    };
    this.inputField = React.createRef();
    this.vzInput = React.createRef();
    this.dropDownRef = React.createRef();
  }

  componentWillReceiveProps() {
    const { error } = this.props;
    if (!error) {
      this.vzInput.current.classList.remove('error');
      this.setState({
        hasError: {
          [this.props.type]: null,
        },
      });
    }
  }

  onBlur() {
    const { current } = this.inputField;
    const { withError, error } = this.props;
    if (!current.checkValidity()) {
      this.vzInput.current.classList.add('error');
      this.setState({
        hasError: {
          [this.props.type]: withError,
        },
      });
    } else {
      if (error) {
        this.vzInput.current.classList.add('error');
      } else {
        this.vzInput.current.classList.remove('error');
      }
      this.setState({
        hasError: {
          [this.props.type]: null,
        },
      });
    }
  }

  @autobind
  handleHideDropDown(e) {
    const inputDom = this.inputField.current;
    const dropDowDom = this.dropDownRef.current;
    const targetDom = e.target;

    if (inputDom && dropDowDom && targetDom) {
      if (!inputDom.contains(targetDom) && !dropDowDom.contains(targetDom)) {
        this.setState({ showDropDown: false });
      }
    }
  }

  @autobind
  handleHideDropDownByKey(e) {
    const { showDropDown } = this.state;
    if (showDropDown && (e.keyCode === 9 || e.keyCode === 13)) {
      this.setState({ showDropDown: false });
    }
  }

  componentDidMount() {
    document.body.addEventListener('click', this.handleHideDropDown);
    document.body.addEventListener('keydown', this.handleHideDropDownByKey);
  }

  componentWillUnmount() {
    document.body.removeEventListener('click', this.handleHideDropDown);
    document.body.removeEventListener('keydown', this.handleHideDropDownByKey);
  }

  async getSuggestions(value, type) {
    let endPoint = false;
    switch (type) {
      case 'inn':
      case 'email':
      case 'address':
      case 'bank':
        endPoint = type;
        break;
      case 'name':
      case 'surname':
      case 'patronymic':
      case 'fio':
        endPoint = 'fio';
        break;
      case 'departmentCode':
      case 'issueBy':
        endPoint = 'fms_unit';
        break;
    }
    if (endPoint && value.length > 2) {
      let suggestions = (await DDService[endPoint](value)).suggestions;
      if (type === 'email' || type === 'address' || type === 'fio' || type === 'patronymic' || type === 'issueBy') {
        suggestions = suggestions.map((el) => {
          return el.value || '';
        });
      } else if (type === 'departmentCode') {
        suggestions = suggestions.map((el) => {
          return el?.data?.code || '';
        });
      } else if (type === 'inn') {
        suggestions = suggestions
          .filter((el) => el.data?.inn)
          .map((el) => {
            return {
              value: el.data?.inn,
              shortName: el.data?.name?.short_with_opf,
              name: (
                <div className="suggestion-inn">
                  <div className="suggestion-inn-name">{el.data?.name?.short_with_opf}</div>
                  <div className="suggestion-inn-else">
                    <div>{el.data?.inn}</div>
                    <div>{el.data?.address?.value}</div>
                  </div>
                </div>
              ),
            };
          });
      } else if (type === 'bank') {
        suggestions = suggestions.map((el) => {
          return {
            value: el.data?.bic,
            style: { fontSize: '14px' },
            bankName: el.data?.name?.payment,
            correspondentAccount: el.data?.correspondent_account,
            name: (
              <div>
                <div>{el.data?.name?.payment}</div>
                <div>{el.data?.bic}</div>
                <div>{el.data?.address?.value}</div>
              </div>
            ),
          };
        });
      } else {
        suggestions = suggestions?.filter((el) => el.data[type]);
        suggestions = suggestions.map((el) => {
          return el.data[type] || '';
        });
      }
      this.setState({ suggestions, showDropDown: true });
    }
  }

  render() {
    const { showDropDown, iconState, hasError, txt, suggestions } = this.state;
    const {
      className,
      title,
      placeholder,
      name,
      type,
      onChange,
      onBlur,
      onFocus,
      icon = {},
      error,
      pattern = false,
      tabindex = 1,
      datePicker,
      timePicker,
      telephone,
      dropDown,
      showSuggestions,
      checkbox,
      textarea,
      shortInfo,
      allowNegative = false,
      onlyNum,
      allowNull = false,
      allowDot = undefined,
      strictFormat,
      size,
      withIcon,
      withBorder,
      readonly,
      allowInputChange,
      minDate,
      maxDate,
      startDate,
      required,
      style = {},
      inputStyle = {},
      dateFormat,
      minLength,
      maxLength = 9999,
      textareaStyle = {},
      allowManual,
      showErrorInfo = true,
      shortInfoShow = false,
      iconClick = false,
      uppercase = false,
      multipleChoice = false,
      minimalDate,
      disabled
    } = this.props;

    let { value = '', mask } = this.props;

    let classNames = (className || '').split(' ');

    if (withBorder) {
      classNames.push('with-border');
    }
    if (size === 'small') {
      classNames.push('small');
    } else {
      classNames.push('big');
    }
    classNames.push('vz-input');

    if (error) {
      classNames.push('error');
    }

    if (checkbox) {
      classNames.push('vz-switch');
    }

    if (readonly) {
      classNames.push('readonly');
    }

    if (datePicker) {
      classNames.push('dt-picker');
      if (readonly) {
        classNames.push('size-1');
      }
    }

    if (disabled) {
      classNames.push('disabled')
    }

    classNames = classNames.join(' ');

    if ((timePicker || dropDown) && !readonly) {
      Object.assign(icon, {
        show: true,
        position: `bottom-right ${dropDown ? 'no-edit' : ''}`,
        state: 'active',
        active: 'chevronDownBlue',
        passive: 'chevronUpBlue',
        onClick: (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.setState({
            showDropDown: !showDropDown,
            iconState: !showDropDown ? 'passive' : 'active',
          });
        },
      });
    }
    if (!timePicker && !dropDown && !readonly && !textarea && !datePicker && !checkbox && !Object.keys(icon).length) {
      const { txt } = this.state;
      Object.assign(icon, {
        active: 'xSmall',
        position: 'bottom-right',
        show: onlyNum && value > 0 && ((txt && txt.toString().length > 0) || (value && value.toString().length > 0)),
        state: 'active',
        onClick: (e) => {
          e.preventDefault();
          e.stopPropagation();
          const val = onlyNum ? 0 : '';
          if (this.inputField.current) {
            this.inputField.current.value = val;
          }
          e.target.value = val;
          onChange(e);
          this.setState({ txt: val });
        },
      });
      if (this.inputField.current && !this.listenerActive) {
        this.inputField.current.addEventListener('keyup', (e) => {
          this.setState({ txt: this.inputField.current.value });
        });
        this.listenerActive = true;
      }
    }

    const stateOfIcon = (dropDown || timePicker) && iconState ? iconState : icon.state;
    return (
      <div
        style={style}
        className={classNames}
        id={name}
        onClick={() => (checkbox ? onChange() : null)}
        ref={this.vzInput}
      >
        <div className={'vz-input-title-wrapper flexbox size-1 column'}>
          <div className={'input-title'}>
            <span className={'narrow'}>{title}</span>
            {iconClick ? (
              <div
                className={'top-left margin-left-5 pointer'}
                style={{ zIndex: 100, marginTop: '-1px' }}
                onClick={(e) => iconClick(e)}
              >
                <IconDeprecated className={'auto'} name={'info'} />
              </div>
            ) : null}
            {shortInfo && shortInfoShow ? (
              <div data-tip="React-tooltip" className={'top-left margin-left-5'} data-for={name || `rt-${type}`}>
                <IconDeprecated className={'auto'} name={'info'} />
                <ReactTooltip
                  id={name || `rt-${type}`}
                  className={'vz-tooltip white'}
                  place="bottom"
                  type="dark"
                  effect="solid"
                >
                  {shortInfo.title ? <p className={'tt-title'}>{shortInfo.title}</p> : null}
                  {shortInfo.description ? <p className={'tt-descr'}>{shortInfo.description}</p> : null}
                </ReactTooltip>
              </div>
            ) : null}
          </div>
          {checkbox ? (
            <div className={`input-checkbox-text ${checkbox.checked ? 'active' : 'passive'}`}>{checkbox.text}</div>
          ) : null}
        </div>

        {textarea ? (
          <textarea
            style={textareaStyle}
            className={'vz-textarea'}
            name={name}
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e)}
          />
        ) : mask ? (
          <InputMask
            mask={mask}
            placeholder={placeholder || ''}
            style={inputStyle}
            maskChar={null}
            value={value}
            onBlur={(e) => (onBlur ? onBlur(e) : '')}
            onFocus={(e) => (onFocus ? onFocus(e) : '')}
            onPaste={(e) => {
              if (telephone) {
                let pastedValue = e.clipboardData.getData('Text').replace(/[^0-9]/g, '');
                if (pastedValue.length > 10) {
                  e.target.value = pastedValue.substring(1);
                }
                onChange(e);
              }
            }}
            onChange={(e) => {
              if (timePicker) {
                const time = e.target.value.split(':');
                if (parseInt(time[0]) > 23) {
                  time[0] = 23;
                }
                if (parseInt(time[1]) > 59) {
                  time[1] = 59;
                }
                const formatted = time.join(':');
                e.target.value = formatted;
                onChange(e);
              } else {
                if (showSuggestions) {
                  this.getSuggestions(e.target.value, showSuggestions);
                }
                onChange(e);
              }
            }}
          />
        ) : checkbox ? (
          <div className={'vz-switch-wrapper'}>
            <input
              type="checkbox"
              checked={checkbox.checked}
              name={name}
              style={inputStyle}
              readOnly={readonly}
              onChange={() => onChange()}
              className="vz-switch"
            />
            <label tag="switcher" htmlFor="switch">
              Toggle
            </label>
          </div>
        ) : withIcon ? (
          <div className={'with-icon'}>
            <input
              ref={this.inputField}
              type={type || 'text'}
              name={name}
              tabIndex={tabindex}
              style={inputStyle}
              readOnly={dropDown}
              pattern={(pattern && patterns[type]) || null}
              value={value}
              onBlur={(e) => (onBlur ? onBlur(e) : this.onBlur(e))}
              onFocus={(e) => (onFocus ? onFocus(e) : '')}
              onChange={(e) => (onChange ? onChange(e) : null)}
              placeholder={placeholder || ''}
            />
            {withIcon}
          </div>
        ) : (
          <input
            ref={this.inputField}
            name={name}
            className={readonly ? 'readonly' : ''}
            type={type || 'text'}
            style={inputStyle}
            tabIndex={tabindex}
            readOnly={(dropDown || readonly) && !allowInputChange}
            pattern={(pattern && patterns[type]) || null}
            value={value}
            minLength={minLength}
            maxLength={maxLength}
            onBlur={(e) => (onBlur ? onBlur(e) : this.onBlur(e))}
            onFocus={(e) => (onFocus ? onFocus(e) : '')}
            onChange={(e) => {
              const valid = onlyNum ? validateWholeInputText(e, allowDot, allowNegative) : true;
              if (!valid && e.target.value) {
                return;
              }

              if (datePicker) {
                const valueDate = moment(e.target.value, dateFormat || 'DD.MM.YYYY');

                if (valueDate.isValid()) {
                  onChange(strictFormat ? valueDate.format(dateFormat) : valueDate);
                }
                return;
              }

              if (onlyNum) {
                if (!allowNull) {
                  e.target.value = e.target.value.replace(/^0+/, '');
                }
                e.target.value = e.target.value ? e.target.value.replace(',', '.') : e.target.value;
              }
              if (uppercase) {
                e.target.value = e.target.value.toUpperCase();
              }
              if (showSuggestions) {
                this.getSuggestions(e.target.value, showSuggestions);
              }
              onChange ? onChange(e) : null;
            }}
            required={required || false}
            placeholder={placeholder || ''}
          />
        )}

        {datePicker ? (
          <DatePicker
            minDate={typeof minDate !== 'undefined' ? minDate : true}
            maxDate={maxDate}
            value={value}
            error={error}
            showErrorInfo={showErrorInfo}
            strictFormat={strictFormat}
            dateFormat={dateFormat}
            readonly={readonly}
            onChange={(e) => onChange(e)}
            minimalDate={minimalDate ? minimalDate : null}
          />
        ) : null}

        {timePicker && showDropDown ? (
          <DropDown
            isTimePicker={true}
            forwardedRef={this.dropDownRef}
            visible={showDropDown}
            startDate={startDate}
            list={times}
            onChange={(e) => {
              const st = iconState === 'active' ? 'passive' : 'active';
              this.setState({
                showDropDown: false,
                iconState: st,
              });
              if (e) {
                onChange(e.val);
              }
            }}
          />
        ) : null}

        {dropDown && showDropDown && !readonly ? (
          <DropDown
            allowFilter={dropDown.allowFilter}
            forwardedRef={this.dropDownRef}
            visible={showDropDown}
            list={dropDown.data}
            checked={dropDown.checked}
            useIdAsKey={dropDown.useIdAsKey}
            multipleChoice={multipleChoice}
            onChange={(e) => {
              if (!multipleChoice || !multipleChoice !== !e) {
                const st = iconState === 'active' ? 'passive' : 'active';
                this.setState({ showDropDown: false, iconState: st });
              }
              if (e) {
                dropDown.onChange ? dropDown.onChange(e) : onChange(e);
              }
            }}
          />
        ) : null}
        {showSuggestions && showDropDown && suggestions.length > 0 && (
          <DropDown
            forwardedRef={this.dropDownRef}
            visible={showDropDown}
            list={suggestions}
            useIdAsKey={false}
            onChange={(e) => {
              const eT = _isObject(e) ? e : {};
              eT.target = { value: typeof e.val === 'string' ? e.val : e.val?.value };
              eT.suggestions = true;
              this.setState({ showDropDown: false });
              onChange(eT);
            }}
          />
        )}
        {Object.keys(icon).length && icon.show && (!error || (error && (dropDown || timePicker || datePicker))) ? (
          <div
            onClick={(e) => icon.onClick(e)}
            className={`${icon.position} ${
              (dropDown || timePicker || datePicker) && error && showErrorInfo ? `right-20` : ''
            }`}
          >
            <ButtonIconDeprecated
              default={true}
              className={timePicker ? 'timePicker' : dropDown ? 'vz-dd' : ''}
              onClick={(e) => icon.onClick(e)}
              svgIcon={icon[stateOfIcon]}
            />
          </div>
        ) : null}

        {showErrorInfo && (error || (hasError && hasError[type])) ? (
          <div data-tip="React-tooltip" data-for={name || `rt-${type}`} className={`bottom-right`}>
            <IconDeprecated name={'danger'} />
            <ReactTooltip id={name || `rt-${type}`} className={'vz-tooltip'} place="bottom" type="dark" effect="solid">
              <span>{error || hasError[type]}</span>
            </ReactTooltip>
          </div>
        ) : (
          ''
        )}
      </div>
    );
  }
}

export default InputField;
