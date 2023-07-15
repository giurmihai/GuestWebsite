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
        getUpdates();
    }, [correctUserAndWebsite])


    async function SendInvitation(index, email) {
        const emailContent = `You were invited to ${currentWebsite.name}! You can access the event website at http://${currentWebsite.publicip}`
        const emailSubject = `Invitation to event`;
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/send-email`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: email, emailContent: emailContent, emailSubject: emailSubject })
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


    //Get updates for the current website.
    const [updates, setUpdates] = useState([])
    async function getUpdates() {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                webId: value
            })
        }
        console.log("Wtf?",requestOptions);
        const response = await fetch(`${process.env.REACT_APP_API_URL}/updatesWebId`, requestOptions)
        const data = await response.json();
        setUpdates(data);
    }

    const[updateBody,setUpdateBody]=useState('')
    const[updateSubject,setUpdateSubject]=useState('')
    async function postUpdate()
    {
        const fullName = currentUser.name + " " + currentUser.given_name
        const requestOptions = {
            method:'POST',
            headers:{'Content-Type':'application/json'},
            body: JSON.stringify({subject:updateSubject, content:updateBody,websiteId:currentWebsite.id,creator:fullName})
        }
        
        const response = await fetch(`${process.env.REACT_APP_API_URL}/updates`,requestOptions);
        const data = await response.json();
        console.log(data);
        getUpdates();
    }

    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        });
      }


    return (
        <>
            {correctUserAndWebsite ?
                (<div className='container text-center'>
                    <div className="row">
                        <div className="col-lg-7 col-12">
                            <div className='cardUpdates'>
                                <div className="card text-bg-light mb-3">
                                    <div className="card-header">
                                        <h3>Updates</h3>
                                        <a className="logout" href="logout">Logout</a>
                                    </div>
                                    <div className="card-body">
                                        <div className='DivCePlm'>
                                            <input type="text" className="form-control" id="updateSubjectInput" placeholder="Subject" value={updateSubject} onChange={(e) => setUpdateSubject(e.target.value)} ></input>
                                            <textarea type="text" className="form-control" id="updateBodyInput" placeholder="Text for new update" value={updateBody} onChange={(e) => setUpdateBody(e.target.value)}></textarea>
                                            <button id='buttonPostUpdate' className="btn btn-dark" onClick={() => postUpdate()}>Post update</button>
                                        </div>
                                        <hr></hr>

                                        <div className='UpdateDiv'>
                                        {updates.slice().reverse().map((element, index) => (
                                                <div key={index} className='oneUpdateText'>
                                                    <div className='SubjectUpdate'><b>Subject:</b> {element.subject}</div>
                                                    <div className='CreatorUpdate'><b>Creator:</b> {element.creator}</div>
                                                    <div className='DateUpdate'><b>Date:</b> {formatDate(element.createdAt)}</div>
                                                    <div className='ContentUpdate'><b>Content:</b> {element.content}</div>
                                                    
                                                    <hr></hr>
                                                </div>
                                                
                                            ))}
                                            
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='col-lg-5 col-12'>
                            <div id='card'>

                                <div className="card text-bg-light mb-3">
                                    <div className="card-header">
                                        <h3>{currentWebsite.name}</h3>
                                        
                                    </div>
                                    <div className="card-body">
                                        <p className="descriereWebsite">{currentWebsite.description} </p>
                                        <hr></hr>
                                        <div className='guestsTexts'>
                                            <div className='leftText'>Guests:</div>
                                            <div className='noGuestsText'>No of guests: {guests.length}</div>
                                        </div>

                                        <div className="guestsDiv">
                                            {guests.map((element, index) => (
                                                <div key={index} className="listItem">
                                                    <div className='emailText'>{element.email}</div>
                                                    <button id='btnSendEmail' className='btn btn-dark' onClick={() => SendInvitation(index, element.email)}>Send invitation</button>
                                                </div>
                                            ))}
                                        </div>


                                    </div>
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