import React, { useEffect, useState } from 'react';
import './Interface.css';
import GoogleLoginButton from './GoogleLoginButton';

function Interface() {

    // Get the logged in user.
    const isLoggedIn = localStorage.getItem('loggedIn');
    const userToken = localStorage.getItem('tokenId');
    const [currentUser, setCurrentUser] = useState('');

    async function getUser(userToken_p) {

        const requestOptions = {
            method: 'POST', headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token: userToken_p })
        }
        const response = await fetch(`${process.env.REACT_APP_API_URL}/usersToken`, requestOptions)
        const data = await response.json()
        setCurrentUser(data[0])
    }

    useEffect(() => {
        if (isLoggedIn === 'true') {
          getUser(userToken)
        }
      }, [isLoggedIn])

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





    return (
        <>
            {isLoggedIn ?
                (<div>
                    <div id='card'>

                        <div className="card text-bg-light mb-3">
                            <div className="card-header"><h5>Website Name</h5></div>
                            <div className="card-body">
                                <p className="card-text">Logged in as: {currentUser.name} </p>
                                <p><a className="nav-link" href="logout">Logout</a></p>
                            </div>
                        </div>

                    </div>
                </div>)
                :(<div>
                    <GoogleLoginButton />
                </div>)}


        </>
    );
}

export default Interface;