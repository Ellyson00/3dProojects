import React from "react";
import {BrowserRouter, Route} from "react-router-dom";

import Planet from "./planet/Planet";
import Sky from "./sky/Sky";
import Aviator from "./aviator/Aviator";
import PointLights from "./pointLights/PointLights";

export function SomeWorks({match}) {
	return <div className="App">
		<BrowserRouter>
			<div>
				<Route exact stric path={`${match.path}/`} component={Planet} />
				<Route path={`${match.path}/Planet`} component={Planet} />
				<Route path={`${match.path}/Sky`} component={Sky} />
				<Route path={`${match.path}/Aviator`} component={Aviator} />
				<Route path={`${match.path}/PointLights`} component={PointLights} />
			</div>
		</BrowserRouter>
	</div>;
}
