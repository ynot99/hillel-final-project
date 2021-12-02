const promiseCopyPaste = (
  copyPastePromise: Promise<Response>,
  resultFunc: Function,
  catchFunc?: Function,
  finallyFunc?: Function
) => {
  copyPastePromise
    .then((response) => {
      if (response.ok) {
        if (response.status === 204) return {};
        return response.json();
      } else {
        throw new Error("Something went wrong");
      }
    })
    .then((result: any) => {
      resultFunc(result);
    })
    .catch((err) => {
      if (catchFunc) catchFunc(err);
    })
    .finally(() => {
      if (finallyFunc) finallyFunc();
    });
};

const getAuthTokenHeaders = () => {
  const authToken = localStorage.getItem("auth-token");
  return {
    Authorization: `${authToken === null ? undefined : `Token ${authToken}`}`,
  };
};

export { promiseCopyPaste, getAuthTokenHeaders };
