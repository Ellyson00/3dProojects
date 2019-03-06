import React from 'react';
import {BrowserRouter, Route} from "react-router-dom";
import './App.css';

import {SomeWorks} from "./works/Works.jsx";
import {Codevember} from "./codevember/Codevember.jsx";
import {Shaders} from "./shaders/Shaders.jsx";

class App extends React.Component {

    render() {
    	return (
    		<div className="App" style={{overflow: "hidden"}}>
				<BrowserRouter>
					<div>
						<Route path="/Codevember" component={Codevember} />
						<Route path="/Shader" component={Shaders} />
						<Route path="/SomeWorks" component={SomeWorks} />
						<Route exact strict path="/" component={Codevember} />
						{}
					</div>
				</BrowserRouter>
			</div>);
    }
}

export default App;
