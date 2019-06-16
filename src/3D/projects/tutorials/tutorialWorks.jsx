import React from "react";
import {BrowserRouter, Route} from "react-router-dom";

import ThanosPortal from "./thanos portal/thanosPortal";
import rain from "./rain/rain";

export function TutorialWorks({match}) {
	return <div className="App">
		<BrowserRouter>
			<div>
				<Route exact stric path={`${match.path}/`} component={ThanosPortal} />
				<Route path={`${match.path}/thanosPortal`} component={ThanosPortal} />
				<Route path={`${match.path}/rain`} component={rain} />
			</div>
		</BrowserRouter>
	</div>;
}
