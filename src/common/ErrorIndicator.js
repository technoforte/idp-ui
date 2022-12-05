import { useTranslation } from "react-i18next";
import { localStorageService } from "../services/local-storageService";

/**
 * @param {string} prefix optional value which will be showen before the error msg, msg be passed after translation.
 * @param {string} errorCode is a key from locales file under errors namespace
 * @param {string} defaultMsg (Optional) is a fallback value if transaction for errorCode not found.
 * If defaultMsg is not passed then errorCode key itself became the fallback value.
 */
const ErrorIndicator = ({
  prefix = "",
  errorCode,
  defaultMsg,
  i18nKeyPrefix = "errors",
}) => {
  const { getRedirectUri, getNonce, getState } = { ...localStorageService };

  const { t } = useTranslation("translation", { keyPrefix: i18nKeyPrefix });

  //Redirecting if transaction invalid
  if (errorCode === "invalid_transaction") {
    let nonce = getNonce();
    let state = getState();
    let redirect_uri = getRedirectUri();

    if (!redirect_uri) {
      //TODO naviagte to default error page
      return;
    }

    let params = "?";
    if (nonce) {
      params = params + "nonce=" + nonce + "&";
    }
    params = params + "error_description=" + t(errorCode, defaultMsg) + "&";

    //REQUIRED
    params = params + "state=" + state + "&";
    //REQUIRED
    params = params + "error=" + errorCode;

    window.location.replace(redirect_uri + params);
    return;
  }

  return (
    <div
      className="p-2 mt-2 mb-2 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800"
      role="alert"
    >
      {prefix + " "}
      {t(errorCode, defaultMsg)}
    </div>
  );
};

export default ErrorIndicator;
