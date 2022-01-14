import { Typography } from "@material-ui/core";
import { Link } from "react-router-dom";

function Copyright(props) {
    return (
        <div className="footer">
      <Typography variant="body2" color="text.secondary" align="center" {...props}>
          <div className="content">
        {'Copyright © '}
        
          POSCO ICT Hwasa
          {' '}
        {new Date().getFullYear()}
        <p className="request">문의: 김윤욱 프로(yunuk.kim@poscoict.com)</p>
        </div>
      </Typography>
      </div>
    );
}
export default Copyright;