import React, { useState, useRef, useEffect } from "react";
import style from "../css/ThemeSetting.module.css";

const Input = ({ value, onChange = () => {} }) => {
  return (
    <div>
      <input
        value={value}
        type="text"
        onChange={(e) => {
          onChange(e.target.value);
        }}
      />
    </div>
  );
};

class User {
  constructor(name) {
    this.name = name;
  }
  getName() {
    return this.name;
  }

  setName(name) {
    this.name = name;
  }
}

function ThemeSetting() {
  let userRef = useRef(new User("123"));
  //let user = userRef.current;

  useEffect(() => {
    console.log("user: ", userRef.current);
  }, [userRef.current.name]);

  return (
    <>
      <div>
        <Input
          value={userRef.current.getName()}
          onChange={(value) => {
            console.log("输入框的值: ", value);
            userRef.current.setName(value);
          }}
        />
        <button
          onClick={() => {
            console.log("user: ", userRef.current);
          }}
        >
          当前User
        </button>
        <div>user:{userRef.current.getName()}</div>
      </div>
    </>
  );
}

export default ThemeSetting;
