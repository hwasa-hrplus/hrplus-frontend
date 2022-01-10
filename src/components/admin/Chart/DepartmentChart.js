import { PieChart, Pie, Tooltip, Cell, Legend} from 'recharts';
import React, { Component } from 'react';
import { Table, TableHead, TableBody, TableRow, TableCell, Button, ButtonGroup, FormControl, InputLabel, Input, InputAdornment } from '@material-ui/core';
import axios from 'axios';
import AccountCircle from '@mui/icons-material/AccountCircle';

const departmentHead = "Smart융합사업실";

const COLORS = ['#4f07eb', '#00C49F', '#ffea28', 
                '#f78d59', '#eb0eca', '#ff0a2b', 
                '#00ba25', '#DD8438', '#BB1213', 
                '#EE6619', '#ee1688', '#CC7713', ];

const CustomTooltip = ({ active, payload, name }) => {
    if (active && payload && payload.length) {
      return (
        <div className="customTooltip">
          <p className="info">{`${payload[0].name.replace(departmentHead, "")} 인원: ${payload[0].value}명`}</p>
        </div>
      );
    }
    return null;
};



class DepartmentChart extends Component {
    constructor(props){
        super(props);
        this.state=({
          isLoaded : true,
          isDataClick : false,
          dataName: "",
          dataValue: "",
          employeeData: [],
          uniqueDataState: [],
          searchingKeyword: "",
        });
    }

    findTableByChartClick = (data) => {
        console.log('차트 클릭 함수 내 data: ', data);
        this.setState({
            isDataClick: true,
            dataName: data.name,
            dataValue: data.value,
        })
        console.log(`${this.state.dataName} 차트 조각 클릭!`);
    }

    findTableByLegendColorClick = (event) => {
        this.setState({
            isDataClick: true,
            dataName: event.target.dataset.name,
            dataValue: event.target.dataset.value
        })
        console.log('event.target.getAttribute("data-value"):', event.target.dataset.name);
        
    }

    getMyData = async () => {
        let employeeData = await axios.get('/api/v1/hradmin/admin/list');
        
        employeeData = employeeData.data.filter((data)=>{
            return data.department.name.includes(departmentHead);
        });
        
        this.setState({
            employeeData: employeeData
        });       

        let uniqueDataNameSet = new Set();
        for (let idx = 0; idx < this.state.employeeData.length; idx++) {
            const departmentName = this.state.employeeData[idx].department.name;
            if (!uniqueDataNameSet.has(departmentName)){
                uniqueDataNameSet.add(departmentName);
            } else {
                continue;
            }
        }

        let uniqueDataNameArr = Array.from(uniqueDataNameSet);
        let uniqueDataset = [];
        for (let idx = 0; idx < uniqueDataNameArr.length; idx++){
            let cnt = this.state.employeeData.filter(data =>
                uniqueDataNameArr[idx] === data.department.name).length;
            console.log(`${uniqueDataNameArr[idx]} 부서: ${cnt}명`);
            let uniqueObj = {};
            uniqueObj.name = uniqueDataNameArr[idx];
            uniqueObj.value = cnt;
            uniqueDataset.push(uniqueObj);
        }
        this.setState({uniqueDataState: uniqueDataset});
        // this.getRandomColor();
    }

    searchingKeywordInput = (prop) => (event) => {
        this.setState({searchingKeyword : event.target.value});
        console.log('searchingKeyword: ', this.state.searchingKeyword);
    };

    // getRandomColor = () =>{
    //     console.log('uniqueDataState: ', this.state.uniqueDataState);
        
    //     let randomColors = [];
    //     for (let index = 0; index < this.state.uniqueDataState.length; index++) {
    //         console.log('getRandomColor!');
            
    //         let randomColor = "#" + Math.floor(Math.random() * 16777215).toString(16);
    //         randomColors.push(randomColor);
    //     }
    //     this.setState({COLORS: randomColors});
    // }


    render() {
        if (this.state.isLoaded){
            console.log('getMyData!');
            this.getMyData();
            this.setState({isLoaded : false});
        } 
        
        return (
            <div>
                <div >
                    <h1 align='center'>{departmentHead} 부서별 사원 현황</h1>
                </div>
                <div className="ContentWrapper">
                    <div className='ChartWrapper'>
                        <div>
                            <PieChart width={700} height={600} onMouseEnter={this.onPieEnter} style = {{flexDirection: 'row'}}>
                                <Pie 
                                data={this.state.uniqueDataState}
                                cx={300}
                                cy={250}
                                innerRadius={140}
                                outerRadius={230}
                                fill="#8884d8"
                                paddingAngle={5}
                                dataKey="value"
                                onClick={this.findTableByChartClick}
                                >   
                                {this.state.uniqueDataState.map((entry, index) => (
                                    <Cell 
                                        key={`cell-${index}`} 
                                        fill={COLORS[index]}
                                        dataKey
                                    />
                                ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip/>} />
                            </PieChart>
                        </div>
                        <div className="LegendWrapper">
                            {
                                this.state.uniqueDataState.map((data, index) => {
                                    return (
                                        <div style={{ 
                                            display: 'flex',
                                            alignContent: 'left',
                                            width: 700
                                            }}>
                                                
                                            <button style={{ backgroundColor: COLORS[index],
                                                            width: 50
                                                            }}
                                                    data-name={data.name}
                                                    data-value={data.value}
                                                    onClick={this.findTableByLegendColorClick}
                                            >{" "}</button>
                                            <button size='large' style={{
                                                justifyContent: 'left',
                                                width: 370,
                                                backgroundColor: 'white',
                                                textAlign: 'left'
                                            }} className="LegendButton"
                                            data-name={data.name}
                                            data-value={data.value}
                                            onClick={this.findTableByLegendColorClick}>
                                                {`${data.name.replace(departmentHead+" ", "")} (${data.value}명)`}</button>
                                        </div>
                                        );
                                })
                            }
                        </div>
                    </div>
                    <div className="SearchBarWrapper" align="center" style={{padding: "20px"}}>
                        <FormControl variant="standard">
                            <InputLabel htmlFor="input-with-icon-adornment">
                            사원 이름으로 조회
                            </InputLabel>
                            <Input
                                id="input-with-icon-adornment"
                                onChange={this.searchingKeywordInput('searchingKeyword')}
                                startAdornment={
                                    <InputAdornment position="start">
                                        <AccountCircle />
                                    </InputAdornment>
                                }
                                />
                        </FormControl>
                    </div>
                    <div className="TableWrapper">
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell align='center'>사번</TableCell>
                                    <TableCell align='center'>부서</TableCell>
                                    <TableCell align='center'>직급</TableCell>
                                    <TableCell align='center'>직무</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    this.state.employeeData.filter((data) =>{
                                        if (data.department.name.includes(this.state.dataName) && this.state.dataName){
                                            console.log('클릭로직');
                                            return data;
                                        }
                                        else if (data.department.name.toLowerCase().includes(this.state.searchingKeyword.toLowerCase())){
                                            console.log('검색로직');
                                            return data;
                                        }
                                        else {
                                            console.log('else로직');
                                            return "";
                                        }
                                    }).map((filteredData) => { 
                                        return (
                                            <TableRow>
                                                <TableCell align='center' width={100}>{filteredData.id}</TableCell>
                                                <TableCell align='center' width={300}>{filteredData.department.name.replace(departmentHead, "")}</TableCell>
                                                <TableCell align='center'>{filteredData.stafflevel.level}</TableCell>
                                                <TableCell align='center'>{filteredData.jobCategory.name}</TableCell>
                                            </TableRow>
                                        );
                                    })
                                }
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>
        );
    }
}

export default DepartmentChart;