import { debounce } from 'lodash'
import { useEffect, useMemo, useRef } from 'react';
import CryptoJS from 'crypto-js';
const encryptionKey = import.meta.env.VITE_MESSAGE_ENCRYPTION_KEY;


export const useDebounce = (callback) => {
    const ref = useRef();
  
    useEffect(() => {
      ref.current = callback;
    }, [callback]);
  
    const debouncedCallback = useMemo(() => {
      const func = () => {
        ref.current?.();
      };
  
      return debounce(func, 1000);
    }, []);
  
    return debouncedCallback;
};



export const encryptMessage = ( message ) => {
    const secretKey = "x{]ig;eu%a$Zlev@!.VH%bD`-=Rw;X^z"
    const encrypted = CryptoJS.AES.encrypt(message, secretKey).toString();
    return encrypted
  };


  export const decryptMessage = ( message ) => {
    const secretKey = "b'W\xa4\xf0\xe3\xab\x15\xc9\xd7\xaf\x8f\x89\xf9\x1a\x827\x1e'"
    try {
      const decrypted = CryptoJS.AES.decrypt(message, secretKey) //.toString(CryptoJS.enc.Utf8);
      console.log(decrypted)
      return decrypted
    } catch (error) {
      console.log('Decryption failed. Incorrect key or message.');
    }
  };


  