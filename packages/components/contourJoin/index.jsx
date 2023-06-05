import React, { useState, useMemo, useCallback, useEffect } from 'react';
import loginBg from '@vezubr/common/assets/img/login-bg.jpg';
import t from '@vezubr/common/localization';
import { Logo, showError, Ant, WhiteBoxDeprecated } from "@vezubr/elements";
import { User as UserService  } from "@vezubr/services";
import { Utils } from "@vezubr/common/common";
import { CONTOUR_ROLES } from "@vezubr/common/constants/contour";

const ContourJoin = (props) => {
  const { history } = props;
  const getParams = Utils.getUrlParams(history.location.search);
  const [showLogin, setShowLogin] = useState(false);
  const [contourInfo, setContourInfo] = useState(null);
  const contourCode = useMemo(() => {
    if (getParams?.contourCode) {
      return getParams?.contourCode;
    }
    return null;
  }, [getParams]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const contourInfoResponse = await UserService.getByCode(getParams.contourCode);
        setContourInfo(contourInfoResponse);
      } catch (e) {
        showError(e);
        if (e.code === 404) {
          history.push('/login');
        }
      }
    }
    fetchData();

  }, [contourCode])


  const goToLogin = () => {
    history.push(`/login?contourCode=${contourCode}`)
  }

  const goToRegister = () => {
    history.push(`/registration?contourCode=${contourCode}`)
  }

  return (
    <>
    <div className="contour-join">
      <img className={'bg'} src={loginBg} />
      <div className="wrap">
        <WhiteBoxDeprecated>
          <Logo/>
          <div className="contour-join-text">
            { contourInfo && ( <p> Для добавления в контур {`${CONTOUR_ROLES[contourInfo.role]} ${contourInfo.title}`} необходимо войти под существующей 
              учётной записью или зарегистрировать новую организацию
            </p> )
            }
            <p>У вас уже есть существующий кабинет или необходимо зарегистрировать новый?</p>
          </div>
          <div className="actions">
            <Ant.Button type={'primary'} onClick={() => goToLogin()} >Войти в существующий кабинет</Ant.Button>
            <Ant.Button style={{ marginLeft: '25px' }} type={'secondary'} onClick={() => goToRegister()} >Регистрация Нового кабинета</Ant.Button>
          </div>
        </WhiteBoxDeprecated>
      </div>
    </div>
    </>
  )
}


export default ContourJoin;