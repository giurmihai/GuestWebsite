
import React, { useEffect, useState } from 'react';
import './Guests.css'
function Guest() {

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

    //Get the data about the website.
    const [currentWebsite, setCurrentWebsite] = useState('');
    async function getWebsite() {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                websiteID: value
            })
        }
        console.log(requestOptions)
        const response = await fetch(`${process.env.REACT_APP_API_URL}/webData`, requestOptions);
        const data = await response.json();
        console.log(data);
        setCurrentWebsite(data);
    }

    // Get the guests
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
        getWebsite();
        console.log(guests);
    }, [value])



    return (<>
        <div className='guestsPage'>
            <div className="card text-bg-light mb-3">
                <div className="card-header"><h5>{currentWebsite.name}</h5></div>
                <div className="card-body">
                    <div id='decription'>
                    {currentWebsite.description}
                    </div>
                   
                    <hr></hr>
                    <h6 id='Guestsheader'>Guests:</h6>
                    <div id='guestsDiv' className="list-group">
                        {guests.map((element, index) => (
                            <div id='pula' key={index} className="list-group-item">
                                {element.email}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            
        </div>
    </>)
}

export default Guest