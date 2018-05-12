import React from 'react';
import {DropdownButton, MenuItem} from 'react-bootstrap';

class Component extends React.Component {
    constructor(props){
        super(props);
        this.state={something:props.something,input:""};

    }
    updateOurProps(status){
       this.props.method(status)
    }
    render() {
       return (
          <div style={{color:"b"}}>
             <DropdownButton id="dropSown" title={this.props.projects[this.props.show].name}>
                {this.props.projects.map((elem,i)=>{
                   return <MenuItem eventKey={i} onSelect={()=>this.updateOurProps(i)}>{elem.name}</MenuItem>
                })}
             </DropdownButton>
          </div>
       );
    }
}

export default Component;
    