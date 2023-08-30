import React, {Component} from 'react';
import { variables } from "./Variables.js";
require("es6-promise").polyfill();
require("isomorphic-fetch");


export class Patients extends Component {

    constructor(props){
        super(props);

        this.state={
            patients:[],
            modalTitle: "",
            patient_id: 0, 
            searchByName: ""     
        }
    }

    setQueryName(name)
    {
        this.state.searchByName = name
        this.searchClick();
    }

    refreshList(partName = ""){
        var uri;

        if (partName != "")
        {
            uri = '?partOfName=' + partName;
        }
        else
        {
            uri = '';
        }
        fetch(variables.API_URL+'Patients' + uri)
        .then(response=>response.json())
        .then(data=>{
            this.setState({patients:data});
        });
    }

    componentDidMount(){
        this.refreshList();
    }

    changePatientName = (e) => {
        this.setState({patient_name: e.target.value})
    }

    changeDateOfBirth = (e) => {
        this.setState({date_of_birth: e.target.value})
    }

    changeContactNumber =(e)=>{
        this.setState({contact_number:e.target.value});
    }

    changeEmail =(e)=>{
        this.setState({email:e.target.value});
    }    

    changePatientDiagnosis = (e) => {
        this.setState({diagnosis: e.target.value})
    }

    addClick(){
        this.setState({
            modalTitle: "Add Patients",
            patient_id: 0,
        });
    }

    

    editClick(patient){
        this.setState({
            modalTitle: "Edit Patient",
            patient_id: patient.patient_id,
            patient_name: patient.patient_name,
            date_of_birth: patient.date_of_birth,
            contact_number: patient.contact_number,
            email: patient.email,
            diagnosis: patient.diagnosis
        });
    }
    

    createClick() {
        console.log(variables.API_URL + 'Patients?patientName='+this.state.patient_name+'&date='+this.state.date_of_birth+'&contactNumber='+this.state.contact_number+'&email='+this.state.email+'&diagnosis='+ this.state.diagnosis)

        fetch(variables.API_URL + 'Patients/'+ encodeURIComponent(this.state.skills), { //TODO: vrati se ovde
            method: 'POST',
            headers: {
                'Accept':'application/json',
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                name: this.state.patients_name,
                dateOfBirth: this.state.date_of_birth,
                contactNumber: this.state.contact_number,
                email: this.state.email,
                diagnosis: this.state.diagnosis
            })
        })
        .then(response => response.json())
        .then((result)=> {
            alert(result);
            this.refreshList();
        }, (error) => {
            console.log(error)
            alert('Failed');
        })
    }

    updateClick(id) {
        console.log(id + this.state.date_of_birth + this.state.contact_number + this.state.email)
        fetch(variables.API_URL + 'Patients/' + encodeURIComponent(this.state.diagnosis), {
            method: 'PUT',
            headers: {
                'Accept':'application/json',
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                id: id,
                name: this.state.patient_name,
                dateOfBirth: this.state.date_of_birth,
                contactNumber: this.state.contact_number,
                email: this.state.email,
                diagnosis: this.state.diagnosis
            })
        })
        .then(response => response.json())
        .then((result)=> {
            alert(result);
            this.refreshList();
        }, (error) => {
            console.log(error)
            alert('Failed');
        })
    }

    deleteClick(id) {
        if(window.confirm('Are you sure?')){
        fetch(variables.API_URL + 'Patients?id=' + id, {
            method: 'DELETE',
            headers: {
                'Accept':'application/json',
                'Content-Type':'application/json'
            }
        })
        .then(response => response.json())
        .then((result)=> {
            alert(result);
            this.refreshList();
        }, (error) => {
            console.log(error)
            alert('Failed');
        })
        }
    }

    searchClick()
    {
        this.refreshList(this.state.searchByName);
    }

    
    // searchItems = () => {
        
    // }

    render(){
        const {
            patients,
            modalTitle,
            patient_name,
            date_of_birth,
            contact_number,
            email,
            patient_id,
            diagnosis
        }=this.state;

        return(
            <div>
                
                    <input type="text" placeholder="Search by name" id="sbn" value={this.searchByName} onChange = {(e) => this.setQueryName(e.target.value)}/>
               
                

                <button type="button"
                className=" btn btn-primary m-2 float-end"
                data-bs-toggle="modal"
                data-bs-target="#exampleModal"
                onClick={()=>this.addClick()}>
                    Add Patient
                </button>
                <table className="table table-striped">
                <thead>
                <tr>
                    <th>
                       ID
                    </th>
                    <th>
                        Name
                    </th>
                    <th>
                        Date of birth
                    </th>
                    <th>
                        Contact number
                    </th>
                    <th>
                        Email
                    </th>
                    <th>
                        Diagnosis
                    </th>
                    <th>
                        Options
                    </th>
                </tr>
                </thead>
                <tbody>
                    {patients.map(patient=>
                        <tr key={patient.patient_id}>
                            <td>{patient.patient_id}</td>
                            <td>{patient.patient_name}</td>
                            <td>{patient.date_of_birth}</td>
                            <td>{patient.contact_number}</td>
                            <td>{patient.email}</td>
                            <td>{patient.diagnosis}</td>
                            <td>

                            
                            <button type="button"
                            className="btn btn-light mr-1"
                                data-bs-toggle="modal"
                                data-bs-target="#exampleModal"
                                onClick={()=>this.editClick(patient)}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                                <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                                <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
                                </svg>
                            </button>

                            <button type="button"
                            className="btn btn-light mr-1"
                            onClick={()=>this.deleteClick(patient.patient_id)}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                                <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                                </svg>
                            </button>
                            </td>
                        </tr>
                        )}
                </tbody>
                </table>

                <div className="modal fade" id="exampleModal" tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog modal-lg modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">{modalTitle}</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"
                        ></button>
                    </div>

                    <div className="modal-body">
                        <div className="input-group mb-3">
                            <span className="input-group-text">Patient name</span>
                            {
                                patient_id == 0 ?
                                <input type="text" className="form-control"
                                value={patient_name}
                                onChange = {this.changePatientName}/>
                                : <input type="text" disabled = "disabled"  className="form-control"
                                value={patient_name}/>
                               
                            }
                            
                        </div>
                    </div> 

                    <div className="modal-body">
                        <div className="input-group mb-3">
                            <span className="input-group-text">Date of birth</span>
                            {
                                patient_id == 0 ?
                                    <input type="text" className="form-control"
                                    value={date_of_birth}
                                    onChange = {this.changeDateOfBirth}/> 
                                    : <input type="text" disabled = "disabled" className="form-control"
                                    value={date_of_birth}/>
                            }
                            
                        </div>
                    </div>

                    <div className="modal-body">
                        <div className="input-group mb-3">
                            <span className="input-group-text">contact_number</span>
                            {
                                patient_id == 0 ?
                                <input type="text" className="form-control"
                                value={contact_number}
                                onChange = {this.changeContactNumber}/>
                                : <input type="text" disabled = "disabled" className="form-control"
                                value={contact_number}/>
                            }
                            
                        </div>
                    </div>

                    <div className="modal-body">
                        <div className="input-group mb-3">
                            <span className="input-group-text">Email</span>
                            {
                                patient_id == 0 ?
                                <input type="text" className="form-control"
                                value={email}
                                onChange = {this.changeEmail}/> 
                                : <input type="text" disabled = "disabled" className="form-control"
                                value={email}/> 
                            }
                                                    
                        </div>
                    </div>       

                     <div className="modal-body">
                        <div className="input-group mb-3">
                            <span className="input-group-text">Diagnosis</span>
                            <input type="text" className="form-control"
                            value={diagnosis}
                            onChange = {this.changePatientDiagnosis}/> 
                        </div>
                    </div>                 

                    {patient_id==0?
                    <button type="button"
                    className="btn btn-primary float-start"
                    onClick={()=>this.createClick()}
                    >Create</button>
                    :null}

                    {patient_id!=0?
                    <button type="button"
                    className="btn btn-primary float-start"
                    onClick={()=>this.updateClick(patient_id)}
                    >Update</button>
                    :null}                
                </div>
                </div>
                </div>       

                
            </div>
        )
    }
}