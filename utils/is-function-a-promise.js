/**
 *
 * @param {Function} fn
 * @returns
 * @description Check if a function is a promise
 */
export function isFunctionAPromise(fn) {
    if (typeof fn !== "function") return false;
    return fn && fn.constructor && fn.constructor.name === "AsyncFunction";
  }
  
  /**
   *
   * @param {Function} promise
   * @param  {...any:[]} args
   * @returns
   */
  export async function resolvePromise(promise, ...args) {
    if (typeof promise !== "function") return;
    if (isFunctionAPromise(promise)) {
      return await promise(...args);
    } else {
      return promise(...args);
    }
  }
  