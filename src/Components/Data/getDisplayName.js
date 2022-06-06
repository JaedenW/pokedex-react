export default function getDisplayName(name, delim = '-') {
  return name
    .split(delim)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
