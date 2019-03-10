import React from "react";
import {BrowserRouter, Route} from "react-router-dom";

import Shader1 from "./1st_Shader/1st_Shader";
import Shader2 from "./2st_Shader/2st_Shader";
import Shader3 from "./3st_Shader/3st_Shader";
import Shader4 from "./4st_Shader/4st_Shader";

export function Shaders({ match }){
	return <div className="App">
		<BrowserRouter>
			<div>
				<Route exact stric path={`${match.path}/`} component={Shader1} />
				<Route path={`${match.path}/Shader1`} component={Shader1} />
				<Route path={`${match.path}/Shader2`} component={Shader2} />
				<Route path={`${match.path}/Shader3`} component={Shader3} />
				<Route path={`${match.path}/Shader4`} component={Shader4} />
			</div>
		</BrowserRouter>
	</div>;
}
