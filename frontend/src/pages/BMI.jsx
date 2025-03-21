import { useState } from "react";

export default function BMICalculator() {
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [bmi, setBmi] = useState(null);
  const [category, setCategory] = useState("");

  const calculateBMI = () => {
    if (weight && height) {
      const heightInMeters = height / 100; // Convert cm to meters
      const bmiValue = (weight / (heightInMeters * heightInMeters)).toFixed(1);
      setBmi(bmiValue);
      setCategory(getBMICategory(bmiValue));
    }
  };

  const getBMICategory = (bmi) => {
    if (bmi < 18.5) return "Underweight";
    if (bmi < 24.9) return "Normal Weight";
    if (bmi < 29.9) return "Overweight";
    return "Obese";
  };

  return (
    <div className="max-w-lg mx-auto mt-12 p-6 bg-white shadow-lg rounded-lg text-center">
      <h1 className="text-3xl font-bold text-green-600 mb-4">BMI Calculator</h1>
      <p className="text-gray-600 mb-6">Enter your weight and height to calculate your BMI</p>

      {/* Input Fields */}
      <div className="flex flex-col gap-4">
        <input
          type="number"
          placeholder="Weight (kg)"
          className="border rounded-lg p-3 text-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
        />
        <input
          type="number"
          placeholder="Height (cm)"
          className="border rounded-lg p-3 text-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          value={height}
          onChange={(e) => setHeight(e.target.value)}
        />
      </div>

      {/* Calculate Button */}
      <button
        onClick={calculateBMI}
        className="mt-6 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition"
      >
        Calculate BMI
      </button>

      {/* Result Display */}
      {bmi && (
        <div className="mt-6 p-4 bg-gray-100 rounded-lg">
          <h2 className="text-xl font-bold">Your BMI: <span className="text-green-600">{bmi}</span></h2>
          <p className={`text-lg font-semibold mt-2 ${category === "Obese" ? "text-red-600" : "text-green-500"}`}>
            {category}
          </p>
        </div>
      )}
    </div>
  );
}