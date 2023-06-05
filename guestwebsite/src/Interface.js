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
        if (data.message == "Success!") {
            const requestDataWebsite = {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: data.user[0].id
                })
            }
            const resp = await fetch(`${process.env.REACT_APP_API_URL}/getWebsite`, requestDataWebsite)
            const data1 = await resp.json();

            console.log(data1.website.length)
            if (data1.website.length > 0) {
                for (var i = 0; i < data1.website.length; i++) {
                    if (data1.website[i].userId == value) {
                        setCorrectUserAndWebsite(true)
                        setCurrentUser(data.user[0])
                        setCurrentWebsite(data1.website[i])
                    } else {
                        console.log("Nu-s egale:", data1.website[i].userId, value)
                    }
                }
            }
        } else {
            console.log("Wrong email or password")
        }
    }

    const [guests, setGuests] = useState([]);
    async function getGuests() {
        console.log(value);
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ websiteId: value })
        }
        console.log(requestOptions);
        const response = await fetch(`${process.env.REACT_APP_API_URL}/getGuests`, requestOptions);
        const data = await response.json();
        setGuests(data);
    }

    useEffect(() => {
        getGuests();
    }, [correctUserAndWebsite])


    async function doSomething(index, email) {
        console.log(email);
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/send-email`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ email:email })
            });
        
            if (response.ok) {
              console.log('Email sent successfully!');
            } else {
              console.log('Failed to send email.');
            }
          } catch (error) {
            console.error('Error:', error);
          }
    }


    return (
        <>
            {correctUserAndWebsite ?
                (<div>
                    <div id='card'>

                        <div className="card text-bg-light mb-3">
                            <div className="card-header">
                                <h3>{currentWebsite.name}</h3>
                                <a className="logout" href="logout">Logout</a>
                            </div>
                            <div className="card-body">
                                <p className="descriereWebsite">{currentWebsite.description} </p>
                                <hr></hr>
                                <div className='guestsText'>Guests:</div>
                                <div id='guestsDiv' className="listGroup">
                                    {guests.map((element, index) => (
                                        <div key={index} className="listItem">
                                            <div className='emailText'>{element.email}</div>
                                            <button id='btnSendEmail' className='btn btn-dark' onClick={() => doSomething(index, element.email)}>Send invitation</button>
                                        </div>
                                    ))}
                                </div>


                            </div>
                        </div>

                    </div>
                </div>)
                : (<div className='loginPage'>
                    <div className="card text-bg-light mb-3">
                        <div className="card-header"><h5>Log in</h5></div>
                        <div className="card-body">

                            <div className="mb-3">
                                <input type="email" className="form-control" id="emailInput" placeholder="Email" value={emailLogin} onChange={(e) => setEmailLogin(e.target.value)}></input>
                            </div>
                            <div className="mb-3">
                                <input type="password" className="form-control" id="passwordInput" placeholder="Password" value={passwordLogin} onChange={(e) => setPasswordLogin(e.target.value)}></input>
                            </div>
                            <button id='butonLogin' type="button" className="btn btn-dark" onClick={verifyLogin}>Login</button>
                            <a id='butonGuest' className='btn btn-dark' href='/guest'>View as guest</a>
                        </div>
                    </div>
                </div>
                )}


        </>
    );
}

export default Interface;