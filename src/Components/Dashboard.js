import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Card, Button } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';

const Dashboard = () => {
    const location = useLocation();
    const { username } = location.state;
    const [mealPlans, setMealPlans] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (!username) {
            alert('Your session has expired. Please log in again.');
            navigate('/login');
            return; 
        }

    const fetchMealPlans = async () => {
        try {
            const res = await axios.get(`http://localhost:8000/user/${username}/meal_plans`);
            setMealPlans(res.data);
        } catch (err) {
            console.error('Error fetching meal plans:', err);
            }
        };
            fetchMealPlans();
    }, [username, navigate]);

    const handleViewMealPlan = (mealPlan) => {
        navigate('/mealPlanResults', { state: { username, mealPlanJson: mealPlan.meal_plan } });
    };

return (
    <div className="container my-4">
    <Card className="shadow-sm">
        <Card.Header className="d-flex justify-content-between align-items-center">
            <h4 className="mb-0">Your Meal Plan Dashboard</h4>
            <Button
                variant="success"
                onClick={() => navigate('/mealPlanGenerator', { state: { username } })}
            >
            + Generate New Plan
            </Button>
        </Card.Header>

        <Card.Body>
            {mealPlans.length === 0 ? (
                <p className="text-center text-muted">No meal plans found.</p>
            ) : (
            <Table striped bordered hover responsive>
                <thead className="table-primary">
                <tr>
                    <th>#</th>
                    <th>Date Created</th>
                    <th>Goal</th>
                    <th>Activity Level</th>
                    <th>Action</th>
                </tr>
                </thead>

                <tbody>
                    {mealPlans.map((plan, index) => (
                    <tr key={plan.id}>
                        <td>{index + 1}</td>
                        <td>{plan.creation_date}</td>
                        <td>{plan.goal}</td>
                        <td>{plan.activity_level}</td>
                        <td>
                            <Button
                                variant="primary"
                                size="sm"
                                onClick={() => handleViewMealPlan(plan)}
                            >
                            View Plan
                            </Button>
                        </td>
                    </tr>
                    ))}
                </tbody>
            </Table>
            )}
        </Card.Body>
    </Card>
    </div>
    );
};

export default Dashboard;
