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
			tutorialWorks: false,
			musicVisualisationPanel: false,
			testWork: false,
			akella: false,
			otherPeoplesWork: false,
		}
	}

	render() {
		const {worksPanel, shadersPanel, codevemberPanel, tutorialWorks, otherPeoplesWork, mainFuncPanel, testWork, musicVisualisationPanel, akella} = this.state;
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
					<Button onClick={() => this.setState({musicVisualisationPanel: !musicVisualisationPanel})}
							  aria-controls="example-collapse-text"
							  aria-expanded={shadersPanel}>Music Visualisation</Button>
					<Collapse in={musicVisualisationPanel}>
						<div>
							<Button href={"/musicVisualization/MusicVisualization"}>MusicVisualization</Button>
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
					<Button onClick={() => this.setState({akella: !akella})}
							  aria-controls="example-collapse-text"
							  aria-expanded={akella}>Akella</Button>
					<Collapse in={akella}>
						<div>
							<Button href={"/akella/Pepyaka"}>Pepyaka</Button>
							<Button href={"/akella/DisplacedBox"}>Displaced Box</Button>
							<Button href={"/akella/TriangleWallpaper"}>TriangleWallpaper</Button>
							<Button href={"/akella/CreepingStripes"}>Creeping stripes</Button>
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
							<Button href={"/SomeWorks/Aviator"}>Aviator</Button>
							<Button href={"/SomeWorks/PointLights"}>PointLights</Button>
						</div>
					</Collapse>
				</Row>
				<Row>
					<Button onClick={() => this.setState({otherPeoplesWork: !otherPeoplesWork})}
							  aria-controls="example-collapse-text"
							  aria-expanded={otherPeoplesWork}>Other People`s Work</Button>
					<Collapse in={otherPeoplesWork}>
						<div>
							<Button href={"/OtherPeoplesWork/Portal"}>Portal</Button>
							<Button href={"/OtherPeoplesWork/Benares"}>Benares</Button>
						</div>
					</Collapse>
				</Row>
				<Row>
					<Button onClick={() => this.setState({testWork: !testWork})}
							  aria-controls="example-collapse-text"
							  aria-expanded={testWork}>Test Work</Button>
					<Collapse in={testWork}>
						<div>
							<Button href={"/testWork/House"}>House</Button>
						</div>
					</Collapse>
				</Row>
			</Col>
		</SlidingPane>
	}
}