import React from "react";
import {BrowserRouter, Route} from "react-router-dom";

import Portal from "./portal/myCode/Portal";
import Benares from "./Benares/Benares";

export function OtherPeoplesWork({match}) {
	return <div className="App">
		<BrowserRouter>
			<div>
				<Route exact stric path={`${match.path}/`} component={Portal} />
				<Route path={`${match.path}/Portal`} component={Portal} />
				<Route path={`${match.path}/Benares`} component={Benares} />
			</div>
		</BrowserRouter>
	</div>;
}
