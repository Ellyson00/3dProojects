import {BrowserRouter, Route} from "react-router-dom";
import Galaxy from "./1st_Day_Galaxy/Galaxy";
import React from "react";

export function Codevember({ match }){
	return <div className="App">
		<BrowserRouter>
			<div>
				<Route exact stric path={`${match.path}/`} component={Galaxy} />
				<Route path={`${match.path}/Galaxy`} component={Galaxy} />
			</div>
		</BrowserRouter>
	</div>;
}