import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import FormContainer from "../components/FormContainer";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { getUserDetails,updateUser } from "../actions/userAction";
import { USER_UPDATE_RESET } from "../contents/userContent";
const UserEditScreen = ({ match, history }) => {
  const userId = match.params.id;
  const [email, setEmail] = useState("");

  const [isAdmin, setIsAdmin] = useState(false);
  const [name, setName] = useState("");

  const dispatch = useDispatch();
  const userDetails = useSelector((state) => state.userDetails);
  const { loading, error, user } = userDetails;
   
  const userUpdate = useSelector((state) => state.userUpdate);
  const { loading:LoadingUpdate, error:errorUpdate,success:successUpdate } = userUpdate;

  useEffect(() => {
      if (successUpdate) {
          dispatch({type:USER_UPDATE_RESET})
          history.push('/admin/userList')
      }else{
        if (!user.name || user._id !==userId) {
            dispatch(getUserDetails(userId))
        }else{
            setName(user.name)
            setEmail(user.email)
            setIsAdmin(user.isAdmin)
        }
        
      }
      
  }, [dispatch,userId,user,successUpdate,history]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(updateUser(userId,{email,name,isAdmin}))
  };
  return (
    <>
      <Link to="/admin/userList" className="btn btn-light my-3">
        Go Back
      </Link>
      {LoadingUpdate &&<Loader/>}
      {errorUpdate&&<Message varient='danger'>{errorUpdate}</Message>}
      <FormContainer>
        <h1>Edit User</h1>
        {loading ? (
          <Loader />
        ) : error ? (
          <Message varient="danger">{error}</Message>
        ) : (
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
            <Form.Group controlId="isadmin">
              
              <Form.Check
                type="checkbox"
                label="isAdmin"
                checked={isAdmin}
                onChange={(e) => setIsAdmin(e.target.checked)}
              ></Form.Check>
            </Form.Group>
            
            <Button type="submit" variant="primary">
              Update
            </Button>
          </Form>
        )}
      </FormContainer>
    </>
  );
};

export default UserEditScreen;
