import React, { Component } from "react";
import styled, { injectGlobal } from "styled-components";

injectGlobal`
	html, body {
		margin: 0;
		font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"; 
	}
	* {
		box-sizing: border-box;
		font-size: 14px;
	}
`;

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
`;

const Form = styled.form`
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 500px;
`;

const Input = styled.input`
    width: 100%;
    height: 40px;
    border-radius: 5px;
    border: 1px solid rgb(201, 201, 201);
    padding: 10px;
`;

const Label = styled.label`
    font-weight: 700;
    margin-bottom: 5px;
`;

const Text = styled.p`
    margin: 0;
`;

const Button = styled.button`
	height: 40px;
	width: 100px;
	border-radius: 4px;
	background-color: rgb(84, 128, 184);
	color: white;
	font-siz
`;

const WrapperFormInput = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    height: 70px;
    margin-bottom: 10px;
`;

const CreditCardInput = Input.extend`
    width: 65%;
    border-radius: 4px 0 0 4px;
`;

const Indicator = styled.span`
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgb(235, 235, 235);
    height: 40px;
    width: 35%;
    border: 1px solid rgb(201, 201, 201);
    border-radius: 0 4px 4px 0;
`;

const CreditCardInputWrapper = styled.div`
    display: flex;
    align-items: center;
`;

const Row = styled.div`
    display: flex;
    justify-content: flex-start;
`;

const RowData = styled.span`
    display: inline-block;
    width: 49%;
    margin-right: 2%;
    &:last-child {
        margin-right: 0;
    }
`;

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ccNumber: ""
        };
        this.creditCardType = "?";
    }

    handleChangeInput = (e, property) => {
        let regex = /^\d*$/;
        if (regex.test(e.target.value.toString()) || e.target.value === "") {
            this.setState({ [property]: e.target.value });
        }
    };

    handleCheckCard() {
        let { ccNumber } = this.state;
        if (ccNumber.length > 0) {
            switch (ccNumber[0]) {
                case "3":
                    if (ccNumber[1] === "4" || ccNumber[1] === "7") {
                        return (this.creditCardType = "American Express");
                    } else {
                        return (this.creditCardType = "?");
                    }
                case "4":
                    return (this.creditCardType = "Visa");
                case "5":
                    return (this.creditCardType = "Mastercard");
                default:
                    return (this.creditCardType = "?");
            }
        } else {
            return (this.creditCardType = "?");
        }
    }

    handleCheckLuhnAlgo() {
		let ccNumber = this.state.ccNumber.toString().split("");
		// In Wikipedia, Luhn Algorithm adds a x (check digit)
		// The first left digit of x and every other number is captured by this filter
		let evenNumbers = [];
        let oddNumbers = ccNumber.filter((val, i) => {
            let index = "";
            ccNumber.length % 2 === 0 ? (index = i) : (index = i + 1);
            if (index === 0 || index % 2 === 0) {
				evenNumbers.push(parseInt(val, 10));
				return null;
            } else {
                return val;
            }
		});
		// Doubling the odd numbers and subtracting by 9 if it is bigger than 9
		let newOddNumbers = oddNumbers.map((val) => {
			let newVal = val * 2;
			if(newVal > 9) {
				return newVal - 9
			} else {
				return newVal;
			}
		})
		// adding all numbers and multiplying the result by 9
		let checkValue = newOddNumbers.concat(evenNumbers).reduce((acc, val) => acc + val ) *  9;
		if( checkValue % 10 === 0 ) {
			return true;
		} else {
			return false;
		}
    }

    handleCheckCardLength(card) {
        let { ccNumber } = this.state;
        if ( this.creditCardType === "American Express" && ccNumber.length === 15) {
            if ( !this.handleCheckLuhnAlgo() ){
                return (<span role="img" aria-label="Crossmark">
                    ❌
                </span>);
			}
            return (
                <span role="img" aria-label="Checkmark">
                    ✅
                </span>
            );
        } else if (this.creditCardType === "Visa" && ccNumber.length >= 13) {
			if ( !this.handleCheckLuhnAlgo() ){
                return (<span role="img" aria-label="Crossmark">
                    ❌
                </span>);
			}
            return (
                <span role="img" aria-label="Checkmark">
                    ✅
                </span>
            );
        } else if ( this.creditCardType === "Mastercard" && ccNumber.length === 16) {
			if ( !this.handleCheckLuhnAlgo() ){
                return (<span role="img" aria-label="Crossmark">
                    ❌
                </span>);
			}
            return (
                <span role="img" aria-label="Checkmark">
                    ✅
                </span>
            );
        }
    }

    render() {
        console.log();
        return (
            <Wrapper>
                <Form>
                    <WrapperFormInput>
                        <Label>Credit Card Number: </Label>
                        <CreditCardInputWrapper>
                            <CreditCardInput
                                type="text"
                                maxLength={16}
                                value={this.state.ccNumber}
                                onChange={e =>
                                    this.handleChangeInput(e, "ccNumber")
                                }
                            />
                            <Indicator>
                                <Text>
                                    {this.handleCheckCard()}
                                    {this.state.ccNumber.length >= 13
                                        ? this.handleCheckCardLength()
                                        : null}
                                </Text>
                            </Indicator>
                        </CreditCardInputWrapper>
                    </WrapperFormInput>
                    <WrapperFormInput>
                        <Label>Name on Card: </Label>
                        <div>
                            <Input />
                        </div>
                    </WrapperFormInput>
                    <WrapperFormInput>
                        <Row>
                            <RowData>
                                <Label>Expiry Date: </Label>
                            </RowData>
                            <RowData>
                                <Label>CVV: </Label>
                            </RowData>
                        </Row>
                        <Row>
                            <RowData>
                                <Input />
                            </RowData>
                            <RowData>
                                <Input />
                            </RowData>
                        </Row>
                    </WrapperFormInput>
                    <WrapperFormInput>
                        <Button>Submit</Button>
                    </WrapperFormInput>
                </Form>
            </Wrapper>
        );
    }
}

export default App;
