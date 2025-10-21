import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
    const [count, setCount] = useState(0);
    const [userArray, setUserArray] = useState([])

    async function fetchApi() {
        const url = "http://localhost:5000/api";

        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        }
        try {
            const response = await fetch(url, options);

            if (!response.ok) throw new Error("Network response was not ok");

            const data = await response.json();

            setUserArray(data.users);
            console.log(data);
        } catch (err) {
            console.error('There was an error with the fetch operation: ', err);
        }
    }

    useEffect(() => { fetchApi() }, []);

    return (
        <>
            <div>
                <a href="https://vite.dev" target="_blank">
                    <img src={viteLogo} className="logo" alt="Vite logo" />
                </a>
                <a href="https://react.dev" target="_blank">
                    <img src={reactLogo} className="logo react" alt="React logo" />
                </a>
            </div>
            <h1>Vite + React</h1>
            <div className="card">
                <button onClick={() => setCount((count) => count + 1)}>
                    count is {count}
                </button>
                <p>
                    Edit <code>src/App.jsx</code> and save to test HMR
                </p>
                {
                    userArray.map((user, index) => {
                        return (
                            <div key={index}>
                                <p>{user}</p>
                                <br />
                            </div>
                        );
                    })
                }
            </div>
            <p className="read-the-docs">
                Click on the Vite and React logos to learn more
            </p>
        </>
    )
}

export default App
