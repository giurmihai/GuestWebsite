import React, { useEffect, useState } from 'react';
import './Interface.css';

function Interface() {

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
        
            <div id='card'>

                <div className="card text-bg-light mb-3">
                    <div className="card-header"><h5>Website Name</h5></div>
                    <div className="card-body">
                        <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                    </div>
                </div>

            </div>
        </>
    );
}

export default Interface;