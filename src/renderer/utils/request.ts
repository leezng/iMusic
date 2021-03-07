import { message as Message } from 'antd';
import { extend } from 'umi-request';
import { RequestOptionsInit } from 'umi-request/types';

export interface FetchOptions extends RequestOptionsInit {
  url: string;
}

const extendRequest = extend({
  prefix: '/api',
  timeout: 30 * 1000,
});

const fetch = (_options: FetchOptions | string) => {
  const options: FetchOptions = typeof _options === 'string' ? { url: _options } : _options;
  const { method = 'get', url } = options;

  if (!url) {
    const ignoreError = new Error('ignore error');
    ignoreError.ignore = true;
    return Promise.reject(ignoreError);
  }

  const config = { ...options };
  delete config.url;

  return extendRequest(url, {
    method,
    ...config,
  });
};

export default async (options: FetchOptions) => {
  try {
    const response: any = await fetch(options);
    const { code, ...rest } = response;

    if (code !== 200) {
      throw new Error('服务器异常');
    }

    return rest;
  } catch (error) {
    const { data, message, ignore } = error;

    let msg = message;

    if (ignore) return false;

    if (data && data instanceof Object) {
      // 请求失败的情况(404|500|...)
      const { status, message, code } = data;
      if (code === 301) {
        console.log('用户未登录');
        return false;
      }

      msg = message || status;
    }

    if (msg) Message.error(msg);
    throw new Error(msg);
  }
};
