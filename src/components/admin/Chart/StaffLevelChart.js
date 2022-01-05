import React, { Component } from 'react';

const data = [
    { code: 'CL1', name:  "사원" },
    { code: 'CL2', name: "대리" },
    { code: 'CL3', name: "과장" },
    { code: 'CL4', name: "차장" },
    { code: 'CL5', name: "리더대우" },
    { code: 'CL6', name: "리더" },
    { code: 'CL7', name: "상무보" },
];

class StaffLevelChart extends Component {
    render() {
        return (
            <div>
                <p>StaffLevelChart.js</p>
            </div>
        );
    }
}

export default StaffLevelChart;