import React, { Component } from 'react';
import { Button, Grid, Row, Col, Modal, Glyphicon } from 'react-bootstrap';
import logo from './logo.svg';
import './App.css';
import ReactDataGrid from 'react-data-grid';
import CONSTANTS from './server/config.js';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import $ from 'jquery';
var moment = require('moment');
var Maxid = 0;

class AddModal extends Component {

      constructor(props) {
        super(props);
        this.state = {
          first_name:'',
          last_name:'',
          age:0,
          gender:'',
          date:new Date(),
        }
      }

      componentWillMount=()=>{
        console.log(this.props.rowValue);
        console.log(Object.keys(this.props.rowValue).length);
        var date=new Date(this.props.rowValue.Format_date);
        if (this.props.rowValue.Format_date === '' || this.props.rowValue.Format_date ==null || this.props.rowValue.Format_date ==undefined) {
          console.log("invalid date");
        }else {
          date = this.props.rowValue.Format_date;
        }
        let gender='';
        if (this.props.rowValue.gender == 'M') {
          gender = "M"
        }else {
          gender = "F"
        }
        if (Object.keys(this.props.rowValue).length !== 0 ) {
          this.setState({
            first_name:this.props.rowValue.first_name,
            last_name:this.props.rowValue.last_name,
            age:this.props.rowValue.age,
            gender:gender,
            date:date
          })
        }else {
          this.setState({
            first_name:'',
            last_name:'',
            age:'',
            gender:'',
            date:''
          })
        }
      }

      setFirstName=(e)=>{
        this.setState({first_name:e.target.value})
      }

      setLastName=(e)=>{
        this.setState({last_name:e.target.value})
      }
      setAge=(e)=>{
        this.setState({age:e.target.value})
      }
      setGender=(e)=>{
        console.log(e);
        this.setState({gender:e})
      }
      onDateChange=(date)=>{
        this.setState({date:date})
      }

      submitPUT=()=>{
        console.log("inside submitPUT");
        let create_params = {
          "id":this.props.rowValue.id,
          "first_name":this.state.first_name,
          "last_name":this.state.last_name,
          "age":this.state.age,
          "gender":this.state.gender,
          "date_joining":this.state.date
        };
        let  url = CONSTANTS.update_data+'/'+this.props.rowValue.id;
        console.log(url);
        console.log(create_params);
        fetch(url,{
          method: 'PUT',
          body: JSON.stringify(create_params),
          headers: {
            'Content-Type': "application/json"
          }
        }).then(function(response){
          return response.json()
        }, function(err){
          console.log(err);
        }).then(function(res){
          console.log(res);
          this.props.onHide();
          this.props.getRows();
        }.bind(this));
      }

      submitPOST=()=>{
        console.log("inside submitPOST");
        if (this.state.first_name === '' || this.state.last_name === ''|| this.state.age === '' || this.state.gender === '' || this.state.date === '') {
          // alert("all fiels are required")
          $('.sweet-container-custom').css("background-color", "red !important");
          $('.sweet-container-custom').fadeIn('slow').animate({ 'marginTop': "50px" });
          $('.sweet-message').html(" &nbsp &nbsp All fields are required");
          setTimeout(function () {
          $('.sweet-container-custom').delay(500).fadeOut();
          }, 3000);
        }else {
          let create_params = {
            "id":Maxid+1,
            "first_name":this.state.first_name,
            "last_name":this.state.last_name,
            "age":this.state.age,
            "gender":this.state.gender,
            "date_joining":this.state.date
          };
          let  url = CONSTANTS.post_data;
          console.log(url);
          console.log(create_params);
          fetch(url,{
            method: 'POST',
            body: JSON.stringify(create_params),
            headers: {
              'Content-Type': "application/json"
            }
          }).then(function(response){
            return response.json()
          }, function(err){
            console.log(err);
          }).then(function(res){
            console.log(res);
            this.props.onHide();
            this.props.getRows();
          }.bind(this));
        }
      }



      _render_button=()=>{
         if(Object.keys(this.props.rowValue).length !== 0){
           return(
             <div className="button-container">
             <Button className="modal-button" onClick={()=>this.submitPUT("PUT")}>UPDATE</Button>
             <Button className="modal-button"  onClick={this.props.onHide}>CANCEL</Button>
             </div>
           )
         }
         else{
           return(
             <div className="button-container">
             <Button className="modal-button"  onClick={()=>this.submitPOST ("POST")}>ADD</Button>
             <Button className="modal-button" onClick={this.props.onHide}>CANCEL</Button>
             </div>
           )
         }
      }

      render() {
        return (
          <Modal {...this.props}  bsSize="large" aria-labelledby="contained-modal-title-sg">
            <Modal.Header closeButton>
              <Modal.Title id="custom-modal-title"><div className="modal-title"><h4>User Details</h4> </div></Modal.Title>
            </Modal.Header >
            <Modal.Body>
              <div className=" row modal_contianer">
                <div class="col-xs-11 col-sm-4 alert alert-error alert-with-icon sweet-container-custom animated fadeInDown" style={{ "display": "none", "width": "max-content" }} role="alert" data-notify-position="top-center">
                <button type="button" aria-hidden="true" class="fa fa-asterisk close sweet-dismiss-custom"></button><i data-notify="icon" class="material-icons fa fa-bell-o"></i> <span class="sweet-message"> You have successfully registered a user </span>
                <a href="#" target="_blank" data-notify="url"></a>
                </div>
                <div className="col-md-12">
                  <div className="col-md-6">
                    <div className="title">First Name</div>
                    <input type="text" className="inputStyle" value={this.state.first_name} onChange={this.setFirstName}/>
                  </div>
                  <div className="col-md-6">
                    <div className="title">Last Name</div>
                    <input type="text" className="inputStyle" value={this.state.last_name} onChange={this.setLastName}/>
                  </div>
                </div>
                <div className="col-md-12" style={{marginTop:'10px'}}>
                  <div className="col-md-6">
                    <div className="title">Age</div>
                    <input type="number" className="inputStyle" value={this.state.age} onChange={this.setAge}/>
                  </div>
                  <div className="col-md-6">
                    <div className="title">Last Name</div>
                    <input type="radio" name="radio"  value="M" onChange={()=>{this.setGender('M')}}/><span style={{marginRight:'10px'}}>Male</span>
                    <input type="radio" name="radio"  value="F" onChange={()=>{this.setGender('F')}}/><span>Female</span>
                  </div>
                </div>
                <div className="col-md-12" style={{marginTop:'10px'}}>
                  <div className="col-md-6">
                      <div className="title">Last Name</div>
                      <DatePicker
                      onChange={this.onDateChange}
                      selected={this.state.date}/>
                  </div>
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer>
              {this._render_button()}
            </Modal.Footer>
          </Modal>

        );
      }
}

class App extends Component {
  constructor() {
    super()
    this.state = {
      rows:[],
      addModal:false,
      rowValue:{}
    }
    this.columns = [
      {key: 'action', name: 'Action'},
      {key: 'first_name', name: 'First Name'},
      {key: 'last_name', name: 'Last Name'},
      {key: 'age', name: 'Age'},
      {key: 'gender', name: 'Gender'},
      {key: 'date', name: 'Date of Joining'},
    ]
  }

  componentWillMount=()=>{
    this.getRows();
  }

  rowGetter = (i) =>{return this.state.rows[i]};

  getRows=()=>{
    let url=CONSTANTS.get_all_data;
    console.log(url);
    let row=[];
    fetch(url,
      {method:'GET'})
      .then((response)=> response.json())
      .then((responseJson)=>{
        for (var i =  0; i < responseJson.data.length; i++) {
          console.log(responseJson);
          let fullDate;
          if (responseJson.data[i]["date_joining"] === null || responseJson.data[i]["date_joining"] == '' || responseJson.data[i]["date_joining"]== undefined) {
            console.log("invalida date");
          }else {
            let d = new Date(responseJson.data[i]["date_joining"]);
            console.log(d);
            var dd = moment(d).format("DD/MM/YYYY");
            console.log(dd);
          }
          row.push({
            'id':responseJson.data[i]['id'],
            'first_name':responseJson.data[i]["first_name"],
            'last_name':responseJson.data[i]["last_name"],
            'age':responseJson.data[i]["age"],
            'gender':responseJson.data[i]["gender"],
            'date':dd,
            'Format_date':responseJson.data[i]["date_joining"]
          })
          Maxid = responseJson.data[i]['id'];
        }
        console.log(Maxid);
        this.setState({rows:row},()=>{
          console.log(this.state.rows);
        })
      });
  }

  getCellActions=(column, row)=>{
    if (column.key === 'action') {
      return [{
          icon: "glyphicon glyphicon-pencil",
          callback: () => {
            this.setState({addModal:true,rowValue:row})
          }
        },
        {
          icon: <span className="glyphicon glyphicon-remove" />,
          callback: () => {
            var url = CONSTANTS.delete_data+"/"+row['id'];
            fetch(url, {
              method: 'DELETE'
            })
            .then((responseJson) => {
              this.getRows();
            })
            .catch((error) => {
              console.log("error while deleting",error);
            });
          }
      }
    ]
    }
  }

  addRows=()=>{
    this.setState({addModal:true,rowValue:{}})
  }

  _renderAddModal = (hideAddModal) =>{

    if(this.state.addModal === true)
    {
      return(
        <AddModal show={this.state.addModal}  onHide={hideAddModal} rowValue={this.state.rowValue} getRows={this.getRows}/>
      );
    }
    else{
      return(
        <div></div>
      );
    }
  }

  render() {
      let hideAddModal = () => this.setState({ addModal: false });
    return (
      <div className="dashboard">
      {this._renderAddModal(hideAddModal)}
      <div className="table_header"><span>Table</span></div>
      <div className="addButton" onClick={this.addRows}></div>
      <ReactDataGrid
        columns={this.columns}
        rowGetter={this.rowGetter}
        rowsCount={this.state.rows.length}
        getCellActions={this.getCellActions}
        minHeight={300} />
      </div>
    );
  }
}

export default App;
