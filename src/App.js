import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './Components/Dashboard';
import Login from './Components/Login';
import MealPlanGenerator from './Components/MealPlanGenerator';
import MealPlanResults from "./Components/MealPlanResults";



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/mealPlanGenerator" element={<MealPlanGenerator />} />
        <Route path="/mealPlanResults" element={<MealPlanResults />} />
      </Routes>
    </Router>
  ) 
}

export default App;
