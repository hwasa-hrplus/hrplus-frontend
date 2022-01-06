import React from 'react';

const Styles = () => {
    return (
        <style type="text/css">
        {`
        body{
            background-color: white;
        }
            .topBar {
                background-color: #006399;
                height: 70px;
            }
            .topBar.logo{
                color: white;
                margin: auto;
                height: auto;
                font-size: 35px;
                font-weight: bold;
            }
            .topBar.logo:hover{
                color: white;
            }
            
            a{ color: white; text-decoration: none;}
            a:visited { color: white; text-decoration: none;}
            a:hover { color: white; text-decoration: none;}
            .nav {
                background:#006399;
            }            
            .nav-pills .nav-link{
                display: inline-block;
                border-radius:0;
                font-size:20px;
                color:white;
            }

            .nav-pills .nav-link.active{
                background-color: white;
                color: #006399;
            }
            .container, .container-lg, .container-md, .container-sm{
                width: max;
            }

            .d-md-block.side.nav{
                background-color: transparent;
                padding:0;
                color: black;
                width: 200px;
                padding-top: 20px;
                
                margin-right:0;
            }
            .sideItem.nav-link{
                color:#006399;
                font-size: 17px;
            }

            .sideItem.nav-link:hover{
                color:black;                
            }

            .sideMenuContent{
                height:800px;
            }

            .sideMenu{
                float: left;
                height:100%;
                width: 200px;
                background-color: #E9E9E9;
            }
            
            .nav-link.active{
                background-color:white;
            }
        `}
  </style>
    );
};

export default Styles;