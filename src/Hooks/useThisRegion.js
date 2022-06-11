import { useQuery } from 'react-query';

async function fetchRegion(url) {
  const res = await fetch(url);
  return res.json();
}

export default function useThisRegion(url) {
  return useQuery(['thisRegion', url], () => fetchRegion(url));
}
