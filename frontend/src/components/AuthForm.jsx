import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const AuthForm = ({ isLogin, setIsLogin }) => {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState({
    email: "",
    password: "",
    username: "",
  });
  const [errors, setErrors] = useState({}); // Store validation errors

  const { email, password, username } = inputValue;

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setInputValue({
      ...inputValue,
      [name]: value,
    });
  };

  const validateField = (name, value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let error = "";

    if (name === "email") {
      if (!value) {
        error = "Email is required.";
      } else if (!emailRegex.test(value)) {
        error = "Enter a valid email address.";
      }
    }

    if (name === "password") {
      if (!value) {
        error = "Password is required.";
      } else if (value.length < 6) {
        error = "Password must be at least 6 characters long.";
      }
    }

    if (name === "username" && !isLogin) {
      if (!value) {
        error = "Username is required.";
      }
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error,
    }));

    return error === "";
  };

  const validateInputs = () => {
    let valid = true;

    if (!validateField("email", email)) valid = false;
    if (!validateField("password", password)) valid = false;
    if (!isLogin && !validateField("username", username)) valid = false;

    return valid;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateInputs()) return;

    const url = isLogin
      ? "http://localhost:4000/login"
      : "http://localhost:4000/signup";
    const payload = isLogin
      ? { email, password }
      : { email, password, username };

    try {
      const { data } = await axios.post(url, payload, {
        withCredentials: true,
      });

      const { success, message, quizCompleted } = data;
      if (success) {
        toast.success(message, { position: "bottom-left" });

        if (!isLogin) {
          setTimeout(() => {
            console.log("navigating to quiz");
            navigate("/quiz"); // Redirect to quiz after successful signup
          }, 1000);
        } else {
          if (quizCompleted) {
            setTimeout(() => {
              console.log("navigating to home");
              navigate("/home");
            }, 1000);
          } else {
            setTimeout(() => {
              console.log("navigating to quiz");
              navigate("/quiz"); // redirect to quiz if not cmopleted
            }, 1000);
          }
        }
      } else {
        toast.error(message, { position: "bottom-left" });
      }
    } catch (error) {
      console.error("Error during authentication:", error);
      toast.error("Something went wrong. Please try again.", {
        position: "bottom-left",
      });
    }

    // Reset input fields
    setInputValue({
      email: "",
      password: "",
      username: "",
    });
  };

  return (
    <div className="w-full md:w-1/2 h-1/2 md:h-full bg-white p-8 flex flex-col justify-center">
      <h2 className="text-3xl font-bold text-center mb-6">
        {isLogin ? "Login to MealPal" : "Sign Up for MealPal"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {/* Email Field */}
        <div>
          <label htmlFor="email" className="block text-gray-700">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={email}
            placeholder="Enter your email"
            onChange={handleOnChange}
            onBlur={(e) => validateField(e.target.name, e.target.value)}
            className={`w-full px-4 py-2 border ${
              errors.email ? "border-red-500" : "border-gray-300"
            } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email}</p>
          )}
        </div>

        {/* Username Field */}
        {!isLogin && (
          <div>
            <label htmlFor="username" className="block text-gray-700">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={username}
              placeholder="Enter your username"
              onChange={handleOnChange}
              onBlur={(e) => validateField(e.target.name, e.target.value)}
              className={`w-full px-4 py-2 border ${
                errors.username ? "border-red-500" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errors.username && (
              <p className="text-red-500 text-sm">{errors.username}</p>
            )}
          </div>
        )}

        {/* Password Field */}
        <div>
          <label htmlFor="password" className="block text-gray-700">
            Password
          </label>
          <input
            type="password"
            name="password"
            value={password}
            placeholder="Enter your password"
            onChange={handleOnChange}
            onBlur={(e) => validateField(e.target.name, e.target.value)}
            className={`w-full px-4 py-2 border ${
              errors.password ? "border-red-500" : "border-gray-300"
            } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {isLogin ? "Login" : "Sign Up"}
        </button>
      </form>

      {/* Toggle between Login and Sign Up */}
      <div className="text-center mt-4">
        {isLogin ? (
          <>
            Don't have an account?{" "}
            <span
              onClick={() => setIsLogin(false)}
              className="text-blue-500 cursor-pointer"
            >
              Sign Up
            </span>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <span
              onClick={() => setIsLogin(true)}
              className="text-blue-500 cursor-pointer"
            >
              Log In
            </span>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthForm;
