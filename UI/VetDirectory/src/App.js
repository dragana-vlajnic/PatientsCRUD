import React, {useState, useEffect} from "react";
import { variables } from "./Variables.js";
import {Patients} from "./Patients"
import {BrowserRouter as Router, Route, Routes, NavLink} from 'react-router-dom';
require("es6-promise").polyfill();
require("isomorphic-fetch");

export default function SearchFunction() {
    const [data, setData] = useState([])
    const [queryMail, setQueryMail] = useState("")

    useEffect(() => {
        fetch(variables.API_URL + 'Patients/')
        .then(response => response.json())
        .then(json => setData(json));
    }, []);

    function search(rows) {
      var email = queryMail.toLowerCase();
      return ((rows.filter(row => (row.patient_name.toLowerCase().indexOf(email) > -1))));
    }
   
    return (
        <div>
          <div>
             <h1 className="d-flex justify-content-center m-3">
               CRUD
            </h1>    
          </div>
            <div>
              <Patients data = {data}/>
            </div>
        </div>
        
    );
}
