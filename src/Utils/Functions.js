export function getDisplayName(name, delim = '-') {
  return name
    .split(delim)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function getPokedexLabel(pokedexName, regionName) {
  const words = pokedexName
    .split('-')
    .filter((word) => word !== regionName && word);
  return words.length ? words.join(' ').toUpperCase() : 'ORIGINAL';
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
