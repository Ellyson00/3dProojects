import React from "react";
import {BrowserRouter, Route} from "react-router-dom";

import MusicVisualization from "./musicVisualization/MusicVisualization";
import LandSlide from "./landSlide/LandSlide";

export function musicVisualization({ match }){
	return <div className="App">
		<BrowserRouter>
			<div>
				<Route path={`${match.path}/MusicVisualization`} component={MusicVisualization} />
				<Route path={`${match.path}/LandSlide`} component={LandSlide} />
			</div>
		</BrowserRouter>
	</div>;
}
