import React from 'react';
import {Button, ListGroup, ListGroupItem, Collapse} from 'react-bootstrap';
import SlidingPane from 'react-sliding-pane';
import {BrowserRouter, Route, Link} from "react-router-dom";
import './App.css';
import 'react-sliding-pane/dist/react-sliding-pane.css';

import {SomeWorks} from "./works/Works.jsx";
import {Codevember} from "./codevember/Codevember.jsx";
import {Shaders} from "./shaders/Shaders.jsx";

class App extends React.Component {

	constructor(){
		super();
		this.state = {
			isPaneOpen: false,
			open: false
		}
	}

	render() {
		const {open, isPaneOpen} = this.state;
		return (
			<div className="App" style={{overflow: "hidden"}}>
				<div style={{ position: "absolute", marginTop: '32px' }}>
					<Button onClick={ () => this.setState({ isPaneOpen: true }) }>
						Select
					</Button>
				</div>
				<SlidingPane from='left'
								 closeIcon={<div>Icon</div>}
								 isOpen={isPaneOpen}
								 width='200px'
								 onRequestClose={() => this.setState({isPaneOpen: false})}>
					<Button
						onClick={() => this.setState({ open: !open })}
						aria-controls="example-collapse-text"
						aria-expanded={open}
					><div>CodeVember</div>

							<Collapse in={open}>
								<div>
								{/*<ListGroup>*/}
								<a href={"/Shader/Shader4"}>Shader4</a>
								{/*<ListGroupItem><a href={"/Shader/Shader4"}>Shader4</a></ListGroupItem>*/}
								{/*<ListGroupItem><a href={"/Codevember/Galaxy"}>Galaxy</a></ListGroupItem>*/}
								{/*<ListGroupItem>"Morbi leo risus"</ListGroupItem>*/}
								{/*<ListGroupItem>"Porta ac consectetur ac"</ListGroupItem>*/}
								{/*<ListGroupItem>"Vestibulum at eros"</ListGroupItem>*/}
								{/*</ListGroup>*/}
								</div>
							</Collapse>

					</Button>



				</SlidingPane>
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
