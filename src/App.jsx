import React from 'react';
import {Button} from 'react-bootstrap';
import {BrowserRouter, Route} from "react-router-dom";
import AsidePanel from "./components/AsidePanel.jsx"
import './styles/App.less';

import {SomeWorks} from "./3D/projects/someWorks/Works.jsx";
import {TutorialWorks} from "./3D/projects/tutorials/tutorialWorks.jsx";
import {Codevember} from "./3D/projects/codevember/Codevember.jsx";
import {testWork} from "./3D/projects/testWorks/testWork.jsx";
import {Shaders} from "./3D/projects/shaders/Shaders.jsx";
import {mainFunc} from "./3D/projects/baseFunc/mainFunc.jsx";

class App extends React.Component {
	constructor() {
		super();
		this.state = {
			isPanelOpen: false
		}
	}

	closePanel() {
		this.setState({isPanelOpen: false});
	}

	render() {
		const {isPanelOpen} = this.state;
		return (
			<div className="App">
				{window.location.pathname !== "/" && <div>
					<div className="selectButton">
						<Button onClick={() => this.setState({isPanelOpen: true})}>Select</Button>
					</div>
					<AsidePanel closePanel={this.closePanel.bind(this)} isPanelOpen={isPanelOpen}/>
				</div>}
				<BrowserRouter>
					<div>
						<Route path="/Codevember" component={Codevember} />
						<Route path="/Shaders" component={Shaders} />
						<Route path="/SomeWorks" component={SomeWorks} />
						<Route path="/remakeTutorialWorks" component={TutorialWorks} />
						<Route path="/mainFunc" component={mainFunc} />
						<Route path="/testWork" component={testWork} />
						{/*<Route exact strict path="/" component={/!*Component*!/} />*/}
					</div>
				</BrowserRouter>
			</div>);
	}
}

export default App;
