import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

const Home = () => {
  const navigate = useNavigate();
  const [cookies, removeCookie] = useCookies([]);
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyCookie = async () => {
      try {
        if (!cookies.token) {
          navigate("/");
          return;
        }

        const { data } = await axios.post(
          "http://localhost:4000",
          {},
          { withCredentials: true }
        );

        console.log("API Response:", data); // Log API response

        const { status, user } = data;

        if (status) {
          setUsername(user);
          setLoading(false);
        } else {
          removeCookie("token");
          navigate("/");
        }
      } catch (err) {
        console.error("Error verifying cookie:", err);
        removeCookie("token"); // Remove cookie on error
        navigate("/");
      }
    };

    verifyCookie();
  }, [cookies, navigate, removeCookie]); // Ensure useEffect runs only on changes

  const Logout = () => {
    removeCookie("token"); // remove token cookie on logout
    navigate("/");
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="">
        <h4>
          {" "}
          Welcome <span>{username}</span>
        </h4>
        <button onClick={Logout}>LOGOUT</button>
      </div>
      <ToastContainer />
    </>
  );
};

export default Home;
