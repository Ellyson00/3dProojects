import React from "react";
import {BrowserRouter, Route} from "react-router-dom";
import Pepyaka from "./Pepyaka/Pepyaka";
import TriangleWallpaper from "./triangleWallpaper/TriangleWallpaper";

export function akella({ match }){
	return <div className="App">
		<BrowserRouter>
			<div>
				<Route exact stric path={`${match.path}/`} component={Pepyaka} />
				<Route path={`${match.path}/Pepyaka`} component={Pepyaka} />
				<Route path={`${match.path}/TriangleWallpaper`} component={TriangleWallpaper} />
			</div>
		</BrowserRouter>
	</div>;
}
