import React from 'react';
import './App.css';
import Component from "./rightMainPanel/componentOne.jsx";
import FirstWork from "./firstWork/firstWork.jsx";
import SecondWork from "./secondWork/secondWork.jsx";
import ThirdWork from "./thirdWork/thirdWork.jsx";
import FourthWork from "./fourthWork/fourthWork.jsx";
import Planet from "./planet/Planet.jsx";
import Grass from "./grass/grass.jsx";
import Sky from "./sky/Sky.jsx";
import {DropdownButton, MenuItem} from 'react-bootstrap';
// import Shaders from "./Shaders/Shaders.jsx";



class App extends React.Component {
    constructor(){
		super();
        this.state={
			  page: ["codevember", "samples"],
			  mode: 0,
			  currentProject: 0,
			  projects:[
				  // {project:[<Shaders/>],name:"Shaders"},
				  {project:[<Planet/>],name:"Planet"},
				  {project:[<Sky/>],name:"Sky"},
				  {project:[<Grass/>],name:"Grass"},
				  {project:[<FourthWork/>],name:"Star"},
				  {project:[<FirstWork/>],name:"Tringle Plane"},
				  {project:[<SecondWork/>],name:"Air Plane"},
				  {project:[<ThirdWork/>],name:"Music Visualisation"},
			  ]
        }

    }
    setNewState(show){
    	this.setState({currentProject:show})
	 }

    render() {
    	return (
    		<div className="App">
				<DropdownButton style={{position: "fixed",top: "20px"}} title={this.state.page[this.state.mode]}>
					{this.state.page.map((elem,i)=>{
						return <MenuItem eventKey={i} onSelect={()=>{
							this.setState({mode: i})
						}}>{elem}</MenuItem>
					})}
				</DropdownButton>
				{ this.state.mode ? <div>
					<header style={{position:"absolute",right:"0"}} className="App-header">
						<Component projects={this.state.projects} show={this.state.currentProject} method={this.setNewState.bind(this)}/>
					</header>
					<div style={{height:"100%",width:"100%"}}>
						{this.state.projects[this.state.currentProject].project[0]}
					</div>
				</div>: null}
			</div>);
    }
}

export default App;
