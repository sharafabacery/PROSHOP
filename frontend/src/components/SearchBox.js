import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
const SearchBox = ({ history }) => {
  const [keyWord, setKeyWord] = useState("");
  const onSubmitHandler = (e) => {
    e.preventDefault();
    if (keyWord.trim()) {
     
      history.push(`/search/${keyWord}`);
    } else {
      history.push("/");
    }
  };
  return (
    <Form onSubmit={onSubmitHandler} inline>
      <Form.Control
        type="text"
        name="q"
        
        onChange={(e) => setKeyWord(e.target.value)}
        placeholder="Search Product..."
        className="mr-sm-2 ml-sm-5"
      ></Form.Control>

      <Button type="submit" variant="outline-success" className="p-2">
        Search
      </Button>
    </Form>
  );
};

export default SearchBox;
