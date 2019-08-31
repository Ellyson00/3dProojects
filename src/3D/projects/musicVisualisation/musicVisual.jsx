import React from "react";
import {BrowserRouter, Route} from "react-router-dom";

import MusicVisualization from "./musicVisualization/MusicVisualization";

export function musicVisualization({ match }){
	return <div className="App">
		<BrowserRouter>
			<div>
				<Route path={`${match.path}/MusicVisualization`} component={MusicVisualization} />
			</div>
		</BrowserRouter>
	</div>;
}
