import React, {useState, useEffect, useContext} from 'react'
import AuthContext from '../context/AuthContext'

const HomePage = () => {
    let [notes, setNotes] = useState([])
    let {authTokens, logoutUser} = useContext(AuthContext)

    useEffect(()=> {
        getNotes()
    }, [])


    let getNotes = async() =>{
        let response = await fetch('http://127.0.0.1:8000/api/notes/', {
            method:'GET',
            headers:{
                'Content-Type':'application/json',
                'Authorization':'Bearer ' + String(authTokens.access)
            }
        })
        let data = await response.json()

        if(response.status === 200){
            setNotes(data)
        }else if(response.statusText === 'Unauthorized'){
            logoutUser()
        }
        
    }


    // Dummy state for modal visibility
    const [isModalVisible, setIsModalVisible] = useState(false);

    // Dummy function to handle deletion, you can replace it with your actual function
    const handleDelete = (itemId) => {
        console.log('Deleting item with id: ', itemId);
        // Perform deletion operation
    };

    // Dummy function to show modal
    const handleRequestAvailability = () => {
        setIsModalVisible(true);
    };

    return (
        <div>
            <h1>You are logged to the home page!</h1>
        </div>
    )
}

export default HomePage
