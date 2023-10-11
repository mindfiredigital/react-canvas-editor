import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";

export function useCreateVersion() {
  const { documentId } = useParams();

  useEffect(() => {
    function handleActivity() {
    }

    window.addEventListener("keypress", handleActivity);
    return () => {
      window.removeEventListener("keypress", handleActivity);
    };
  }, [documentId]);
}
