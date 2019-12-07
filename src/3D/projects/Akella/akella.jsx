import React from "react";
import {BrowserRouter, Route} from "react-router-dom";
import Pepyaka from "./Pepyaka/Pepyaka";
import TriangleWallpaper from "./triangleWallpaper/TriangleWallpaper";
import CreepingStripes from "./Creeping stripes/Creeping stripes";

export function akella({ match }){
	return <div className="App">
		<BrowserRouter>
			<div>
				<Route exact stric path={`${match.path}/`} component={Pepyaka} />
				<Route path={`${match.path}/Pepyaka`} component={Pepyaka} />
				<Route path={`${match.path}/TriangleWallpaper`} component={TriangleWallpaper} />
				<Route path={`${match.path}/CreepingStripes`} component={CreepingStripes} />
			</div>
		</BrowserRouter>
	</div>;
}
