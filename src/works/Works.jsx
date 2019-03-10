import {BrowserRouter, Route} from "react-router-dom";
import Planet from "./planet/Planet";
import Sky from "./sky/Sky";
import Grass from "./grass/grass";
import FourthWork from "./Lights/Lights";
import FirstWork from "./TriangleWallpaper/TriangleWallpaper";
import SecondWork from "./airPlane/AirPlane";
import ThirdWork from "./musicVisualization/MusicVisualization";
import PointLight from "./Points light/PointLights";
import React from "react";

export function SomeWorks({ match }){
	return <div className="App">
		<BrowserRouter>
			<div>
				<Route exact stric path={`${match.path}/`} component={Planet} />
				<Route path={`${match.path}/Planet`} component={Planet} />
				<Route path={`${match.path}/Sky`} component={Sky} />
				<Route path={`${match.path}/Grass`} component={Grass} />
				<Route path={`${match.path}/Star`} component={FourthWork} />
				<Route path={`${match.path}/TringlePlane`} component={FirstWork} />
				<Route path={`${match.path}/AirPlane`} component={SecondWork} />
				<Route path={`${match.path}/MusicVisualisation`} component={ThirdWork} />
				<Route path={`${match.path}/PointLight`} component={PointLight} />
			</div>
		</BrowserRouter>
	</div>;
}
