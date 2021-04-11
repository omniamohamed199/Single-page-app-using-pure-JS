export function debounce(fn, time) {
    let timeout;
    return function () {
      clearTimeout(timeout)
      timeout = setTimeout(() => fn.apply(this, arguments), time)
    }
  
  }