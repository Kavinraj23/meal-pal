import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LandingContent from "../components/LandingContent";
import AuthForm from "../components/AuthForm";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";

const LandingPage = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const { data } = await axios.post(
          "http://localhost:4000/",
          {}, // empty body
          { withCredentials: true } // include jwt cookie
        );

        if (data.status) {
          navigate("/home"); // redirect to home page is jwt is valid
        }
      } catch (error) {
        console.error("User verification failed", error);
      }
    };

    verifyUser();
  }, [navigate]);

  const handleError = (err) =>
    toast.error(err, {
      position: "bottom-left",
    });

  const handleSuccess = (msg) =>
    toast.success(msg, {
      position: "bottom-left",
    });

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <LandingContent />
      <AuthForm
        isLogin={isLogin}
        setIsLogin={setIsLogin}
        handleSuccess={handleSuccess}
        handleError={handleError}
      />

      <ToastContainer />
    </div>
  );
};

export default LandingPage;
