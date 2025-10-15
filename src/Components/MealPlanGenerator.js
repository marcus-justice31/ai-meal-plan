import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import Spinner from 'react-bootstrap/Spinner';
import { Card, Form, Container, Button } from 'react-bootstrap';

const MealPlanGenerator = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { username } = location.state;
    const [activity_level, setActivity_level] = useState('');
    const [goal, setGoal] = useState('');
    const [loading, setLoading] = useState(false);


    const quote = "Cooking up your personalized nutrition plan...";

    useEffect(() => {
        if (!username) {
            alert('Your session has expired. Please log in again.');
            navigate('/login');
            return; 
        }
    
    }, [username, navigate]);
    
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
        <Container className="d-flex justify-content-center align-items-center min-vh-100">
            {loading ? (
                <div className="text-center">
                    <Spinner animation="border" variant="primary" style={{ width: '4rem', height: '4rem' }} />
                    <p className="mt-4 fs-5 text-muted">{quote}</p>
                </div>
            ) :
            <Card className="p-4" style={{ width: '100%', maxWidth: '450px', borderRadius: '1rem' }}>
                <Card.Body>
                    <Card.Title className="text-center mb-4 fs-4 fw-bold text-primary">
                    Generate Your Meal Plan
                    </Card.Title>
                    <Form onSubmit = {handleMealGeneration}>
                        <Form.Group className="mb-3" controlId="formActivityLevel"></Form.Group>
                        <Form.Label>Activity Level:</Form.Label>
                        <Form.Control 
                                type="text" 
                                value={activity_level} 
                                onChange={e => setActivity_level(e.target.value)}
                                required
                        />
                        <Form.Label>Goal:</Form.Label>
                        <Form.Control 
                                type="text" 
                                value={goal} 
                                onChange={e => setGoal(e.target.value)}
                                required
                                className="mb-3"
                        />
                        <Button
                            variant="primary"
                            type="submit"
                            className="w-100 fw-semibold"
                            style={{ borderRadius: '8px' }}
                        >
                            Generate Meal Plan
                        </Button>
                    </Form>
                    <div className="text-center mt-3">
                        <Button
                            variant="link"
                            className="text-secondary"
                            onClick={() => navigate('/dashboard', { state: { username } })}
                        >
                            Back to Dashboard
                        </Button>
                    </div>
                </Card.Body>
            </Card>
            }
        </Container> 
    );    
};

export default MealPlanGenerator;