import React from "react";
import {BrowserRouter, Route} from "react-router-dom";

import PositionRotationScale from "./PositionRotationScale/PositionRotationScale";
import Quaternion from "./QuaternionFunc/QuaternionFunc";
import Matrix from "./MatrixFunc/Matrix";

export function mainFunc({ match }){
	return <div className="App">
		<BrowserRouter>
			<div>
				<Route exact stric path={`${match.path}/`} component={PositionRotationScale} />
				<Route path={`${match.path}/PositionRotationScale`} component={PositionRotationScale} />
				<Route path={`${match.path}/Quaternion`} component={Quaternion} />
				<Route path={`${match.path}/Matrix`} component={Matrix} />
				{/*<Route path={`${match.path}/Shader4`} component={Shader4} />*/}
			</div>
		</BrowserRouter>
	</div>;
}
