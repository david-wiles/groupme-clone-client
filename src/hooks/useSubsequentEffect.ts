import React, {useEffect, useRef} from "react";

export function useSubsequentEffect(cb: () => void, deps?: React.DependencyList) {
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
    } else {
      cb();
    }
  }, deps);
}
