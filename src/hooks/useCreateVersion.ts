import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { DocumentService } from "../services/documentService";

export function useCreateVersion() {
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const { documentId } = useParams();

  useEffect(() => {
    function resetTimer() {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      timerRef.current = setTimeout(() => {
        if (documentId) DocumentService.createVersion(documentId);
      }, 15 * 60 * 1000);
    }

    function handleActivity() {
      resetTimer();
    }

    window.addEventListener("keypress", handleActivity);
    resetTimer(); // Start the initial timer on component mount

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      window.removeEventListener("keypress", handleActivity);
    };
  }, [documentId]);
}
