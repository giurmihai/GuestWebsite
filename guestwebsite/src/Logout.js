import React, { useEffect } from "react"
function Logout(){

    useEffect(()=>{
        window.location.replace('/');
    },[1])

    return (<>

    </>)
}

export default Logout