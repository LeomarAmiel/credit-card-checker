import React, { Component } from "react";
import styled, { injectGlobal } from "styled-components";

injectGlobal`
	html, body {
		margin: 0;
		font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"; 
		font-size: 16px;
	}
	* {
		box-sizing: border-box;
	}
`;

const Wrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
`;

const Form = styled.form`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: stretch;
    width: 30rem;
`;

const Row = styled.div`
    display: flex;
    justify-content: flex-start;
`;

const RowData = styled.span`
    display: inline-block;
    width: 49%;
	margin-right: 2%;
    margin-bottom: .75rem;
    &:last-child {
        margin-right: 0;
    }
`;

const Label = styled.label`
    font-weight: 700;
	margin-bottom: .75rem;
`;

const Text = styled.p`
    margin: 0;
`;

const Button = styled.button`
    background-color: rgb(84, 128, 184);
    color: white;
    border-radius: 0.5rem;
    font-size: 0.8rem;
    height: 2.5rem;
    width: 7.5rem;
`;

const WrapperFormInput = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    margin-bottom: 1.25rem;
`;

const Input = styled.input`
    border-radius: 0.5rem;
    border: 1px solid rgb(201, 201, 201);
    padding: 0.25rem .25rem .25rem 1rem;
    font-size: 1rem;
    height: 2.5rem;
    width: 100%;
`;

const CreditCardInput = Input.extend`
    width: 65%;
    border-radius: 0.5rem 0 0 0.5rem;
`;

const Indicator = styled.span`
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgb(235, 235, 235);
    height: 2.5rem;
    width: 35%;
    border: 1px solid rgb(201, 201, 201);
    border-radius: 0 0.5rem 0.5rem 0;
`;

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            creditCardNumber: ""
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
        let { creditCardNumber } = this.state;
        if (creditCardNumber.length > 0) {
            switch (creditCardNumber[0]) {
                case "3":
                    if (creditCardNumber[1] === "4" || creditCardNumber[1] === "7") {
                        return this.creditCardType = "American Express";
                    } else {
                        return this.creditCardType = "?";
                    }
                case "4":
                    return this.creditCardType = "Visa";
                case "5":
                    return this.creditCardType = "Mastercard";
                default:
                    return this.creditCardType = "?";
            }
        } else {
            return this.creditCardType = "?";
        }
    }

    handleCheckLuhnAlgo() {
        let creditCardNumber = this.state.creditCardNumber.toString().split("");
        // In Wikipedia, Luhn Algorithm adds a x (check digit)
        // The first left digit of x and every other number is captured by this filter
        let evenNumbers = [];
        let oddNumbers = creditCardNumber.filter((val, i) => {
            let index = "";
            creditCardNumber.length % 2 === 0 ? (index = i) : (index = i + 1);
            if (index === 0 || index % 2 === 0) {
                evenNumbers.push(parseInt(val, 10));
                return null;
            } else {
                return val;
            }
        });
        // Doubling the odd numbers and subtracting by 9 if it is bigger than 9
        let newOddNumbers = oddNumbers.map(val => {
            let newVal = val * 2;
            if (newVal > 9) {
                return newVal - 9;
            } else {
                return newVal;
            }
        });
        // adding all numbers and multiplying the result by 9
        let checkValue =
            newOddNumbers.concat(evenNumbers).reduce((acc, val) => acc + val) * 9;
        if (checkValue % 10 === 0) {
            return true;
        } else {
            return false;
        }
    }

    handleCheckCardLength(card) {
        let { creditCardNumber } = this.state;
        if ( this.creditCardType === "American Express" && creditCardNumber.length === 15 ) {
            if (!this.handleCheckLuhnAlgo()) {
                return (
                    <span role="img" aria-label="Crossmark">
                        ❌
                    </span>
                );
            }
            return (
                <span role="img" aria-label="Checkmark">
                    ✅
                </span>
            );
        } else if (this.creditCardType === "Visa" && creditCardNumber.length >= 13) {
            if (!this.handleCheckLuhnAlgo()) {
                return (
                    <span role="img" aria-label="Crossmark">
                        ❌
                    </span>
                );
            }
            return (
                <span role="img" aria-label="Checkmark">
                    ✅
                </span>
            );
        } else if ( this.creditCardType === "Mastercard" && creditCardNumber.length === 16 ) {
            if (!this.handleCheckLuhnAlgo()) {
                return (
                    <span role="img" aria-label="Crossmark">
                        ❌
                    </span>
                );
            }
            return (
                <span role="img" aria-label="Checkmark">
                    ✅
                </span>
            );
        }
    }

    render() {
        return (
            <Wrapper>
                <Form>
                    <WrapperFormInput>
                        <Label htmlFor="credit-card">
                            Credit Card Number:
                        </Label>
                        <Row>
                            <CreditCardInput
                                id="credit-card"
                                type="text"
                                maxLength={16}
                                value={this.state.creditCardNumber}
                                onChange={e =>
                                    this.handleChangeInput(e, "creditCardNumber")
                                }
                            />
                            <Indicator>
                                <Text>
                                    {this.handleCheckCard()}
                                    {this.state.creditCardNumber.length >= 13
                                        ? this.handleCheckCardLength()
                                        : null}
                                </Text>
                            </Indicator>
                        </Row>
                    </WrapperFormInput>
                    <WrapperFormInput>
                        <Label htmlFor="name">Name on Card: </Label>
                        <Row>
                            <Input id="name" type="text" />
                        </Row>
                    </WrapperFormInput>
                    <WrapperFormInput>
                        <Row>
                            <RowData>
                                <Label htmlFor="expiry-date">Expiry Date: </Label>
                            </RowData>
                            <RowData>
                                <Label htmlFor="CVV">CVV: </Label>
                            </RowData>
                        </Row>
                        <Row>
                            <RowData>
                                <Input id="expiry-date" type="text" />
                            </RowData>
                            <RowData>
                                <Input id="CVV" type="text" />
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
