import React from 'react';
import {Button} from 'react-bootstrap';
// import {BrowserRouter, Route} from "react-router-dom";
// import AsidePanel from "./components/AsidePanel"
import './styles/App.less';

// import {SomeWorks} from "./3D/projects/someWorks/Works";
// import {TutorialWorks} from "./3D/projects/tutorials/tutorialWorks";
import {Codevember} from "./3D/projects/codevember/Codevember";
// import {testWork} from "./3D/projects/testWorks/testWork";
// import {Shaders} from "./3D/projects/shaders/Shaders";
// import {mainFunc} from "./3D/projects/baseFunc/mainFunc";

class App extends React.Component<any, any> {
	constructor(props) {
		super(props);
		this.state = {
			isPanelOpen: false
		}
	}

	closePanel() {
		// this.setState({isPanelOpen: false});
	}

	render() {
		const {isPanelOpen} = this.state;
		return (
			<div className="App">
				{<div>
					<Codevember/>
					{/*<div className="selectButton">*/}
						{/*<Button onClick={() => this.setState({isPanelOpen: true})}>Select</Button>*/}
					{/*</div>*/}
					{/*<AsidePanel closePanel={this.closePanel.bind(this)} isPanelOpen={isPanelOpen}/>*/}
				</div>}
				{/*<BrowserRouter>*/}
					{/*<div>*/}
						{/*<Route path="/Codevember" component={Codevember} />*/}
						{/*/!*<Route path="/Shaders" component={Shaders} />*!/*/}
						{/*/!*<Route path="/SomeWorks" component={SomeWorks} />*!/*/}
						{/*/!*<Route path="/remakeTutorialWorks" component={TutorialWorks} />*!/*/}
						{/*/!*<Route path="/mainFunc" component={mainFunc} />*!/*/}
						{/*/!*<Route path="/testWork" component={testWork} />*!/*/}
						{/*/!*<Route exact strict path="/" component={/!*Component*!/} />*!/*/}
					{/*</div>*/}
				{/*</BrowserRouter>*/}
			</div>);
	}
}

export default App;
