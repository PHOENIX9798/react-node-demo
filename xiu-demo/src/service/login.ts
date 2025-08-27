import { get, post } from './http';

export const getPubKey = () => {
  return get('/publicKey');
};

export const login = (data: object) => {
  return post('/login', data);
};

export const getRefreshToken = () => get('/refreshToken');
