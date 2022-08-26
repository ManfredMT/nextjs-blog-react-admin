import axios from "axios";

const API_URL = "/api/users/";

const register = async (userData) => {
  const response = await axios.post(API_URL, userData);

  if (response.data) {
    localStorage.setItem("user", JSON.stringify(response.data));
  }

  //console.log("response.data", response.data);

  return response.data;
};

const login = async (userData) => {
  const response = await axios.post(API_URL + "login", userData);

  if (response.data) {
    localStorage.setItem("user", JSON.stringify(response.data));
  }

  return response.data;
};

const getUserData = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(API_URL + "me", config);
  return response.data;
};

const logout = () => {
  localStorage.removeItem("user");
  //console.log("清除localStorage中的user");
};

const changePassword = async (token, passwordData) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.put(
    API_URL + "update-password",
    passwordData,
    config
  );
  return response.data;
};

const authService = {
  register,
  logout,
  login,
  getUserData,
  changePassword,
};

export default authService;
