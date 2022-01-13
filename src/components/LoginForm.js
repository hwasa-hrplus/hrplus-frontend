
import axios from "axios";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Profile from "./Profile";

const Container = styled.div`
  margin-top: 100px;
  padding: 20px;

`;

const Input = styled.input`
  position: relative;
  overflow: hidden;
  width: 340px;
  height: 40px;
  margin: 0 0 8px;
  padding: 5px 39px 5px 11px;
  border: solid 1px #dadada;
  background: #fff;
  box-sizing: border-box;
`;


const Button = styled.div`
  font-size: 18px;
  font-weight: 700;
  line-height: 40px;
  display: block;
  width: 150px;
  height: 40px;
  margin: 0 0 8px;
  cursor: pointer;
  text-align: center;
  color: #fff;
  border: none;
  border-radius: 0px;
  background-color: #006399;

  
  ${({ disabled }) =>
    disabled &&
    `
    background-color: #efefef;
  `}
`;
//아디 비번 값 받기
//값없으면 disabled
function LoginForm() {
    const [inputId, setInputId] = useState('')
    const [inputPw, setInputPw] = useState('')
 
    const handleInputId = (e) => {
        setInputId(e.target.value)
    }
 
    const handleInputPw = (e) => {
        setInputPw(e.target.value)
    }
 
    const onClickLogin = () => {
        console.log('click login')
        console.log('ID : ', inputId)
        console.log('PW : ', inputPw)
        axios.post('/onLogin', null, {
            params: {
            'id': inputId,
            'password': inputPw
            }
        })
        .then(res => {
            console.log(res)
            console.log('res.data.userId :: ', res.data.userId)
            console.log('res.data.msg :: ', res.data.msg)
            if(res.data.userId === undefined){
                // id 일치하지 않는 경우 userId = undefined, msg = '입력하신 id 가 일치하지 않습니다.'
                console.log('======================',res.data.msg)
                alert('입력하신 id 가 일치하지 않습니다.')
            } else if(res.data.userId === null){
                // id는 있지만, pw 는 다른 경우 userId = null , msg = undefined
                console.log('======================','입력하신 비밀번호 가 일치하지 않습니다.')
                alert('입력하신 비밀번호 가 일치하지 않습니다.')
            } else if(res.data.userId === inputId) {
                // id, pw 모두 일치 userId = userId1, msg = undefined
                console.log('======================','로그인 성공')
                sessionStorage.setItem('user_id', inputId)
            }
            // 작업 완료 되면 페이지 이동(새로고침)
            document.location.href = '/'
        })
        .catch()
    }
 
     useEffect(() => {
         axios.get('/user_inform/login')
         .then(res => console.log(res))
         .catch()
     },[])
  return (
    <Container>
      <Profile/>
      {/* <SimpleSlider/> */}
      {/* <table align='center'>
          <tr>
              <td>
              <Input type = "text"  id="id" name="id" onChange={handleInputId} placeholder="아이디를 입력해주세요" />
              </td>
              <td>
                <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="비밀번호를 입력해주세요"
                    onChange={handleInputPw}
                 />
              </td>
              <td>
                <Button  onClick={onClickLogin}>LOGIN</Button>
              </td>
          </tr>
      </table> */}
     
     
    </Container>
  );
}

export default LoginForm;
