import React from "react";
import {BrowserRouter, Route} from "react-router-dom";

import House from "./House/index";

export function testWork({match}) {
	return <div className="App">
		<BrowserRouter>
			<div>
				<Route exact stric path={`${match.path}/`} component={House} />
				<Route path={`${match.path}/House`} component={House} />
			</div>
		</BrowserRouter>
	</div>;
}
