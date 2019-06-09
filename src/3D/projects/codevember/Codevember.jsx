import {BrowserRouter, Route} from "react-router-dom";
import Galaxy from "./1st_Day_Galaxy/Galaxy";
import House from "./House/index";
import Planet from "../someWorks/planet/Planet";
import React from "react";

export function Codevember({ match }){
	return <div className="App">
		<BrowserRouter>
			<div>
				<Route exact stric path={`${match.path}/`} component={Galaxy} />
				<Route path={`${match.path}/Planet`} component={Planet} />
				<Route path={`${match.path}/Galaxy`} component={Galaxy} />
				<Route path={`${match.path}/House`} component={House} />
			</div>
		</BrowserRouter>
	</div>;
}