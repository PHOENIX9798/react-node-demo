import JSEncrypt from 'jsencrypt';
import { setKeyInLocal, getKeyByLocal } from '@/common/keyAndToken';
import { getPubKey } from '@/service/login';

// get publishKey
export const getRsaKey = async () => {
  const key = getKeyByLocal();
  if (['undefined', null, undefined].includes(key)) {
    const [data, err] = await getPubKey();
    if (err) return;
    setKeyInLocal(data.pub_key);
    return data.pub_key;
  }
  return key;
};

// 根据密钥加密
export const encryptParam = async (param: object) => {
  const key = await getRsaKey();
  const encryptor = new JSEncrypt();
  encryptor.setPublicKey(key);
  return encryptor.encrypt(JSON.stringify(param));
};
