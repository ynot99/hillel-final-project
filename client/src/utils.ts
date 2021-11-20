const promiseCopyPaste = (
  copyPastePromise: Promise<Response>,
  resultFunc: Function,
  catchFunc?: Function
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
    });
};

const getAuthTokenHeaders = () => {
  const authToken = localStorage.getItem("auth-token");
  return {
    Authorization: `${authToken === null ? undefined : `Token ${authToken}`}`,
  };
};

export { promiseCopyPaste, getAuthTokenHeaders };
