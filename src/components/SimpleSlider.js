import React, { Component } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";


export default class SimpleSlider extends Component {
  render() {
    const settings = {
      infinite: true,
      speed: 50,
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: true
    };
    return (
      <div>
        <h2> Single Item</h2>
        <Slider {...settings}>
          <div>
            <img className="poscoict" 
                 alt = "img" 
                 src="../img/posco.jpg"
                 width='1500px'
                 height='640px'/>
          </div>
          <div>
          <img className="poscoict" 
                 alt = "img" 
                 src="../img/posco3.png"
                 width='1500px'
                 height='640px'/>
          </div>
          <div>
          <img className="poscoict" 
                 alt = "img" 
                 src="../img/posco7.jpg"
                 width='1500px'
                 height='640px'/>
          </div>
       
        </Slider>
      </div>
    );
  }
}