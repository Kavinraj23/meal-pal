import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import { toast } from "react-toastify";
import mealPalLogo from "../assets/images/meal-pal-logo.png";

const QuizPage = () => {
  const navigate = useNavigate();
  const [cookies, removeCookie] = useCookies([]);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    dietaryPreference: "",
    allergies: [],
    weeklyBudget: 50,
  });

  useEffect(() => {
    const verifyCookie = async () => {
      if (!cookies.token) {
        navigate("/");
      }
      const { data } = await axios.post(
        "http://localhost:4000",
        {},
        { withCredentials: true }
      );
      const { status } = data;
      if (!status) {
        removeCookie("token");
        navigate("/");
      }
    };
    verifyCookie();
  }, [cookies, navigate, removeCookie]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAllergyChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => {
      if (checked) {
        return { ...prev, allergies: [...prev.allergies, value] };
      } else {
        return {
          ...prev,
          allergies: prev.allergies.filter((allergy) => allergy !== value),
        };
      }
    });
  };

  const handleSliderChange = (e) => {
    setFormData((prev) => ({ ...prev, weeklyBudget: Number(e.target.value) }));
  };

  const nextStep = () => {
    setStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setStep((prev) => prev - 1);
  };

  // Handle quiz form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const preferences = {
      dietaryPreference: formData.dietaryPreference,
      allergies: formData.allergies,
      weeklyBudget: formData.weeklyBudget,
    };

    try {
      const response = await axios.post(
        "http://localhost:4000/submit-quiz",
        { preferences }, // Send the form data to the backend
        { withCredentials: true } // Ensure the cookie is sent with the request
      );
      const { data } = response;
      console.log(data);
      if (data.success) {
        toast.success(data.message, { position: "bottom-left" });
        navigate("/home"); // Or another page after quiz submission
      } else {
        toast.error(data.message, { position: "bottom-left" });
      }
    } catch (error) {
      console.error("Error submitting quiz:", error);
      toast.error("An error occurred. Please try again later.", {
        position: "bottom-left",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <div className="flex justify-between items-center p-4 bg-blue-500">
        <div className="text-white font-bold text-xl">
          <img src={mealPalLogo} alt="MealPal Logo" className="h-8" />
        </div>
        <div>
          <button
            onClick={() => {
              removeCookie("token");
              navigate("/");
            }}
            className="px-4 py-2 border border-white text-white rounded-md hover:bg-white hover:text-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl">
          {/* Welcome Message */}
          <div className="text-center mb-6">
            <h2 className="text-3xl font-semibold text-gray-800">
              Welcome to MealPal!
            </h2>
            <h3 className="text-lg text-gray-600 mt-2">
              Let's get to know you better to personalize your meal planning
              experience.
            </h3>
          </div>

          {/* Quiz Steps */}
          {step === 1 && (
            <div className="quiz-step space-y-6">
              <h2 className="text-xl font-semibold text-gray-800">
                Step 1: Dietary Preference
              </h2>
              <label className="block text-gray-700">
                Choose your dietary preference:
                <select
                  name="dietaryPreference"
                  value={formData.dietaryPreference}
                  onChange={handleChange}
                  className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">--Select--</option>
                  <option value="Vegetarian">Vegetarian</option>
                  <option value="Vegan">Vegan</option>
                  <option value="Gluten-Free">Gluten-Free</option>
                  <option value="Halal">Halal</option>
                  <option value="Kosher">Kosher</option>
                  <option value="None">None</option>
                </select>
              </label>
              <button
                onClick={nextStep}
                disabled={!formData.dietaryPreference}
                className={`w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  !formData.dietaryPreference
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                Next
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="quiz-step space-y-6">
              <h2 className="text-xl font-semibold text-gray-800">
                Step 2: Allergies
              </h2>
              <p className="text-gray-700">Select any allergies:</p>
              <div className="space-y-2">
                {["Peanuts", "Gluten", "Dairy", "Eggs"].map((allergy) => (
                  <label key={allergy} className="block text-gray-700">
                    <input
                      type="checkbox"
                      name="allergies"
                      value={allergy}
                      checked={formData.allergies.includes(allergy)}
                      onChange={handleAllergyChange}
                      className="mr-2 leading-tight"
                    />
                    {allergy}
                  </label>
                ))}
              </div>
              <div className="flex justify-between">
                <button
                  onClick={prevStep}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none"
                >
                  Back
                </button>
                <button
                  onClick={nextStep}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="quiz-step space-y-6">
              <h2 className="text-xl font-semibold text-gray-800">
                Step 3: Weekly Budget
              </h2>
              <label className="block text-gray-700">
                Select your weekly grocery budget:
                <input
                  type="range"
                  name="weeklyBudget"
                  min="10"
                  max="200"
                  step="10"
                  value={formData.weeklyBudget}
                  onChange={handleSliderChange}
                  className="w-full"
                />
                <span className="block mt-2 text-gray-600">
                  ${formData.weeklyBudget}
                </span>
              </label>
              <div className="flex justify-between">
                <button
                  onClick={prevStep}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none"
                >
                  Submit
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizPage;
