import React, {useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import { GetGame } from '../../api/GameRoutes';
import Cookies from 'js-cookie';


const GamePage = () => {
    const { GameId } = useParams();
    const [gameData, setGameData] = useState([])
    const [usernameValue, setUsername] = useState()
    const navigate = useNavigate()


    useEffect(() => {
        var username = Cookies.get('username')
        setUsername(username)

        if (usernameValue != undefined) {
            const getGameData = async () => {
                const response = await GetGame(GameId, username)
                if (response["message"]["username"] !== usernameValue) {
                    navigate("/Hub")
                }
                setGameData(response["message"])
            }
            getGameData()
        }

    }, [usernameValue])


    return (
        <div>{gameData["name"]}</div>
    )

}

export default GamePage