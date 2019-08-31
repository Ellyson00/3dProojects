import React from "react";
import {BrowserRouter, Route} from "react-router-dom";

import MusicVisualization from "./musicVisualization/MusicVisualization";
import MusicVisualization2 from "./musicVisualization2/MusicVisualization";

export function musicVisualization({ match }){
	return <div className="App">
		<BrowserRouter>
			<div>
				<Route path={`${match.path}/MusicVisualization`} component={MusicVisualization} />
				<Route path={`${match.path}/MusicVisualization2`} component={MusicVisualization2} />
			</div>
		</BrowserRouter>
	</div>;
}
