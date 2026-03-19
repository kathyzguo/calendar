import {useNavigate} from 'react-router-dom'
import {useEffect} from "react"

const Warning = ({base, userDID, setUserDID} : {base: string, userDID: number | undefined, 
    setUserDID: (c: number | undefined) => void}) => {
    const navigate = useNavigate();

    useEffect(() => {
        if (userDID) document.body.style.overflow = "hidden";
        else document.body.style.overflow = "unset";
    }, [])

    const handleDelete = async () => {
        try {
            const jsonObj = {id: userDID}
            const response = await fetch(`${base}/main/delete`, {
                method: "DELETE",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(jsonObj)
            })
            if (response.ok) {
                navigate("/login");
            }
        }
        catch (err) {
            if (err instanceof Error) alert("Network Error: " + err.message);
        }
    }
    return (
        <div className = "popupDiv">
            <div className = "popupContainer" style = {{border: "solid #37036C 7px"}}>
                <h2 style = {{padding: "5px"}}>Are you sure?</h2>
                <h5 style = {{paddingBottom: "25px"}}>You cannot undo this action</h5>
                <button className = "btn btn-primary purpBack" onClick = {() => setUserDID(undefined)}>Go back</button>
                <button className = "btn btn-primary purpBack purpPad" onClick = {() => handleDelete()}>Delete</button>
            </div>
        </div>
    )
}

export default Warning