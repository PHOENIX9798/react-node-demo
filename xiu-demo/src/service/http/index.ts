import service from './axios.ts';
import { getQueryString, cleanRes } from './httpTools.ts';

// 封装get,post,put等方法
export const get = (url: string, query?: object | undefined) => {
  return cleanRes(
    service({
      url: url + getQueryString(query),
      method: 'get'
    })
  );
};

export const post = (url: string, data: object, extraParams?: { headers: { 'Content-Type': string; }; }) => {
  return cleanRes(
    service({
      url: url,
      method: 'post',
      data
    })
  );
};