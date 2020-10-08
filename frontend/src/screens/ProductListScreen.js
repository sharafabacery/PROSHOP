import React, { useEffect } from "react";
//import { Link } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import { Table, Button, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import Paginate from "../components/Paginate";
import { listProducts,deleteProduct,createProduct } from "../actions/productActions";
import { PRODUCT_CREATE_RESET } from "../contents/productConstent";

const ProductListScreen = ({ history, match }) => {
  const dispatch = useDispatch();
  const pageNumber=match.params.pageNumber||1
  const productList = useSelector((state) => state.productList);
  const { loading, error, products,page,pages } = productList;
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  const productDelete=useSelector(state=>state.productDelete)
  const{loading:loadingDelete,error:errorDelete,success:successDelete}=productDelete
  const productCreate=useSelector(state=>state.productCreate)
  const{loading:loadingCreate,error:errorCreate,success:successCreate,product:createdProduct}=productCreate
  
  useEffect(() => {
      dispatch({type:PRODUCT_CREATE_RESET})
      
      if (!userInfo||!userInfo.isAdmin) {
        history.push("/login");
      }
      if(successCreate){
          history.push(`/admin/product/${createdProduct._id}/edit`)
      }else{
        dispatch(listProducts('',pageNumber))
      }
    
    
    }, [dispatch, history, userInfo,successDelete,successCreate,createdProduct,pageNumber]);

  const deleteProductsHandler = (id) => {
    if(window.confirm('Are you sure?')){
      dispatch(deleteProduct(id))
   }
  };
  const createProductHandler=()=>{
    dispatch(createProduct())  
  }
  return (
    <>
      <Row className="align-items-center">
        <Col>
          <h1>Products</h1>
        </Col>
        <Col className="text-right">
          <Button className="my-3" onClick={createProductHandler}>
            <i className="fas fa-plus">{' '} Create Product</i>
          </Button>
        </Col>
      </Row>
      {loadingDelete&&<Loader/>}
      {errorDelete&&<Message varient='danger'>{errorDelete}</Message>}
      {loadingCreate&&<Loader/>}
      {errorCreate&&<Message varient='danger'>{errorCreate}</Message>}
      
      {loading ? (
        <Loader />
      ) : error ? (
        <Message varient='danger'>{error}</Message>
      ) : (<>
        <Table striped bordered hover responsive className="table-sm">
          <thead>
            <tr>
              <td>ID</td>
              <td>Name</td>
              <td>Price</td>
              <td>Category</td>
              <td>Brand</td>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                <td>{product._id}</td>
                <td>{product.name}</td>
                <td>${product.price}</td>
                <td>{product.category}</td>
                <td>{product.brand}</td>

                <td>
                  <LinkContainer to={`/admin/product/${product._id}/edit`}>
                    <Button variant="light" className="btn-sm">
                      <i className="fas fa-edit"></i>
                    </Button>
                  </LinkContainer>
                  <Button
                    variant="danger"
                    className="btn-sm"
                    onClick={() => {
                        deleteProductsHandler(product._id);
                    }}
                  >
                    <i className="fas fa-trash"></i>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <Paginate page={page} pages={pages} isAdmin={userInfo.isAdmin}/>
        </>
      )}
    </>
  );
};

export default ProductListScreen;
