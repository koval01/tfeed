import { useEffect, useState } from 'react';

/**
 * @return True, if component was mounted.
 */
export const useDidMount = (): boolean => {
  const [didMount, setDidMount] = useState(false);

  useEffect(() => {
    setDidMount(true);
  }, []);

  return didMount;
}
