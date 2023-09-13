import { debounce } from 'lodash'
import { useEffect, useMemo, useRef } from 'react';


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

 
// function modInverse(a, m) {
//   for(let x = 1; x < m; x++) {
//       if ((a * x) % m == 1) {
//           return x;
//       }
//   }
//   return null;
// }

// // Perform Affine encryption
// export function affineEncrypt(text, additiveKey, multiplicativeKey) {
//   let encryptedText = "";
//   for(let i = 0; i < text.length; i++) {
//       let char = text[i];
//       if (char.match(/[a-z]/i)) {
//           var isUpper = char == char.toUpperCase();
//           char = char.toLowerCase();
//           var charNum = char.charCodeAt(0) - 'a'.charCodeAt(0);
//           var encryptedCharNum = (additiveKey * charNum + multiplicativeKey) % 26;
//           var encryptedChar = String.fromCharCode(encryptedCharNum + 'a'.charCodeAt(0));
//           if(isUpper)
//               encryptedChar = encryptedChar.toUpperCase();
          
//           encryptedText += encryptedChar;
//       } else {
//           encryptedText += char;
//       }
//   }
//   return encryptedText;
// }


export function test() {
  let text = affineEncrypt("hello?", 3, 8)
  console.log(text)
  let final = affineDecrypt(text, 3, 8)
  console.log(final)
}


function modInverse(a, m)  {
  a = a % m;
  for(let x = 1; x < m; x++) {
      if((a*x) % m == 1) {
          return x;
      }
  }
  return 1;
}

// Affine Cipher Encryption Function
export function affineEncrypt(text, a, b) {
  let result = "";
  for(let i = 0; i < text.length; i++) {
      let ch = text[i];
      if(ch.match(/[a-z]/i)) { // Check if character is a letter
          let code = ch.charCodeAt();
          let isUpper = (ch == ch.toUpperCase()) ? true : false;
          let base = isUpper ? 65 : 97;
          let encrypt = (a * (code - base) + b) % 26;
          result += String.fromCharCode(encrypt + base);
      } else {
          result += ch; // If it's not a letter, just add it as it is
      }
  }
  return result;
}

// Affine Cipher Decryption Function
export function affineDecrypt(cipher, a, b) {
  let result = "";
  let a_inv = modInverse(a, 26);
  for(let i = 0; i < cipher.length; i++) {
      let ch = cipher[i]
      if(ch.match(/[a-z]/i)){ // Check if character is a letter
          let code = ch.charCodeAt();
          let isUpper = (ch == ch.toUpperCase()) ? true : false;
          let base = isUpper ? 65 : 97;
          let decrypt = (a_inv * ((code - base) - b + 26)) % 26;
          result += String.fromCharCode(decrypt + base);
      } else {
          result += ch; // If it's not a letter, just add it as it is
      }
  }
  return result;
}