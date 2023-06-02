import React, { useEffect, useState } from 'react';
import './Interface.css';

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
    const [correctUserAndWebsite, setCorrectUserAndWebsite] = useState(false);
    const [currentUser, setCurrentUser] = useState('')
    const [currentWebsite, setCurrentWebsite] = useState('')

    //Login function - "Success!" or "user not found"
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
        if (data.message=="Success!")
        {
            const requestDataWebsite = {
                method:'POST',
                headers:{"Content-Type":"application/json"},
                body:JSON.stringify({
                    userId:data.user[0].id
                })
            }
            const resp = await fetch (`${process.env.REACT_APP_API_URL}/getWebsite`, requestDataWebsite)
            const data1 = await resp.json();
            
            console.log(data1.website.length)
            if (data1.website.length>0)
            {
                for (var i=0; i<data1.website.length; i++)
                {
                    if (data1.website[i].userId==value)
                    {
                        setCorrectUserAndWebsite(true)
                        setCurrentUser(data.user[0])
                        setCurrentWebsite(data1.website[i])
                    }else
                    {
                        console.log("Nu-s egale:",data1.website[i].userId,value)
                    }
                }
            }
        }else
        {
            console.log("Wrong email or password")
        }
    }




    return (
        <>
            {correctUserAndWebsite ?
                (<div>
                    <div id='card'>

                        <div className="card text-bg-light mb-3">
                            <div className="card-header"><h5>{currentWebsite.name}</h5></div>
                            <div className="card-body">
                                <p className="card-text">Logged in as: {currentUser.given_name} </p>
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