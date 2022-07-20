import {useState} from "react";

export default function ClientP() {
    const [count, setCount] = useState(1);
    const onClick=()=>{
        setCount(count+1);
    }
    return <><p>{count}</p><button onClick={onClick}>+1</button></>;

}