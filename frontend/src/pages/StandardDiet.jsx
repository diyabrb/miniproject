import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { useRef } from "react";

const meals = {
  Breakfast: [
    { name: "Oatmeal with Berries", img: "breakfast1.jpg", calories: 350, time: "10 min" },
    { name: "Whole Wheat Toast & Peanut Butter", img: "breakfast2.jpg", calories: 320, time: "8 min" },
    { name: "Scrambled Eggs & Spinach", img: "breakfast3.jpg", calories: 300, time: "12 min" },
    { name: "Smoothie with Almond Milk", img: "breakfast4.jpg", calories: 280, time: "7 min" },
    { name: "Greek Yogurt with Nuts", img: "breakfast5.jpg", calories: 310, time: "5 min" }
  ],
  Lunch: [
    { name: "Grilled Chicken Salad", img: "lunch1.jpg", calories: 400, time: "20 min" },
    { name: "Quinoa & Roasted Veggies", img: "lunch2.jpg", calories: 420, time: "18 min" },
    { name: "Lentil Soup with Whole Wheat Bread", img: "lunch3.jpg", calories: 380, time: "25 min" },
    { name: "Grilled Fish & Steamed Broccoli", img: "lunch4.jpg", calories: 450, time: "22 min" },
    { name: "Chickpea Stir-Fry", img: "lunch5.jpg", calories: 390, time: "15 min" }
  ],
  Dinner: [
    { name: "Baked Salmon with Asparagus", img: "dinner1.jpg", calories: 500, time: "30 min" },
    { name: "Stuffed Bell Peppers", img: "dinner2.jpg", calories: 430, time: "28 min" },
    { name: "Grilled Tofu with Brown Rice", img: "dinner3.jpg", calories: 420, time: "35 min" },
    { name: "Vegetable Curry & Quinoa", img: "dinner4.jpg", calories: 460, time: "40 min" },
    { name: "Zucchini Noodles with Pesto", img: "dinner5.jpg", calories: 350, time: "25 min" }
  ]
};

export default function StandardDiet() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-10 text-center">
      {/* Header Section */}
      <h1 className="text-3xl md:text-4xl font-bold mb-3 text-gray-900 tracking-tight">
        Balanced Nutrition for Every Meal
      </h1>
      <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto mb-6">
        A curated selection of delicious and healthy meal options to keep you energized and fit.
      </p>

      {/* Display Meal Sections */}
      {Object.entries(meals).map(([category, mealList]) => (
        <MealSection key={category} category={category} meals={mealList} />
      ))}
    </div>
  );
}

function MealSection({ category, meals }) {
  const scrollRef = useRef(null);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  return (
    <div className="mb-10">
      {/* Category Title */}
      <h2 className="text-xl md:text-2xl font-semibold text-green-700 mb-4">{category}</h2>

      {/* Scrollable Meal Section without Scrollbar */}
      <div className="relative">
        <button
          className="absolute left-0 top-1/2 transform -translate-y-1/2 p-2 bg-gray-200 rounded-full shadow-md hover:bg-gray-300 transition z-10"
          onClick={scrollLeft}
        >
          <FaArrowLeft />
        </button>

        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth px-6 hide-scrollbar"
        >
          {meals.map((meal, index) => (
            <div
              key={index}
              className="w-56 min-w-[230px] bg-white shadow-md rounded-lg overflow-hidden snap-center"
            >
              <img src={meal.img} alt={meal.name} className="w-full h-28 sm:h-36 object-cover" />
              <div className="p-3">
                <h3 className="text-sm sm:text-lg font-medium">{meal.name}</h3>
                <p className="text-gray-500 text-xs sm:text-sm">{meal.calories} cal • {meal.time}</p>
              </div>
            </div>
          ))}
        </div>

        <button
          className="absolute right-0 top-1/2 transform -translate-y-1/2 p-2 bg-gray-200 rounded-full shadow-md hover:bg-gray-300 transition z-10"
          onClick={scrollRight}
        >
          <FaArrowRight />
        </button>
      </div>
    </div>
  );
}