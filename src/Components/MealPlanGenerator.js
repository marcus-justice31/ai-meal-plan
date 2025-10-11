import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import Spinner from 'react-bootstrap/Spinner';

const MealPlanGenerator = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { username } = location.state;
    const [activity_level, setActivity_level] = useState('');
    const [goal, setGoal] = useState('');
    const [loading, setLoading] = useState(false);


    const quote = "Cooking up your personalized nutrition plan...";
    
const handleMealGeneration = async (e) => {
    e.preventDefault();
    setLoading(true)
    try {
        const response = await axios.post(`http://localhost:8000/user/${username}/generate_meal_plan`, {
            activity_level,
            goal
        })
        if (response.data.message === "Successful") {
            alert('Meal plan generated successfully');
            setLoading(false);
            navigate('/mealPlanResults', { state: { username } });
        }
        else
            alert('Unable to generate meal plan')

    } catch (err) {
        alert('Error')
    }

}

    return (
        <div style={{ maxWidth: '400px', margin: '0 auto' }}>
            {loading ? (
                <div className="d-flex flex-column justify-content-center align-items-center vh-100 text-center">
                    <Spinner animation="border" variant="primary" />
                    <p className="mt-3 fs-5 text-muted">{quote}</p>
                </div>
            ) :
                <form onSubmit = {handleMealGeneration}>
                    <div>
                    <label>Activity Level:</label>
                    <input type="text" value={activity_level} onChange={e => setActivity_level(e.target.value)} required />
                    </div>
                    <div>
                    <label>Goal:</label>
                    <input type="text" value={goal} onChange={e => setGoal(e.target.value)} required />
                    </div>
                    <button type="submit">{'Generate Meal Plan'}</button>
                </form>
            }
        </div>
         
    );    
}

export default MealPlanGenerator;