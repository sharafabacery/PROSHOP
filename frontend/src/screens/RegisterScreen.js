import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Form, Button, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import FormContainer from "../components/FormContainer";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { register } from "../actions/userAction";

const RegisterScreen = ({ location, history }) => {
    const [email, setEmail] = useState("");
    
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message,setMessage]=useState(null);
    
    
    const dispatch = useDispatch()
    const userRegister = useSelector(state => state.userRegister)
    const { loading, error, userInfo } = userRegister

    const redirect = location.search ? location.search.split('=')[1] : '/'

    useEffect(() => {
        if (userInfo) {
            history.push(redirect)
        }
    }, [history, userInfo, redirect])

    const submitHandler = (e) => {
        e.preventDefault()
        if(password!==confirmPassword){
            setMessage('Passwords do not match')
        }else{
            dispatch(register(name,email, password))
        }
        
    }
    return (
        <FormContainer>
            <h1>Sign up</h1>
            {message && <Message varient='danger'>{message}</Message>}
            {error && <Message varient='danger'>{error}</Message>}
            {loading && <Loader />}
            <Form onSubmit={submitHandler}>
            <Form.Group controlId="name">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    ></Form.Control>
                </Form.Group>
                <Form.Group controlId="email">
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control
                        type="email"
                        placeholder="Enter email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    ></Form.Control>
                </Form.Group>
                <Form.Group controlId="password">
                    <Form.Label>password</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    ></Form.Control>
                </Form.Group>
                <Form.Group controlId="confirmpassword">
                <Form.Label>Confirm password</Form.Label>
                <Form.Control
                    type="password"
                    placeholder="Confirm password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                ></Form.Control>
            </Form.Group>
                <Button type='submit' variant='primary'>Register</Button>
            </Form>
            <Row className='py-3'><Col>Have account? <Link to={redirect ? `/login?redirect=${redirect}` : '/register'}>Login</Link></Col></Row>
        </FormContainer>
    );
};

export default RegisterScreen;
