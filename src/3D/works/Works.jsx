import React from "react";
import {BrowserRouter, Route} from "react-router-dom";

import Planet from "./planet/Planet";
import Sky from "./sky/Sky";
import Grass from "./grass/grass";
import Lights from "./Lights/Lights";
import TriangleWallpaper from "./TriangleWallpaper/TriangleWallpaper";
import AirPlane from "./airPlane/AirPlane";
import MusicVisualization from "./musicVisualization/MusicVisualization";
import PointLight from "./Points light/PointLights";

export function SomeWorks({match}) {
	return <div className="App">
		<BrowserRouter>
			<div>
				<Route exact stric path={`${match.path}/`} component={Planet} />
				<Route path={`${match.path}/Planet`} component={Planet} />
				<Route path={`${match.path}/Sky`} component={Sky} />
				<Route path={`${match.path}/Grass`} component={Grass} />
				<Route path={`${match.path}/Lights`} component={Lights} />
				<Route path={`${match.path}/TriangleWallpaper`} component={TriangleWallpaper} />
				<Route path={`${match.path}/AirPlane`} component={AirPlane} />
				<Route path={`${match.path}/MusicVisualization`} component={MusicVisualization} />
				<Route path={`${match.path}/PointLight`} component={PointLight} />
			</div>
		</BrowserRouter>
	</div>;
}
