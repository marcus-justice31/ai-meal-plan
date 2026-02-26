import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Card, Button } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import '../Styles/Dashboard.css';

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
    <div className="dashboard-wrapper">

        {/* Top Navbar */}
        <div className="top-navbar">
            <div className="brand">AI MEAL PERFORMANCE</div>
            <div className="nav-right">
                <span className="user-name">{username}</span>
                <div className="avatar-circle">MU</div>
            </div>
        </div>

        <div className="dashboard-body">

            {/* Sidebar */}
            <div className="sidebar">
                <div className="sidebar-item active">Dashboard</div>
                <div className="sidebar-item">My Plans</div>
                <div className="sidebar-item">Progress</div>
                <div className="sidebar-item">Macros</div>
                <div className="sidebar-item">Settings</div>
            </div>

            {/* Main Content */}
            <div className="dashboard-content">
                
                <div className="dashboard-header">
                    <h4 className="dashboard-title">
                        Meal Plans Overview
                    </h4>

                    <Button
                        className="generate-btn"
                        onClick={() => navigate('/mealPlanGenerator', { state: { username } })
                        }
                    >
                        + Create New Plan
                    </Button>
                </div>

                {mealPlans.length === 0 ? (
                    <div className="empty-state">
                        No meal plans found.
                    </div>
                ) : (
                    mealPlans.map((plan) => (
                        <div key={plan.id} className="plan-card">
                            <div className="d-flex justify-content-between align-items-center">
                                <div className="plan-info">
                                    <h6>{plan.goal.toUpperCase()}</h6>
                                    <p>
                                        {plan.activity_level} • {plan.creation_date}
                                    </p>
                                </div>

                                <Button
                                    className="view-btn"
                                    size="sm"
                                    onClick={() => handleViewMealPlan(plan)}
                                >
                                    VIEW PLAN
                                </Button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    </div>
);
};

export default Dashboard;
