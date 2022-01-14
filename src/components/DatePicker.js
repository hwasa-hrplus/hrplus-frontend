import React, { useState } from 'react';
import { Button } from '@material-ui/core';

import ReactDatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
function DatePicker(props) {
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    console.log(startDate, endDate);


    const sendRegist = ()=>{
        props.datePickerFunc(startDate, endDate);
        console.log('date:   '+startDate);
        
    }
    return (
        <>
        <table >
            <tr >
                <td>
                <div >
                         <ReactDatePicker
                        dateFormat="yyyy년 MM월 dd일"
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
                        selectsStart
                        minDate={new Date()}
                        startDate={startDate}
                        endDate={endDate}
                        />
                </div>
                </td>
                <td> ~ </td>
                <td>
                <div>
                             <ReactDatePicker
                            dateFormat="yyyy년 MM월 dd일"
                            selected={endDate}
                            onChange={(date) => setEndDate(date)}
                            selectsEnd
                            minDate={startDate}
                            startDate={startDate}
                            endDate={endDate}
                            />
                </div>
                </td>
                    <td>&nbsp;&nbsp;&nbsp;&nbsp;</td>
                <td>
                    
                       <h6> {Math.ceil((endDate.getTime() - startDate.getTime()) / (1000*60*60*24))}박 &nbsp;
                        {Math.ceil((endDate.getTime() - startDate.getTime()) / (1000*60*60*24)) + 1}일</h6>
                </td>
                <td>&nbsp;&nbsp;&nbsp;&nbsp;</td>
                <td>
                <Button onClick={sendRegist} variant="contained">
                    확인
                </Button>
                </td>
             </tr>
        </table>    
    
      </>
    );
}

export default DatePicker;