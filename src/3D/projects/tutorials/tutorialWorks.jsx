import React from "react";
import {BrowserRouter, Route} from "react-router-dom";

import ThanosPortal from "./thanos portal/thanosPortal";

export function TutorialWorks({match}) {
	return <div className="App">
		<BrowserRouter>
			<div>
				<Route exact stric path={`${match.path}/`} component={ThanosPortal} />
				<Route path={`${match.path}/thanosPortal`} component={ThanosPortal} />
			</div>
		</BrowserRouter>
	</div>;
}
