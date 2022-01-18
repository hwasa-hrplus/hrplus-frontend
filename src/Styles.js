import React from 'react';

const Styles = () => {
    return (
        <style type="text/css">
        {`
        body{
            font-family: Arial, Helvetica, sans-serif;
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
            
            a{ color: black; text-decoration: none;}
            a:visited { color: black; text-decoration: none;}
            a:hover { color: black; text-decoration: none;}
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
                height:1200px;
            }

            .sideMenuContent.admin{
                height:2000px;
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
            .MuiTable-root{
                width:1400px;
            }
            .slideBox{                
                width:1300px;
            }
            .footer{
                height: 116px;
                color: white;
                background-color: #006399;
            }
            .content{
                padding-top: 35px;
            }
            .MuiTypography-body2 {
                font-size: 0.875rem;
                font-family: "Roboto", "Helvetica", "Arial", sans-serif;
                font-weight: 400;
                line-height: 1.0;
                letter-spacing: 0.01071em;
            }
            .request{
                margin-top:20px;
            }

            .navbar-dark .navbar-text a, .navbar-dark .navbar-text a:focus, .navbar-dark .navbar-text a:hover{
                color:white;
                font-size: 1.15rem;
            }

            a#logoutBtn.btn.btn-light{
                padding: 0.2rem 0.5rem
            }
                
        `}
  </style>
    );
};

export default Styles;