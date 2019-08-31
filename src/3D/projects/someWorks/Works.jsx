import React from "react";
import {BrowserRouter, Route} from "react-router-dom";

import Planet from "./planet/Planet";
import Sky from "./sky/Sky";
import Grass from "./grass/grass";
import TriangleWallpaper from "./triangleWallpaper/TriangleWallpaper";
import Aviator from "./aviator/Aviator";
import PointLights from "./pointLights/PointLights";
import Portal from "./portal/myCode/Portal";

export function SomeWorks({match}) {
	return <div className="App">
		<BrowserRouter>
			<div>
				<Route exact stric path={`${match.path}/`} component={Planet} />
				<Route path={`${match.path}/Planet`} component={Planet} />
				<Route path={`${match.path}/Sky`} component={Sky} />
				<Route path={`${match.path}/Grass`} component={Grass} />
				<Route path={`${match.path}/TriangleWallpaper`} component={TriangleWallpaper} />
				<Route path={`${match.path}/Aviator`} component={Aviator} />
				<Route path={`${match.path}/PointLights`} component={PointLights} />
				<Route path={`${match.path}/Portal`} component={Portal} />
			</div>
		</BrowserRouter>
	</div>;
}
