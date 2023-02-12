import axios from "axios";
import React, { useState, useEffect } from "react";
import Navbar from "./nav";
export default function Running() {
    const [data, setData] = useState([]);
    useEffect(() => {
        axios.get("http://localhost:5000/course/running")
            .then((res) => {
                console.log(res.data);
                setData(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    return (
        <div className="running">
            <Navbar/>
            <h1>Running</h1>
            <table>
                <thead>
                    <tr>
                        <th>Departnemt</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, index) => {
                        return (
                            <tr>
                                <td>
                                    <a href={"/course/running/" + item.dept_name}>
                                        {item.dept_name}
                                    </a>
                                </td>
                            </tr>
                        );
                    }
                    )}
                </tbody>

                
            </table>
        </div>
    );
}