import React, { useContext, useEffect } from "react"
import { Col, Container, Row, Button } from "react-bootstrap"
import Trash from "../assest/icon/trash.png"
import { UserContext } from "../context/userContext"
import { useNavigate } from "react-router-dom"
import { API } from "../config/api"
import { useQuery, useMutation } from "react-query"
import NotOrder from "../component/error/notorder"

const Cart = () => {
  const navigate = useNavigate()
  const [state] = useContext(UserContext)

  const { data: cart, refetch } = useQuery("cartsCache", async () => {
    if (state.isLogin === true) {
      const response = await API.get("/user-cart")
      return response.data.data
    }
  })

  console.log(cart)

  const formatIDR = new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  })

  let Total = 0

  cart?.map((e) => {
    Total += e.total
  })

  let handleDelete = async (id) => {
    await API.delete(`/cart/` + id)
    refetch()
  }

  const handleSubmit = useMutation(async () => {
    const config = {
      headers: {
        "Content-type": "application/json",
      },
    }

    const data = {
      total: Total,
    }

    const response = await API.patch("/transaction", data, config)
    console.log("ini data token", response)
    refetch()

    const token = response.data.data.token

    window.snap.pay(token, {
      onSuccess: function (result) {
        console.log(result)
        navigate("/profile")
      },
      onPending: function (result) {
        console.log(result)
        navigate("/profile")
      },
      onError: function (result) {
        console.log(result)
      },
      onClose: function () {
        alert("you closed the popup without finishing the payment")
      },
    })
  })

  useEffect(() => {
    const midtransScriptUrl = "https://app.sandbox.midtrans.com/snap/snap.js"

    const myMidtransClientKey = "SB-Mid-client-UIMxLOD3ZruAxkoC"

    let scriptTag = document.createElement("script")
    scriptTag.src = midtransScriptUrl

    scriptTag.setAttribute("data-client-key", myMidtransClientKey)

    document.body.appendChild(scriptTag)
    return () => {
      document.body.removeChild(scriptTag)
    }
  }, [])

  return (
    <>
      { Total == 0 ?
      <NotOrder/>
      :
      <Container>
        <h3
          style={{
            fontWeight: "700",
            fontSize: "32px",
            marginTop:"50px",
            marginBottom: "25px",
            fontFamily: "Times",
          }}
        >
          My Cart
        </h3>
        <p
          style={{
            fontWeight: "400",
            fontSize: "18px",
            fontFamily: "Avenir",
          }}
        >
          Review Your Order
        </p>
        <Row>
          <Col md={8}>
            <hr />
            {cart?.map((e, index) => {
              return (
                <div key={index}>
                  <Row>
                    <Col md="auto">
                      <img
                        src={e.book.image}
                        alt=""
                        width="100px"
                        height="150px"
                      />
                    </Col>
                    <Col>
                      <h4>
                        {e.book.title}
                        <Button
                          variant="none"
                          className="float-end"
                          onClick={() => {
                            handleDelete(e.id)
                          }}
                        >
                          <img src={Trash} />
                        </Button>
                      </h4>
                      <span className="text-gray">By. {e.book.author}</span>
                      <p className="text-green fw-bolder">
                        {formatIDR.format(e.book.price)}
                      </p>
                    </Col>
                  </Row>
                </div>
              )
            })}
            <hr />
          </Col>

          <Col md={4}>
            <hr />
            <Col>
              Subtotal : {formatIDR.format(Total)}
              <br />
              Qty : {cart?.length}
              <br />
              <hr />
              <p className="text-green fw-bold">
                Total : {formatIDR.format(Total)}
              </p>
              <Button
                variant="dark"
                className="float-end w-75"
                onClick={() => handleSubmit.mutate()}
              >
                Pay
              </Button>
            </Col>
          </Col>
        </Row>
      </Container>  
    }
    </>
  )
}

export default Cart
