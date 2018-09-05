import React from 'react';
import './App.css';
import RightDropDownMenu from "./rightMainPanel/RightDropDownMenu.jsx";
import FirstWork from "./works/firstWork/firstWork.jsx";
import SecondWork from "./works/secondWork/secondWork.jsx";
import ThirdWork from "./works/thirdWork/thirdWork.jsx";
import FourthWork from "./works/fourthWork/fourthWork.jsx";
import Planet from "./works/planet/Planet.jsx";
import Grass from "./works/grass/grass.jsx";
import Sky from "./works/sky/Sky.jsx";
import Galaxy from "./codevember/1st_Day_Galaxy/Galaxy.jsx";
import PointLight from "./works/Points light/Galaxy.jsx";
import {DropdownButton, MenuItem} from 'react-bootstrap';
import Shader1 from "./shaders/1st_Shader/1st_Shader.jsx";
import Shader2 from "./shaders/2st_Shader/2st_Shader.jsx";
import Shader3 from "./shaders/3st_Shader/3st_Shader.jsx";
import Shader4 from "./shaders/4st_Shader/4st_Shader.jsx";

class App extends React.Component {
    constructor(){
		super();
        this.state={
			  page: ["codevember", "samples", "shaders"],
			  mode: 0,
			  currentProject: 0,
			  currentWork: 0,
			  works:[
				  {project: [<Planet/>], name: "Planet"},
				  {project: [<Sky/>], name: "Sky"},
				  {project: [<Grass/>], name: "Grass"},
				  {project: [<FourthWork/>], name: "Star"},
				  {project: [<FirstWork/>], name: "Tringle Plane"},
				  {project: [<SecondWork/>], name: "Air Plane"},
				  {project: [<ThirdWork/>], name: "Music Visualisation"},
				  {project: [<PointLight/>], name: "Point Light"},
			  ],
			  codevember: [
				  {project: [<Galaxy/>], name: "Galaxy"},
			  ],
			  shaders: [
				  {project: [<Shader1/>], name: "Base Shader"},
				  {project: [<Shader2/>], name: "Fake Light"},
				  {project: [<Shader3/>], name: "new vertex position"},
				  {project: [<Shader4/>], name: "animate 3rd shader"},
			  ]
        }

    }
    setNewState(show){
    	this.setState(this.state.mode ? {currentProject: show} : {currentWork: show})
	 }

    render() {

    	const works = <div style={{height: "100%",width: "100%", position: "fixed"}}>
			 <RightDropDownMenu projects={this.state.works} show={this.state.currentProject} method={this.setNewState.bind(this)}/>
			 {this.state.works[this.state.currentProject].project[0]}
		 </div>;

		 const codevember = <div style={{height: "100%",width: "100%", position: "fixed"}}>
			 <RightDropDownMenu projects={this.state.codevember} show={this.state.currentWork} method={this.setNewState.bind(this)}/>
			 {this.state.codevember[this.state.currentWork].project[0]}
		 </div>;

		 const shaders = <div style={{height: "100%",width: "100%", position: "fixed"}}>
			 <RightDropDownMenu projects={this.state.shaders} show={this.state.currentProject} method={this.setNewState.bind(this)}/>
			 {this.state.shaders[this.state.currentProject].project[0]}
		 </div>;



    	return (
    		<div className="App">
				<header style={{position: "fixed", left: "45%", zIndex: "1"}} className="App-header">
					<DropdownButton id="page" title={this.state.page[this.state.mode]}>
						{this.state.page.map((elem, i) => {
							return <MenuItem key={i} onSelect={() => this.setState({mode: i})}>{elem}</MenuItem>
						})}
					</DropdownButton>

				</header>
				{this.state.mode === 0 && codevember}
				{this.state.mode === 1 && works}
				{this.state.mode === 2 && shaders}

			</div>);
    }
}

export default App;
