/**
 * Created by Ellyson on 3/9/2019.
 */
import React from 'react';
import SlidingPane from 'react-sliding-pane';
import {Button, Collapse, Col, Row} from 'react-bootstrap';
import 'react-sliding-pane/dist/react-sliding-pane.css';

export default class AsidePanel extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isPaneOpen: false,
			codevemberPanel: false,
			worksPanel: false,
			shadersPanel: false,
			mainFuncPanel: false,
			tutorialWorks: false
		}
	}

	render() {
		const {worksPanel, shadersPanel, codevemberPanel, tutorialWorks, mainFuncPanel} = this.state;
		const {closePanel, isPanelOpen} = this.props;

		return <SlidingPane from='left'
								  className='asidePanel'
								  overlayClassName='inside'
								  closeIcon={<div>Icon</div>}
								  isOpen={isPanelOpen}
								  width='200px'
								  onRequestClose={() => closePanel()}>
			<Col>
				<Row>
					<Button onClick={() => this.setState({mainFuncPanel: !mainFuncPanel})}
							  aria-controls="example-collapse-text"
							  aria-expanded={shadersPanel}>Main func</Button>
					<Collapse in={mainFuncPanel}>
						<div>
							<Button href={"/mainFunc/PositionRotationScale"}>Position Rotation Scale</Button>
							<Button href={"/mainFunc/Quaternion"}>Quaternion</Button>
							<Button href={"/mainFunc/Matrix"}>Matrix</Button>
							{/*<Button href={"/Shaders/Shader3"}>Shader3</Button>*/}
							{/*<Button href={"/Shaders/Shader4"}>Shader4</Button>*/}
						</div>
					</Collapse>
				</Row>
				<Row>
					<Button onClick={() => this.setState({shadersPanel: !shadersPanel})}
							  aria-controls="example-collapse-text"
							  aria-expanded={shadersPanel}>Shaders</Button>
					<Collapse in={shadersPanel}>
						<div>
							<Button href={"/Shaders/Shader1"}>Shader1</Button>
							<Button href={"/Shaders/Shader2"}>Shader2</Button>
							<Button href={"/Shaders/Shader3"}>Shader3</Button>
							<Button href={"/Shaders/Shader4"}>Shader4</Button>
						</div>
					</Collapse>
				</Row>
				<Row>
					<Button onClick={() => this.setState({codevemberPanel: !codevemberPanel})}
							  aria-controls="example-collapse-text"
							  aria-expanded={codevemberPanel}>Codevember</Button>
					<Collapse in={codevemberPanel}>
						<div>
							<Button href={"/Codevember/Galaxy"}>Galaxy</Button>
							<Button href={"/Codevember/Planet"}>Planet</Button>
						</div>
					</Collapse>
				</Row>
				<Row>
					<Button onClick={() => this.setState({tutorialWorks: !tutorialWorks})}
							  aria-controls="example-collapse-text"
							  aria-expanded={tutorialWorks}>Remake Tutorial Works</Button>
					<Collapse in={tutorialWorks}>
						<div>
							<Button href={"/remakeTutorialWorks/thanosPortal"}>Thanos Portal</Button>
							<Button href={"/remakeTutorialWorks/rain"}>Rain</Button>
						</div>
					</Collapse>
				</Row>
				<Row>
					<Button onClick={() => this.setState({worksPanel: !worksPanel})}
							  aria-controls="example-collapse-text"
							  aria-expanded={worksPanel}>Some Works</Button>
					<Collapse in={worksPanel}>
						<div>
							<Button href={"/SomeWorks/Planet"}>Planet</Button>
							<Button href={"/SomeWorks/Sky"}>Sky</Button>
							<Button href={"/SomeWorks/Grass"}>Grass</Button>
							<Button href={"/SomeWorks/Lights"}>Lights</Button>
							<Button href={"/SomeWorks/TriangleWallpaper"}>TriangleWallpaper</Button>
							<Button href={"/SomeWorks/Aviator"}>Aviator</Button>
							<Button href={"/SomeWorks/MusicVisualization"}>MusicVisualization</Button>
							<Button href={"/SomeWorks/PointLights"}>PointLights</Button>
						</div>
					</Collapse>
				</Row>
			</Col>
		</SlidingPane>
	}
}