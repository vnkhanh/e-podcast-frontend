import { useEffect, useCallback } from "react";
import { loginWithGoogle } from "../services/api_auth";
import { message, Modal } from "antd";
import { useNavigate } from "react-router-dom";

function GoogleLoginButton() {
  const navigate = useNavigate();

  const handleCredentialResponse = useCallback(
    async (response) => {
      const idToken = response.credential;
      try {
        const data = await loginWithGoogle(idToken);

        if (data?.token) {
          message.success("Đăng nhập thành công!");
          console.log("Đăng nhập thành công:", data);

          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));

          const role =
            data.user.role?.toLowerCase() || data.user.vai_tro?.toLowerCase();
          if (role === "admin") navigate("/admin");
          else if (role === "teacher") navigate("/teacher");
          else navigate("/");
        } else {
          // Nếu backend trả lỗi (không có token)
          const errMsg =
            data?.error || data?.message || "Đăng nhập Google thất bại!";
          if (
            errMsg.toLowerCase().includes("tạm khóa") ||
            errMsg.toLowerCase().includes("vô hiệu")
          ) {
            Modal.error({
              title: "Tài khoản bị vô hiệu hóa",
              content: (
                <div>
                  <p>
                    {errMsg}. Vui lòng liên hệ quản trị viên để được hỗ trợ mở
                    khóa tài khoản.
                  </p>
                </div>
              ),
              centered: true,
            });
          } else {
            message.error(errMsg);
          }
        }
      } catch (error) {
        console.error("Lỗi login Google:", error.response?.data || error);

        const errMsg =
          error?.response?.data?.error ||
          error?.response?.data?.message ||
          "Không thể đăng nhập bằng Google!";

        if (
          errMsg.toLowerCase().includes("tạm khóa") ||
          errMsg.toLowerCase().includes("vô hiệu")
        ) {
          Modal.error({
            title: "Tài khoản bị vô hiệu hóa",
            content: (
              <div>
                <p>
                  {errMsg}. Vui lòng liên hệ quản trị viên để được hỗ trợ mở
                  khóa tài khoản.
                </p>
              </div>
            ),
            centered: true,
          });
        } else {
          message.error(errMsg);
        }
      }
    },
    [navigate]
  );

  useEffect(() => {
    /* global google */
    google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
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
