import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const MealPlanGenerator = () => {
    const navigate = useNavigate();
    const [activity_level, setActivity_level] = useState('');
    const [goal, setGoal] = useState('');
    
const handleMealGeneration = async (e) => {
    // e.preventDefault();
    // try {
    //     const response = await axios.post(`http://localhost:8000/user/${username}/generate_meal_plan`)

    // } catch (err) {
    //     alert('Error')
    // }

}

    return (
        <div style={{ maxWidth: '400px', margin: '0 auto' }}>
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
        </div>
         
    );    
}

export default MealPlanGenerator;