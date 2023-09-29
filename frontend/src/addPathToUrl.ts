export const addPathToUrl = (url: URL, path: string) => {
  if (url.pathname.endsWith("/") && path.startsWith("/")) {
    return new URL(url + path.slice(1));
  } else if (!url.pathname.endsWith("/") && !path.startsWith("/")) {
    return new URL(url + "/" + path);
  } else {
    return new URL(url + path);
  }
};
