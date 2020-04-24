// use localStorage to store the authority info, which might be sent from server in actual project.
import { reloadAuthorized } from './Authorized';

export function getAuthority(str) {
  // authorityString could be admin, "admin", ["admin"]
  const authorityString = typeof str === 'undefined' && localStorage ? str : str;

  let authority;

  try {
    if (authorityString) {
      authority = JSON.parse(authorityString);
    }
  } catch (e) {
    authority = authorityString;
  }

  if (typeof authority === 'string') {
    return [authority];
  }

  if (!authority) {
    return ['admin'];
  }

  return authority;
}
export function setAuthority(authority) {
  // const proAuthority = typeof authority === 'string' ? [authority] : authority;
  // localStorage.setItem('antd-pro-authority', JSON.stringify(proAuthority)); // auto reload

  reloadAuthorized();
}
