import { useEffect, useCallback } from "react";
import { loginWithGoogle } from "../services/api_auth";
import { message} from "antd";
import { useNavigate } from "react-router-dom";

function GoogleLoginButton() {
    const navigate = useNavigate();
    const handleCredentialResponse = useCallback(async (response) => {
    const idToken = response.credential;
    try {
      const data = await loginWithGoogle(idToken);

      message.success("Đăng nhập thành công!");
      console.log("Đăng nhập thành công:", data);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Redirect sau khi login
      if (data.user.vai_tro === "admin") {
          navigate("/admin");
        } else {
          navigate("/");
        }
    } catch (error) {
      console.error("Lỗi login Google:", error.response?.data || error);
    }
  }, [navigate]);

  useEffect(() => {
    /* global google */
    google.accounts.id.initialize({
      client_id:
        "121001821565-au2kd6go5fuo8dtvtt0d042tvng5sqe0.apps.googleusercontent.com",
      callback: handleCredentialResponse,
    });

    google.accounts.id.renderButton(document.getElementById("googleLoginDiv"), {
      theme: "outline",
      size: "large",
    });
  }, [handleCredentialResponse]);

  return <div id="googleLoginDiv"></div>;
}

export default GoogleLoginButton;
