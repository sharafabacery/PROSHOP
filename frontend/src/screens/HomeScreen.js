import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from 'react-router-dom';
import { Row, Col } from "react-bootstrap";
import Message from "../components/Message";
import Loader from "../components/Loader";
import Product from "../components/Product";
import ProductCarousel from "../components/ProductCarousel";
import Meta from "../components/Meta";
import { listProducts } from "../actions/productActions";
import Paginate from '../components/Paginate';
const HomeScreen = ({match}) => {
  const keyword=match.params.keyword
  const pageNumber=match.params.pageNumber||1
  const dispatch = useDispatch()
  const productList = useSelector(state => state.productList)
  const { loading, error, products,page,pages } = productList
  useEffect(() => {
    dispatch(listProducts(keyword,pageNumber))
  }, [dispatch,keyword,pageNumber]);
  return (
    <>
   <Meta/>
    {!keyword?<ProductCarousel/>:<Link to='/' className='btn btn-light'>go back</Link>}
      <h1>Lastest Products</h1>
      {
        loading ? <Loader/>: error ? <Message varient={'danger'}>{error}</Message> :<> <Row>
          {products.map((product) => (
            <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
              <Product product={product} />
            </Col>
          ))}
        </Row>
        <Paginate pages={pages} page={page} keyword={keyword?keyword:''}/>
        </>
      }

    </>
  );
};

export default HomeScreen;
