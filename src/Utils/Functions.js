export function getDisplayName(name, delim = '-') {
  return name
    .split(delim)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function throttle(callbackFn, delay) {
  let wait = false;
  if (!wait) {
    callbackFn();
    wait = true;
    setTimeout(() => {
      wait = false;
    }, delay);
  }
}
