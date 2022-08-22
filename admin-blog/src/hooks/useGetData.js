import { message as antMessage } from "antd";
import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";

export default function useGetData(getData, reset, isError, message) {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getData());
    return () => {
      dispatch(reset());
    };
  }, [dispatch,getData,reset]);


  let isErrorReset = useRef(false);
  useEffect(() => {
    if (!isError) {
      isErrorReset.current = true;
    }
    if (isErrorReset.current && isError) {
      antMessage.error(message);
    }
  }, [isError, message]);
}
