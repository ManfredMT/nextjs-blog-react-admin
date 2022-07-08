import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
export default function useRedirect(from, toRelative) {
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    if (location.pathname === from) {
      navigate(toRelative, { replace: true });
    }
  });
}
