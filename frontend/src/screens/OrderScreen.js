import React, { useEffect, useState } from "react";
import axios from "axios";
import { PayPalButton } from "react-paypal-button-v2";
import {  Row, Col, ListGroup, Image,Button  } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { getOrderDetails, payOrder,deliverOrder } from "../actions/orderAction";
import { ORDER_PAY_RESET,ORDER_DELIVERED_RESET } from "../contents/orderContent";
const OrderScreen = ({ match,history }) => {
  const orderId = match.params.id;
  const [sdkReady, setSdkReady] = useState(false);
  const dispatch = useDispatch();

  const orderDetails = useSelector((state) => state.orderDetails);
  const orderPay = useSelector((state) => state.orderPay);
  const orderDeliver = useSelector((state) => state.orderDeliver);
  const userLogin = useSelector((state) => state.userLogin);
  const{userInfo}=userLogin

  const { loading: loadingPay, success: successPay } = orderPay;
  const { order, loading, error } = orderDetails;
  const { loading: loadingDeliver, success: successDeliver } = orderDeliver;
  
  const addDecimals = (number) => {
    return (Math.round(number * 100) / 100).toFixed(2);
  };
  if (!loading) {
    order.itemsPrice = addDecimals(
      order.orderItems
        .reduce((acc, item) => (acc = acc + item.price * item.qty), 0)
        .toFixed(2)
    );
  }
  useEffect(() => {
    if (!userInfo) {
      history.push('/login')
    }
      const addPayPalScript = async () => {
        const { data: clientId } = await axios.get("/api/config/paypal");
        const script = document.createElement("script");
        script.type = "text/javascript";
        script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`;
        script.async = true;
        script.onload = () => {
          setSdkReady(true);
        };
        document.body.appendChild(script);
      };
      if (!order || successPay||successDeliver) {
        dispatch({ type: ORDER_PAY_RESET });
        dispatch({type:ORDER_DELIVERED_RESET})
        dispatch(getOrderDetails(orderId));
      } else if (!order.isPaid) {
        if (!window.paypal) {
          addPayPalScript();
        } else {
          setSdkReady(true);
        }
      }
    
    
  }, [dispatch, orderId, successPay, order,userInfo,history,successDeliver]);
  const successPaymentHandler = (paymentResult) => {
  
    dispatch(payOrder(orderId, paymentResult));
  };
  const deliverHandler=()=>{
    dispatch(deliverOrder(order))
  }
  return loading ? (
    <Loader />
  ) : error ? (
    <Message varient="danger">{error}</Message>
  ) : (
    <>
      <h1>Ordder {order._id}</h1>
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Name : </strong> {order.user.name}
              </p>
              <p>
                <strong>Email : </strong>
                <a href={`mailto:${order.user.email}`}>{order.user.email}</a>
              </p>
              <strong>Address:</strong>
              <p>
                {order.shippingAddress.address}, {order.shippingAddress.city},{" "}
                {order.shippingAddress.postalCode},{" "}
                {order.shippingAddress.country}
              </p>
              {order.isDelivered ? (
                <Message varient="success">
                  Delivred on {order.DelievredAt}
                </Message>
              ) : (
                <Message varient="danger"> Not Delivred</Message>
              )}
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>payment Method</h2>

              <strong>Method</strong>
              <p>{order.paymentMethod}</p>

              {order.isPaid ? (
                <Message varient="success">Paid on {order.paidAt}</Message>
              ) : (
                <Message varient="danger"> Not Paid</Message>
              )}
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Order Items</h2>
              {order.orderItems.length === 0 ? (
                <Message>Order is empty</Message>
              ) : (
                <ListGroup variant="flush">
                  {order.orderItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col md={1}>
                          <Image
                            src={item.image}
                            alt={item.alt}
                            fluid
                            rounded
                          />
                        </Col>
                        <Col>
                          <Link to={`/product/${item.product}`}>
                            {item.name}
                          </Link>
                        </Col>
                        <Col md={4}>
                          {item.qty} X ${item.price} = ${item.qty * item.price}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Order Summary</h2>
            </ListGroup.Item>
            <ListGroup.Item>
              <Row>
                <Col>Items</Col>
                <Col>${order.itemsPrice}</Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item>
              <Row>
                <Col>Shipping</Col>
                <Col>${order.shippingPrice}</Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item>
              <Row>
                <Col>Tax</Col>
                <Col>${order.taxPrice}</Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item>
              <Row>
                <Col>Total</Col>
                <Col>${order.totalPrice}</Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item>
              {error && <Message varient="danger">{error}</Message>}
            </ListGroup.Item>
           

            <ListGroup.Item>
              {!order.isPaid && (
                <ListGroup.Item>
                  {loadingPay ? (
                    <Loader />
                  ) : !sdkReady ? (
                    <Loader />
                  ) : (
                    <PayPalButton
                      amount={order.totalPrice}
                      onSuccess={successPaymentHandler}
                    />
                  )}
                  
                </ListGroup.Item>
              )}
            </ListGroup.Item>
            {loadingDeliver&&<Loader/>}
            {userInfo&&(userInfo.isAdmin) && (order.isPaid) && (!order.isDelivered) &&(
                <ListGroup.Item><Button className='btn btn-block' onClick={deliverHandler}>Mark as deliver</Button></ListGroup.Item>
              )
            }
          </ListGroup>
        </Col>
      </Row>
    </>
  );
};

export default OrderScreen;
