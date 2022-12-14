import React, { useContext } from "react"
import { Col, Row, Container, Button } from "react-bootstrap"
import AddProduct from '../../assest/icon/AddBook.svg'
import { useParams, useNavigate } from "react-router-dom"
import { UserContext } from "../../context/userContext"
import { API } from "../../config/api"
import { useQuery, useMutation } from "react-query"
import Moment from "react-moment"

const DetailBookComponent = () => {
  const navigate = useNavigate()
  const myMidtransClientKey = process.env.REACT_APP_MIDTRANS_CLIENT_KEY
  const [state] = useContext(UserContext)
  const { id } = useParams()

  const formatIDR = new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  })

  let { data: book } = useQuery("bookCache", async () => {
    const response = await API.get("/book/" + id)

    return response.data.data
  })

  const handleOnSubmit = useMutation(async (e) => {
    e.preventDefault()

    const config = {
      headers: { "Content-type": "application/json" },
    }

    const dataBook = {
      book_id: book.id,
    }

    console.log(book.id)
    const body = JSON.stringify(dataBook)

    await API.post("/cart", body, config)

    navigate("/")
  })

  return (
    <>
      <Container className="margin">
        <Row className="mx-5">
          <Col>
            <img
              src={book?.image}
              alt="thumbnail"
              style={{ height: "577px", objectFit: "cover" }}
            />
          </Col>
          <Col>
            <h1 className="title">{book?.title}</h1>
            <span className="author">By. {book?.author}</span>
            <h5 className="mt-5 sub-title">Publication Date</h5>
            <Moment className="text-secondary" format="DD MMM YYYY">
              {book?.publication_date}
            </Moment>
            <h5 className="mt-5 sub-title">Pages</h5>
            <span className="text-secondary">{book?.pages}</span>
            <h5 className="mt-5 text-danger sub-title">ISBN</h5>
            <span className="text-secondary">{book?.isbn}</span>
            <h5 className="sub-title mt-5">Price</h5>
            <span className="text-success fw-bolder">
              {formatIDR.format(book?.price)}
            </span>
          </Col>
        </Row>
        <Row className="mx-5 mt-5">
          <Col>
            <h2 className="title"> About This Book</h2>
            <p className="desc">{book?.description}</p>
          </Col>
        </Row>
        <div align="right" style={{ marginRight: "100px" }}>
          <Button
            variant="dark px-5 rounded-0"
            onClick={(e) => handleOnSubmit.mutate(e)}
          >
            Add Cart <img src={AddProduct} />
          </Button>
        </div>
      </Container>
    </>
  )
}

export default DetailBookComponent
