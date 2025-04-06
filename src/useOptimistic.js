import { useState, useCallback } from 'react';
export function useOptimistic(initialState, reducer) {
  const [state, setState] = useState(initialState);
  const [optimisticState, setOptimisticState] = useState(initialState);

  const addOptimistic = useCallback((action) => {
    setOptimisticState(prev => reducer(prev, action));
    setState(prev => reducer(prev, action));
  }, [reducer]);

  return [optimisticState, addOptimistic];
}