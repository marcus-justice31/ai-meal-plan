import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './Components/Dashboard';
import Login from './Components/Login';
import MealPlanGenerator from './Components/MealPlanGenerator';
import MealPlanResults from "./Components/MealPlanResults";



function App() {
  return (
    <Router>
      <Routes>
        {/* Default route redirects to /login */}
        <Route path="/" element={<Navigate to="/login" />} />

        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/mealPlanGenerator" element={<MealPlanGenerator />} />
        <Route path="/mealPlanResults" element={<MealPlanResults />} />
      </Routes>
    </Router>
  ) 
}

export default App;
