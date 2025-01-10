import { useState } from "react";
import LandingContent from "../components/LandingContent";
import AuthForm from "../components/AuthForm";

const LandingPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <LandingContent />
      <AuthForm isLogin={isLogin} setIsLogin={setIsLogin} />
    </div>
  );
};

export default LandingPage;
