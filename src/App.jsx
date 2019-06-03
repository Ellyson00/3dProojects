import React from 'react';
import {Button} from 'react-bootstrap';
import {BrowserRouter, Route} from "react-router-dom";
import AsidePanel from "./components/AsidePanel.jsx"
import './styles/App.less';

import {SomeWorks} from "./3D/projects/someWorks/Works.jsx";
import {TutorialWorks} from "./3D/projects/tutorials/tutorialWorks.jsx";
import {Codevember} from "./3D/projects/codevember/Codevember.jsx";
import {Shaders} from "./3D/projects/shaders/Shaders.jsx";

class App extends React.Component {
	constructor() {
		super();
		this.state = {
			isPanelOpen: false,
		}
	}

	closePanel() {
		this.setState({isPanelOpen: false});
	}

	render() {
		const {isPanelOpen} = this.state;
		return (
			<div className="App">
				<div className="selectButton">
					<Button onClick={() => this.setState({isPanelOpen: true})}>Select</Button>
				</div>
				<AsidePanel closePanel={this.closePanel.bind(this)} isPanelOpen={isPanelOpen}/>
				<BrowserRouter>
					<div>
						<Route path="/Codevember" component={Codevember} />
						<Route path="/Shaders" component={Shaders} />
						<Route path="/SomeWorks" component={SomeWorks} />
						<Route path="/remakeTutorialWorks" component={TutorialWorks} />
						<Route exact strict path="/" component={Codevember} />
					</div>
				</BrowserRouter>
			</div>);
	}
}

export default App;
