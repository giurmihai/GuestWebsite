import React, { useEffect, useState } from 'react';
import './Interface.css';
import GoogleLoginButton from './GoogleLoginButton';

function Interface() {


    // Get the id of the website.
    const [value, setValue] = useState(0);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('./idwebsite.txt');
                const data = await response.text();
                setValue(data);
            } catch (error) {
                console.log('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    

    //Variables for login
    const [emailLogin, setEmailLogin] = useState('');
    const [passwordLogin, setPasswordLogin] = useState('');

    async function verifyLogin() {
        const requestOptions = {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                emailLogin: emailLogin,
                passwordLogin: passwordLogin
            })

        }
        const response = await fetch(`${process.env.REACT_APP_API_URL}/loginWithEmail`, requestOptions)
        const data = await response.json()
        console.log(data);
    }




    return (
        <>
            {1>2 ?
                (<div>
                    <div id='card'>

                        <div className="card text-bg-light mb-3">
                            <div className="card-header"><h5>Website Name</h5></div>
                            <div className="card-body">
                                <p className="card-text">Logged in as: {} </p>
                                <p><a className="nav-link" href="logout">Logout</a></p>
                            </div>
                        </div>

                    </div>
                </div>)
                : (<div>
                    <div className="mb-3">
                        <label htmlFor="nameInput" className="form-label">Email:</label>
                        <input type="email" className="form-control" id="emailInput" placeholder="licevent" value={emailLogin} onChange={(e) => setEmailLogin(e.target.value)}></input>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="passwordInput" className="form-label">Password:</label>
                        <input type="password" className="form-control" id="passwordInput" placeholder="licevent" value={passwordLogin} onChange={(e) => setPasswordLogin(e.target.value)}></input>
                    </div>
                    <button type="button" className="btn btn-dark" onClick={verifyLogin}>Login</button>
                </div>)}


        </>
    );
}

export default Interface;