import { useState, useEffect } from "react";

function getWindowDimensions() {
  const { innerWidth: width } = window;
  return width;
}

function useWindowDimensions() {
  const [wD, setWD] = useState(getWindowDimensions());
  useEffect(() => {
    function handleResize() {
      setWD(getWindowDimensions());
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return wD;
}

export default useWindowDimensions;
