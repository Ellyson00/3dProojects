import React from 'react';
import './App.css';
import Component from "./rightMainPanel/componentOne.jsx";
import FirstWork from "./works/firstWork/firstWork.jsx";
import SecondWork from "./works/secondWork/secondWork.jsx";
import ThirdWork from "./works/thirdWork/thirdWork.jsx";
import FourthWork from "./works/fourthWork/fourthWork.jsx";
import Planet from "./works/planet/Planet.jsx";
import Grass from "./works/grass/grass.jsx";
import Sky from "./works/sky/Sky.jsx";
import {DropdownButton, MenuItem} from 'react-bootstrap';
// import Shaders from "./works/Shaders/Shaders.jsx";



class App extends React.Component {
    constructor(){
		super();
        this.state={
			  page: ["codevember", "samples"],
			  mode: 0,
			  currentProject: 0,
			  currentWork: 0,
			  works:[
				  // {project:[<Shaders/>],name:"Shaders"},
				  {project: [<Planet/>], name: "Planet"},
				  {project: [<Sky/>], name: "Sky"},
				  {project: [<Grass/>], name: "Grass"},
				  {project: [<FourthWork/>], name: "Star"},
				  {project: [<FirstWork/>], name: "Tringle Plane"},
				  {project: [<SecondWork/>], name: "Air Plane"},
				  {project: [<ThirdWork/>], name: "Music Visualisation"},
			  ],
			  codevember: [
				  {project: [<Planet/>], name: "Planet"},
			  ]
        }

    }
    setNewState(show){
    	this.setState(this.state.mode ? {currentProject:show} : {currentWork:show})
	 }

    render() {
    	return (
    		<div className="App">
				<header style={{position: "fixed", left: "45%", zIndex: "1"}} className="App-header">
					<DropdownButton title={this.state.page[this.state.mode]}>
						{this.state.page.map((elem, i)=>{
							return <MenuItem eventKey={i} onSelect={()=>{
								this.setState({mode: i})
							}}>{elem}</MenuItem>
						})}
					</DropdownButton>

				</header>
				{ this.state.mode ? <div style={{height: "100%",width: "100%", position: "fixed"}}>
					 <Component projects={this.state.works} show={this.state.currentProject} method={this.setNewState.bind(this)}/>
					{this.state.works[this.state.currentProject].project[0]}
				</div> : <div style={{height: "100%",width: "100%", position: "fixed"}}>
					<Component projects={this.state.codevember} show={this.state.currentWork} method={this.setNewState.bind(this)}/>
					{this.state.codevember[this.state.currentWork].project[0]}
				</div>};
			</div>);
    }
}

export default App;
