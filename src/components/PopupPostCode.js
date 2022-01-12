import React, { useState } from 'react';
import DaumPostcode from "react-daum-postcode";
import './Modal.css';

const PopupPostCode = (props) => {
    // 열기, 닫기, 모달 헤더 텍스트를 부모로부터 받아옴
    const {open, close, header} = props;
    const [address, setAddress] = useState(undefined);
    const [addressCode, setAddressCode] = useState(undefined);
    console.log(props)

    const handleComplete = (data) => {

        let fullAddress = data.address;
        let extraAddress = '';

        if (data.addressType === 'R') {
            if (data.bname !== '') {
                extraAddress += data.bname;
            }
            if (data.buildingName !== '') {
                extraAddress += (
                    extraAddress !== ''
                        ? `, ${data.buildingName}`
                        : data.buildingName
                );
            }
            fullAddress += (
                extraAddress !== ''
                    ? ` (${extraAddress})`
                    : ''
            );
        }
        // console.log(data)
        // console.log(fullAddress)
        // console.log(data.zonecode)

        setAddress(fullAddress);
        setAddressCode(data.zonecode)
    }

    return (
      
        <div
       
            className={open
                ? 'openModal modal'
                : 'modal'}>
            {
                open
                    ? (
                        <section>
                            <header>
                                {header}
                                <button className="close" onClick={close}>
                                    {' '}
                                    &times;{' '}
                                </button>
                            </header>
                                {console.log(props.address)}
                                {console.log(Object.keys(props).includes('registAddress'))}
                                <main>
                                    {Object.keys(props).includes('registAddress')===true
                                    ? 
                                        <DaumPostcode onComplete={handleComplete} onClose={close} 
                                         {...props.registAddress[0]=address}
                                         {...props.registAddressCode[0]=addressCode}
                                        />                                
                                    :    
                                        <DaumPostcode onComplete={handleComplete} onClose={close} 
                                        {...props.address[0]=address}
                                        {...props.addressCode[0]=addressCode} 
                                        {...props.addressDetail[0]=null}
                                    />
                                        }
                                 </main> 
                            <footer>
                                <button className="close" onClick={close}>
                                    {' '}
                                    close{' '}
                                </button>
                            </footer>
                        </section>
                    )
                    : null
            }
        </div>

    );

}

export default PopupPostCode;