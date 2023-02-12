import axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "./nav";
export default function Running_dept() {
    const [data, setData] = useState([]);
    const {dept_name} = useParams()

    useEffect(() => {
        axios.get("http://localhost:5000/course/running/"+ dept_name)
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
            <h1>{dept_name}</h1>
            <table>
                <thead>
                    <tr>
                        <th>Course ID</th>
                        <th>Course Name</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, index) => {
                        return (
                            <tr>
                                <td>
                                    <a href={"/course/" + item.course_id}>
                                        {item.course_id}
                                    </a>
                                </td>
                                <td>
                                    {item.title}
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