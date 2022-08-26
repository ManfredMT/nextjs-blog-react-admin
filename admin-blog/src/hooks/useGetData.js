import { message as antMessage } from "antd";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

export default function useGetData(getData, reset, isError, message, resetError) {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getData());
    return () => {
      dispatch(reset());
    };
  }, [dispatch,getData,reset]);


  useEffect(() => {
    if (isError) {
      antMessage.error(message);
    }
    return ()=>{
      dispatch(resetError());
    }
  }, [isError, message, dispatch, resetError]);
}
