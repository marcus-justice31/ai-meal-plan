import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card'

const Login = () => {
    const navigate = useNavigate();
    const [isLoginMode, setIsLoginMode] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [gender, setGender] = useState('');
    const [birthday, setBirthday] = useState('');
    const [height_cm, setHeight_cm] = useState('');
    const [weight_kgs, setWeight_kgs] = useState('');
    const [dietary_restrictions, setDietary_restrictions] = useState('');
    const [error, setError] = useState(null);

// Login using FastAPI
const handleLogin = async (e) => {
    e.preventDefault();
    try {
        // Attempt login via FastAPI endpoint
        const response = await axios.post(`http://localhost:8000/user/login`, {
            username,
            password
        });
        if (response.data.Login === "Successful") {
            setError(null);
            alert('Login successful!');
            navigate('/mealPlanGenerator',  { state: { username } });
        }
    } catch (err) {
        // Handle error from FastAPI (invalid credentials)
        setError('Invalid credentials');
        alert('Invalid credentials');
    }
};

const handleCreateAccount = async (e) => {
    e.preventDefault();

    const birthdayString = birthday; // Ensure birthday is sent as a string and already in "yyyy-mm-dd"

    try {
        const response = await axios.post(`http://localhost:8000/user/create`, {
            username,
            password,
            gender,
            birthday: birthdayString,
            height_cm: parseInt(height_cm),
            weight_kg: parseInt(weight_kgs),
            dietary_restrictions: dietary_restrictions.split(',').map(d => d.trim())
        });
        if (response.data.message === "Successful") {
            alert('New user created')
        }
        else {
            alert('Failed to create user')
        }
    } catch (err) {
        alert('Error')
    }
}

    return (
        <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
            <Card style={{ width: '24rem' }} className="p-4 shadow-sm">
            <h3 className="text-center mb-4">{isLoginMode ? 'Login' : 'Create Account'}</h3>
            <Form onSubmit={isLoginMode ? handleLogin : handleCreateAccount}>
                <Form.Group className="mb-3" controlId="formUsername">
                    <Form.Label>Username</Form.Label>
                    <Form.Control 
                            type="text" 
                            value={username} 
                            onChange={e => setUsername(e.target.value)}
                            required
                        />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="text"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                    />
                </Form.Group>

                {!isLoginMode && ( // need to create a dropdown menu for gender
                <>
                    <Form.Group className="mb-3" controlId="formGender">
                        <Form.Label>Gender</Form.Label>
                        <Form.Control
                            type="text"
                            value={gender}
                            onChange={e => setGender(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBirthday">
                        <Form.Label>Birthday</Form.Label>
                        <Form.Control
                            type="date"
                            value={birthday}
                            onChange={e => setBirthday(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formHeight">
                        <Form.Label>Height (cm)</Form.Label>
                        <Form.Control
                            type="number"
                            value={height_cm}
                            onChange={e => setHeight_cm(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formWeight">
                        <Form.Label>Weight (kg)</Form.Label>
                        <Form.Control
                            type="number"
                            value={weight_kgs}
                            onChange={e => setWeight_kgs(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formRestrictions">
                        <Form.Label>Dietary Restrictions (comma separated)</Form.Label>
                        <Form.Control
                            type="text"
                            value={dietary_restrictions}
                            onChange={e => setDietary_restrictions(e.target.value)}
                        />
                    </Form.Group>
                    <Button variant="primary" type="submit" className="w-100">
                        {isLoginMode ? 'Log In' : 'Create Account'}
                    </Button>
                </>
                )}
            </Form>
            <Button
                    variant="link"
                    onClick={() => setIsLoginMode(!isLoginMode)}
                    className="w-100 mt-3"
                >
                    {isLoginMode ? 'Create Account' : 'Back to Login'}
            </Button>
            </Card>
        </div>
    );
};

export default Login;