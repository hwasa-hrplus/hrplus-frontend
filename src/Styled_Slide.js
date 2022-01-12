import { styled } from "@material-ui/core";
import Slider from "react-slick";

export const Styled_Slide = styled(Slider)`
	
    .slick-list{ //얘로 크기조정 했음
    	width: 300px;
        height: 400px;
        margin: 0 auto;
        background-color: #f0f9ff;
    }
    
    .slick-prev:before, .slick-next:before{ //얘는 양옆 버튼. 커스텀 해줘야 보임
    	font-family: 'slick';
        font-size: 40px;
        line-height: 1;
        opacity: .75;
        color: #000000;
        -webkit-font-smoothing: antialiased;
    }
    `