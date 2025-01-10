import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const QuizPage = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    dietaryPreference: "",
    allergies: [],
    weeklyBudget: 50,
  });

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:4000/quiz",
        formData,
        {
          withCredentials: true,
        }
      );
      const { success, message } = response.data;
      if (success) {
        toast.success(message, { position: "bottom-left" });
        navigate("/home");
      } else {
        toast.error(message, { position: "bottom-left" });
      }
    } catch (error) {
      console.error("Error during quiz submission: ", error);
      toast.error("Something went wrong. Please try again.", {
        position: "bottom-left",
      });
    }
  };

  return (
    <div className="quiz-container">
      {step === 1 && (
        <div className="quiz-step">
          <h2>Step 1: Dietary Preference</h2>
          <label>
            Choose your dietary preference:
            <select
              name="dietaryPreference"
              value={formData.dietaryPreference}
              onChange={handleChange}
            >
              <option value="">--Select--</option>
              <option value="Vegetarian">Vegetarian</option>
              <option value="Vegan">Vegan</option>
              <option value="Pescatarian">Pescatarian</option>
              <option value="None">None</option>
            </select>
          </label>
          <button onClick={nextStep} disabled={!formData.dietaryPreference}>
            Next
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="quiz-step">
          <h2>Step 2: Allergies</h2>
          <p>Select any allergies:</p>
          <label>
            <input
              type="checkbox"
              name="allergies"
              value="Peanuts"
              checked={formData.allergies.includes("Peanuts")}
              onChange={handleAllergyChange}
            />
            Peanuts
          </label>
          <label>
            <input
              type="checkbox"
              name="allergies"
              value="Gluten"
              checked={formData.allergies.includes("Gluten")}
              onChange={handleAllergyChange}
            />
            Gluten
          </label>
          <label>
            <input
              type="checkbox"
              name="allergies"
              value="Dairy"
              checked={formData.allergies.includes("Dairy")}
              onChange={handleAllergyChange}
            />
            Dairy
          </label>
          <label>
            <input
              type="checkbox"
              name="allergies"
              value="Eggs"
              checked={formData.allergies.includes("Eggs")}
              onChange={handleAllergyChange}
            />
            Eggs
          </label>
          <div>
            <button onClick={prevStep}>Back</button>
            <button onClick={nextStep}>Next</button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="quiz-step">
          <h2>Step 3: Weekly Budget</h2>
          <label>
            Select your weekly grocery budget:
            <input
              type="range"
              name="weeklyBudget"
              min="10"
              max="200"
              step="10"
              value={formData.weeklyBudget}
              onChange={handleSliderChange}
            />
            <span>${formData.weeklyBudget}</span>
          </label>
          <div>
            <button onClick={prevStep}>Back</button>
            <button onClick={handleSubmit}>Submit</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizPage;
