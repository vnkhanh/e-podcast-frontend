import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

export async function login(email, password) {
  try {
    const res = await axios.post(
      `${API_BASE_URL}/auth/login`,
      {
        email,
        password: password, // phải đúng với backend
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Login success:", res.data);
    return res.data; // { token, user }
  } catch (err) {
    if (err.response) {
      // lỗi từ backend (status 400, 401,...)
      console.error("Login failed:", err.response.data);
      return err.response.data;
    } else {
      // lỗi khác (network, CORS,...)
      console.error("Error:", err.message);
    }
  }
}

export async function register(email, password, ho_ten) {
  try {
    const res = await axios.post(
      `${API_BASE_URL}/auth/register`,
      {
        email,
        password: password,
        full_name: ho_ten,
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    return res.data; // user object
  } catch (err) {
    if (err.response) return err.response.data;
    throw err;
  }
}

export const loginWithGoogle = async (idToken) => {
  const res = await axios.post(`${API_BASE_URL}/auth/logingoogle`, {
    id_token: idToken,
  });
  return res.data;
};

export async function forgotPassword(email) {
  try {
    const res = await axios.post(`${API_BASE_URL}/auth/forgot-password`, {
      email,
    });
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
}

export async function resetPassword(token, newPassword) {
  try {
    const res = await axios.post(`${API_BASE_URL}/auth/reset-password`, {
      token,
      new_password: newPassword,
    });
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
}

export const getUserProfile = async (token) => {
  const res = await axios.get(`${API_BASE_URL}/user/account/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const changePassword = async (old_password, new_password, token) => {
  const res = await axios.put(
    `${API_BASE_URL}/auth/change-password`,
    { old_password, new_password },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return res.data;
};
