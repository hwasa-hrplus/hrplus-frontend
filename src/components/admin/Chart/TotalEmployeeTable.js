import React, { Component } from 'react';

function getData(props){
    console.log(`${props.buttonName}, ${props.data}`);
    console.log(props);
    
}

class TotalEmployeeTable extends Component {
    
    render() {
        console.log('TotalEmployeeTable.js');
        return (
            <div>
                <p>TotalEmployeeTable.js</p>
                <p>{getData}</p>
            </div>
        );
    }
}

export default TotalEmployeeTable;