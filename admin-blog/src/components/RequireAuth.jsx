import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { checkJWT, reset } from "../features/auth/authSlice";
import Loading from "../pages/Loading";

function RequireAuth({ children }) {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isError, isSuccess, message } = useSelector((state) => state.auth);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    dispatch(checkJWT());
  }, [dispatch]);

  useEffect(() => {
    if (isError) {
      console.error("Auth error: ", message);
      setIsAuth(false);
      navigate("/", { replace: true, state: { from: location } });
      dispatch(reset());
    }
    if (isSuccess) {
      setIsAuth(true);
    }
  }, [dispatch, isError, isSuccess, message, location, navigate]);

  return isAuth ? <>{children}</> : <Loading />;
}

export default RequireAuth;
