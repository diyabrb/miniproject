import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { useRef } from "react";

const meals = {
  Breakfast: [
    { name: "Avocado Toast with Poached Eggs", img: "https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=1200&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YXZhY2FkbyUyMHRvYXN0JTIwd2l0aCUyMGVnZ3xlbnwwfHwwfHx8MA%3D%3D", calories: 380, time: "15 min" },
    { name: "Greek Yogurt Bowl", img: "https://images.unsplash.com/photo-1627308595228-9d0497edbe74?w=1200&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHlvZ3VydCUyMGJvd2x8ZW58MHx8MHx8fDA%3D", calories: 290, time: "5 min" },
    { name: "Overnight Oats", img: "https://images.unsplash.com/photo-1583687463124-ff2aa00b1160?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", calories: 340, time: "8 min" },
    { name: "Smoothie Bowl", img: "https://images.unsplash.com/photo-1590301157284-ab2f8707bdc1?q=80&w=1035&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", calories: 310, time: "10 min" },
    { name: "Banana Pancakes", img: "https://images.unsplash.com/photo-1630661297756-15265d08960d?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", calories: 360, time: "12 min" },
    { name: "Chia Pudding", img: "https://images.unsplash.com/photo-1597401661415-96be66b75a09?w=1200&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fGNoaWElMjBwdWRkaW5nfGVufDB8fDB8fHww", calories: 280, time: "10 min" }
  ],
  Lunch: [
    { name: "Quinoa Buddha Bowl", img: "https://images.unsplash.com/photo-1562923690-e274ba919781?w=1200&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8cXVpbm9hfGVufDB8fDB8fHww", calories: 420, time: "20 min" },
    { name: "Mediterranean Salad", img: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=1200&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fG1lZGl0ZXJyYW5lbiUyMHNhbGFkfGVufDB8fDB8fHww", calories: 380, time: "15 min" },
    { name: "Grilled Chicken Wrap", img: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=1200&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2hpY2tlbiUyMHdyYXB8ZW58MHx8MHx8fDA%3D", calories: 450, time: "25 min" },
    { name: "Poke Bowl", img: "https://images.unsplash.com/photo-1604259596863-57153177d40b?w=1200&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cG9rZSUyMGJvd2x8ZW58MHx8MHx8fDA%3D", calories: 400, time: "18 min" },
    { name: "Veggie Burrito", img: "https://images.unsplash.com/photo-1662116765994-1e4200c43589?q=80&w=1032&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", calories: 390, time: "20 min" },
    { name: "Teriyaki Tofu Bowl", img: "https://images.unsplash.com/photo-1625540002162-00320b5c6b63?w=1200&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fHRlcml5YWtpJTIwdG9mdXxlbnwwfHwwfHx8MA%3D%3D", calories: 370, time: "22 min" }
  ],
  Dinner: [
    { name: "Salmon with Roasted Vegetables", img: "https://images.unsplash.com/photo-1593819559713-743d364eb059?w=1200&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8dGVyaXlha2l8ZW58MHx8MHx8fDA%3D", calories: 520, time: "30 min" },
    { name: "Vegetarian Stir-Fry", img: "https://images.unsplash.com/photo-1626451542138-1f86835340ec?w=1200&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8dmVnZXRhYmxlJTIwYm93bHxlbnwwfHwwfHx8MA%3D%3D", calories: 380, time: "25 min" },
    { name: "Grilled Steak with Sweet Potato", img: "https://images.unsplash.com/photo-1623765306406-b8bad9a7644c?w=1200&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Z3JpbGxlZCUyMHN0ZWFrJTIwd2l0aCUyMHBvdGF0b3xlbnwwfHwwfHx8MA%3D%3D", calories: 580, time: "35 min" },
    { name: "Herb-Roasted Chicken", img: "https://images.unsplash.com/photo-1567121938596-6d9d015d348b?w=1200&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8SGVyYiUyMCUyMCUyMHJvYXN0ZWQlMjBjaGlja2VufGVufDB8fDB8fHww.jpg", calories: 490, time: "45 min" },
    { name: "Pasta Primavera", img: "https://images.unsplash.com/photo-1522666257812-173fdc2d11fe?q=80&w=1035&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D.jpg", calories: 400, time: "28 min" },
    { name: "Mushroom Risotto", img: "https://images.unsplash.com/photo-1595908129746-57ca1a63dd4d?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", calories: 410, time: "30 min" }
  ]
};

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12 text-center">
      {/* Header Section */}
      <h1 className="text-3xl md:text-4xl font-bold mb-3 text-gray-900 tracking-tight">
        Discover Nutritious & Delicious Meals
      </h1>
      <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto mb-6">
        Explore a curated selection of balanced meals designed to keep you healthy and energized.
      </p>

      {/* Display Meals by Category */}
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

      {/* Scrollable Meal Section */}
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
