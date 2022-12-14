import React from "react"
import { Container, Row, Col, Button } from "react-bootstrap"
import { useQuery } from "react-query"
import { API } from "../../config/api"

const MyBook = () => {
  const formatIDR = new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  })

  let { data: transUser } = useQuery("transUserCache", async () => {
    const response = await API.get("/my-trans")

    return response.data.data
  })

  console.log(transUser, "ini transaction")
  return (
    <>
      <Container className="mt-5">
        <h2 className="my-5">My Books</h2>
        <Row md={4}>
          {transUser?.map((e) => {
            return (
              <>
                {e.cart.map((a, index) => {
                  return (
                    <>
                      <Col key={index} className="mb-4 mt-3">
                        <img src={a.book.image} alt="" className="w-100 h-75" />
                        <h3>{a.book.title.slice(0,30)}</h3>
                        <span className="text-secondary">
                          By. {a.book.author}
                        </span>
                        <Button variant="dark" className="w-100 mt-3 mb-4">
                          Download
                        </Button>
                      </Col>
                    </>
                  )
                })}
              </>
            )
          })}
        </Row>
      </Container>
    </>
  )
}

export default MyBook
