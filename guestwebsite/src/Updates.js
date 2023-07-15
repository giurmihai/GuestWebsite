import React, { useEffect, useState } from 'react';

function Updates(props) {


    const [updates, setUpdates] = useState([])


    useEffect(() => {
        getUpdates();
    }, [])


    //Get updates for the current website.
    
    async function getUpdates() {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                webId: props.value
            })
        }
        console.log("Wtf",requestOptions)
        const response = await fetch(`${process.env.REACT_APP_API_URL}/updatesWebId`, requestOptions)
        const data = await response.json();
        setUpdates(data);
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
        <div>
            <div className="card text-bg-light mb-3">
                <div className="card-header">
                    <h3>Updates</h3>
                </div>
                <div className="card-body">
                    
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
    )
}

export default Updates;