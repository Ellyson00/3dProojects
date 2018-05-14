import React from 'react';

import './App.css';
import Component from "./rightMainPanel/componentOne.jsx";
import FirstWork from "./firstWork/firstWork.jsx";
import SecondWork from "./secondWork/secondWork.jsx";
import ThirdWork from "./thirdWork/thirdWork.jsx";
import FourthWork from "./fourthWork/fourthWork.jsx";
import Grass from "./grass/grass.jsx";

class App extends React.Component {
    constructor(){
		super();
        this.state={
            something:["anna","Vova","Dasha"],
            string:"lol",
			  currentProject: 0,
			  projects:[
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
				<header style={{position:"absolute",right:"0"}} className="App-header">
					<Component projects={this.state.projects} show={this.state.currentProject} method={this.setNewState.bind(this)} something={this.state.something} text={this.state.string}/>
				</header>
				<div style={{height:"100%",width:"100%"}}>
					{this.state.projects[this.state.currentProject].project[0]}
				</div>
			</div>);
    }
}

export default App;
