import mealPalLogo from "../assets/images/meal-pal-logo.png";

const LandingContent = () => {
  return (
    <div className="w-full md:w-1/2 h-1/2 md:h-full bg-blue-100 p-8 flex flex-col justify-center items-center">
      <img src={mealPalLogo} alt="MealPal Logo" className="h-16 mb-4" />
      <p className="text-xl text-center mb-8">
        Plan your meals easily, save time, and eat better.
      </p>
    </div>
  );
};

export default LandingContent;
