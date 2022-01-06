import React, { Component } from 'react';

class TotalEmployeeTable extends Component {
    render() {
        const {dataName, dataValue} = this.props;
        
        return (
            <div>
                <p>TotalEmployeeTable.js</p>
                <p>dataName: {dataName}</p>
                <p>dataValue: {dataValue}</p>
            </div>
        );
    }
}

export default TotalEmployeeTable;