import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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
        const response = await axios.get(`http://localhost:8000/user/login?username=${username}&pswd=${password}`);
        if (response.data.Login === "Successful") {
            setError(null);
            alert('Login successful!');
            navigate('/mealPlanGenerator');
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
        <div style={{ maxWidth: '400px', margin: '0 auto' }}>
            <form onSubmit={isLoginMode ? handleLogin : handleCreateAccount}>
                <div>
                <label>Username:</label>
                <input type="text" value={username} onChange={e => setUsername(e.target.value)} required />
                </div>
                <div>
                    <label>Password:</label>
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
                </div>

                {!isLoginMode && (
                <>
                    <div>
                    <label>Gender:</label>
                    <input type="text" value={gender} onChange={e => setGender(e.target.value)} required />
                    </div>
                    <div>
                    <label>Birthday:</label>
                    <input type="date" value={birthday} onChange={e => setBirthday(e.target.value)} required />
                    </div>
                    <div>
                    <label>Height (cm):</label>
                    <input type="number" value={height_cm} onChange={e => setHeight_cm(e.target.value)} required />
                    </div>
                    <div>
                    <label>Weight (kg):</label>
                    <input type="number" value={weight_kgs} onChange={e => setWeight_kgs(e.target.value)} required />
                    </div>
                    <div>
                    <label>Dietary Restrictions (comma separated):</label>
                    <input
                        type="text"
                        value={dietary_restrictions}
                        onChange={e => setDietary_restrictions(e.target.value)}
                    />
                    </div>
                </>
                )}
                <button type="submit">{isLoginMode ? 'Log In' : 'Create Account'}</button>
            </form>
            <button onClick={() => setIsLoginMode(!isLoginMode)} style={{ marginTop: '10px' }}>
                {isLoginMode ? 'Create Account' : 'Back to Login'}
            </button>
        </div>
    );
};

export default Login;