import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { Card, Table } from 'react-bootstrap';

const MealPlanResults = () => {
    const location = useLocation();
    const { username } = location.state;
    const [mealPlan, setMealPlan] = useState(null);

    useEffect(() => {
        const fetchMealPlan = async () => {
            try {
                const res = await axios.get(`http://localhost:8000/user/${username}/meal_plan`);
                setMealPlan(JSON.parse(res.data.meal_plan)); 
            } catch (err) {
                console.error('Error fetching meal plan:', err);
            }
        };
        fetchMealPlan();
    }, [username]);

    if (!mealPlan) {
    return <p className="text-center mt-5">Loading meal plan...</p>;
    }

    const { macroTargets, week } = mealPlan;

return (
    <div className="container my-4">
        <h2 className="text-center mb-4">Your Weekly Meal Plan</h2>

        <Card className="mb-4 shadow-sm">
        <Card.Body>
            <h5>Daily Macro Targets</h5>
            <p><strong>Calories:</strong> {macroTargets.calories} kcal</p>
            <p><strong>Protein:</strong> {macroTargets.protein_g} g</p>
            <p><strong>Carbs:</strong> {macroTargets.carbs_g} g</p>
            <p><strong>Fat:</strong> {macroTargets.fat_g} g</p>
        </Card.Body>
        </Card>
        
        {week.map((dayPlan) => (
            <Card key={dayPlan.day} className="mb-3 shadow-sm">
                <Card.Header className="bg-primary text-white fw-bold">
                    {dayPlan.day}
                </Card.Header>
            <Card.Body>
                
                <Table striped bordered hover>
                    <thead>
                        <tr>
                        <th>Meal</th>
                        <th>Calories</th>
                        <th>Protein (g)</th>
                        <th>Carbs (g)</th>
                        <th>Fat (g)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dayPlan.meals.map((meal, idx) => (
                        <tr key={idx}>
                            <td>{meal.name}</td>
                            <td>{meal.calories}</td>
                            <td>{meal.protein}</td>
                            <td>{meal.carbs}</td>
                            <td>{meal.fat}</td>
                        </tr>
                        ))}
                    </tbody>
                </Table>

                <div className="text-end">
                    <strong>Total: </strong>{dayPlan.totalDailyCalories} kcal |
                    P: {dayPlan.totalDailyMacros.protein}g | 
                    C: {dayPlan.totalDailyMacros.carbs}g | 
                    F: {dayPlan.totalDailyMacros.fat}g
                </div>
            </Card.Body>
            </Card>
        ))}
    </div>
);

};

export default MealPlanResults;