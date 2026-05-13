import { useEffect, useState } from 'react';
import { locationService } from '../services/location.service.js';

export function useGeoLocation(watch = false) {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let stop;
    locationService.current().then(setLocation).catch((e) => setError(e.message));
    if (watch) stop = locationService.watch(setLocation);
    return () => { if (stop) stop(); };
  }, [watch]);

  return { location, error };
}
