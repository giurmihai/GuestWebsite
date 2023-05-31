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

    // Get from server the website ids for the userId
    const [websites, setWebsites] = useState('');
    async function getWebsites()
    {
        console.log(currentUser.id);
        const requestOptions = {
            method: 'POST', headers: {"Content-Type":"application/json"},
            body:JSON.stringify({
                userId:currentUser.id
            })
        }
        console.log(requestOptions)
        const response = await fetch(`${process.env.REACT_APP_API_URL}/getWebsite`, requestOptions)
        const data = await response.json()
        setWebsites(data);
        console.log(data);
    }

    //Check if the correct user is logged in for the correct website id.
    // If there is a value for the website id, search for the value for websites with user id
    useEffect(()=>{
        if (value)
        {
            getWebsites();
        }
    },[value])

    //The actual verification of the correct user
    const [correctUser, setCorrectUser] = useState(false);
    useEffect(()=>{
        console.log(typeof(websites.website));
        
        if(typeof(websites.website)=='object')
        {
            console.log("mama")
            console.log("Mama: ",websites.website[0].id)
            console.log(value);
            console.log(value==websites.website[0].id);
            for (var index=0; index<websites.website.length; index++)
            {
                console.log("tata", websites.website[index].id)
                if (websites.website[index].id==value)
                {
                    setCorrectUser(true);
                    console.log(currentUser)
                }
            }
        }
    },[websites])





    return (
        <>
            {correctUser&&isLoggedIn ?
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