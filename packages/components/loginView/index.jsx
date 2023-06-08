import React, { useEffect, useState, useCallback, useMemo } from "react";
import { User as UserService } from "@vezubr/services";
import Cookies from "@vezubr/common/common/cookies";
import { Logo, showError, Ant, IconDeprecated, VzForm } from "@vezubr/elements";
import { Utils } from "@vezubr/common/common";
import { CONTOUR_ROLES } from "@vezubr/common/constants/contour";
import loginBg from "@vezubr/common/assets/img/login-bg.jpg";
import { Link } from "react-router-dom";
import t from "@vezubr/common/localization";
import Static from "@vezubr/common/constants/static";

const patterns = Static.patterns;
const LoginView = (props) => {
  const { history } = props;
  const { Input, Button } = Ant;
  const [contour, setContour] = useState(null);
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(null);

  const getParams = useMemo(() => {
    return Utils.getUrlParams(history.location.search);
  }, [history]);

  const getByCode = useCallback(async (contourCode) => {
    try {
      const contourInfo = await UserService.getByCode(contourCode);
      setContour({ contourCode: contourCode, contourInfo: contourInfo });
    } catch (e) {
      console.error(e);
      showError(e);
    }
  }, []);

  const contourInfo = useMemo(() => {
    return contour?.contourInfo;
  }, [contour]);

  const contourCode = useMemo(() => {
    return contour?.contourCode;
  }, [contour]);

  const login = useCallback(async () => {
    if (!username || !password) {
      const newErrors = { ...errors };
      newErrors.password = !password ? t.error("noPassword") : false;
      newErrors.username = !username ? t.error("noUsername") : false;
      setErrors(newErrors);
      return;
    }
    try {
      setLoading(true);
      const user = await UserService.login({ username, password });
      if (window.APP == "operator") {
        Cookies.set('operatorToken', user.data?.token);
        localStorage.setItem("password", password);
        window.location.href = window.API_CONFIGS.operator.url;
      }
      const { role } = user;

      const hostForRedirectAfterRegistration = () => {
        let result = "/";

        switch (role) {
          case 1:
            return (result = window.API_CONFIGS.producer.url);
          case 2:
            return (result = window.API_CONFIGS.client.url);
          case 3:
            return (result = window.API_CONFIGS.operator.url);
          case 4:
            return (result = window.API_CONFIGS.dispatcher.url);
          default:
            return result;
        }
      };
      if (APP !== "operator") {
        switch (role) {
          case 1:
            Cookies.set("producerToken", user.token);
            break;
          case 2:
            Cookies.set("clientToken", user.token);
            break;
          case 3:
            Cookies.set("operatorToken", user.token);
            break;
          case 4:
            Cookies.set("dispatcherToken", user.token);
            break;
        }
      }

      console.log(window.APP, user);

      if (contour?.contourCode) {
        Cookies.set("contourCode", contour?.contourCode);
      }

      const redirect = localStorage.getItem("redirectUrl")
        ? localStorage.getItem("redirectUrl")
        : "";
      if (redirect) {
        localStorage.removeItem("redirectUrl");
      }
      if (APP == "enter") {
        window.location.href =
          hostForRedirectAfterRegistration() + redirect.replace("/", "");
      } else {
        window.location.href = redirect;
      }
    } catch (e) {
      console.error(e);
      if (e.code === 400) {
        e.message = "Неверный пароль или имя пользователя";
      }
      showError(e);
    } finally {
      setLoading(false);
    }
  }, [username, password, contour]);

  useEffect(() => {
    if (getParams?.contourCode) {
      getByCode(getParams.contourCode);
    }
  }, [getParams]);

  const validateEmail = useCallback(
    (val) => {
      const newErrors = { ...errors };
      const phone = parseInt(val);
      const emailValid = patterns.email.test(val);
      const phoneValid = Number.isInteger(phone) && val.length >= 10;
      newErrors.username =
        !emailValid && !phoneValid ? t.error("invalidUsername") : false;
      setErrors(errors);
      setUsername(val);
    },
    [username]
  );

  return (
    <>
      <div className={"login"}>
        <img className={"bg"} src={loginBg} />
        <div className={"wrap padding-top-37"}>
          <Logo />
          <h2 className={"main-sub-title"}>{t.login("loginTitle")}</h2>
          {contourCode && contourInfo ? (
            <p style={{ fontWeight: 600 }} className={""}>
              Подтвердите добавление в контур{" "}
              {`${CONTOUR_ROLES[contourInfo.role]} ${contourInfo.title}`}, введя
              логин и пароль от вашего кабинета
            </p>
          ) : null}
          <div className={"form-wrapper"}>
            <VzForm.Item label={"пользователь"} error={errors?.username}>
              <Input
                type={"email"}
                className={"vz-input"}
                title={t.login("username")}
                placeholder={t.login("uPlaceholder")}
                value={username}
                onChange={(e) => validateEmail(e.target.value)}
              />
            </VzForm.Item>
            <VzForm.Item
              label={"Пароль"}
              className={"margin-top-16"}
              error={errors?.password}
            >
              <Input.Password
                title={t.login("password")}
                value={password}
                onChange={(e) => {
                  if (errors?.password) {
                    setErrors((prev) => {
                      return { ...prev, password: false };
                    });
                  }
                  setPassword(e.target.value);
                }}
              />
            </VzForm.Item>
            <div className={"buttons-wrapper margin-top-31"}>
              <Button
                type={"primary"}
                onClick={() => login()}
                loading={loading}
                className={"wide"}
                disabled={loading}
              >
                {contourCode ? "Подтвердить" : "Вход"}
              </Button>
              {contourCode ? (
                <Button
                  onClick={() =>
                    history.push(`/contour-join?contourCode=${contourCode}`)
                  }
                  className={"wide margin-top-16"}
                  type={"secondary"}
                >
                  Назад
                </Button>
              ) : (
                <Button
                  onClick={() => history.push("/registration")}
                  className={"wide margin-top-16"}
                  type={"secondary"}
                >
                  Регистрация
                </Button>
              )}
            </div>
            <div className={"margin-top-15"}>
              <Link
                to={"forgot-password/email"}
                className={"password-restore pointer"}
              >
                {t.login("recoverUser")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginView;
