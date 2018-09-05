import React from 'react';
import {DropdownButton, MenuItem} from 'react-bootstrap';

class RightDropDownMenu extends React.Component {
    constructor(props){
        super(props);
        this.state={
           something: props.something,
           input: ""
        };

    }
    updateOurProps(status){
       this.props.method(status)
    }

    render() {
       return (
          <div style={{position: "fixed", right: "0", margin: "20px"}}>
             <DropdownButton id="dropSown" pullRight title={this.props.projects[this.props.show] ? this.props.projects[this.props.show].name : ""}>
                {this.props.projects.map((elem,i)=>{
                   return <MenuItem key={i} onSelect={()=>this.updateOurProps(i)}>{elem.name}</MenuItem>
                })}
             </DropdownButton>
          </div>
       );
    }
}

export default RightDropDownMenu;
    