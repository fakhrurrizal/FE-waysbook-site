import React, { useState, useContext } from "react"
import { Button, Card, Form, Modal } from "react-bootstrap"
import { useMutation } from "react-query"
import { API } from "../../config/api"

const Register = ({ show, hide, setShowRegister, setShowLogin }) => {
  const [form, setForm] = useState({
    fullname: "",
    email: "",
    password: "",
  })

  const handleOnSubmit = useMutation(async (e) => {
    try {
      e.preventDefault()

      const response = await API.post("/register", form)
      console.log("Berhasil Register Akun", response.data.data)
      if (response.data.code === "success") {
        setShowRegister(false)
        setShowLogin(true)
      }
    } catch (err) {
      console.log(err)
    }
  })

  return (
    <Modal show={show} onHide={hide} onSubmit={hide} centered>
      <Card
        className=" position-absolute top-50 start-50 translate-middle p-5"
        style={{
          width: "400px",
        }}
      >
        <Form onSubmit={(e) => handleOnSubmit.mutate(e)}>
          <Form.Group>
            <Form.Label className="mb-4 fs-1">Register</Form.Label>
            <Form>
              <Form.Control
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="mb-4"
                value={form.email}
                type="email"
                placeholder="Email"
                required
              />
              <Form.Control
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="mb-4"
                value={form.password}
                type="password"
                placeholder="Password"
                required
              />
              <Form.Control
                onChange={(e) => setForm({ ...form, fullname: e.target.value })}
                className="mb-4"
                value={form.fullname}
                type="text"
                placeholder="Full Name"
                required
              />
            </Form>
            <Button
              variant="dark"
              className="mb-2 text-center w-100"
              type="submit"
            >
              {handleOnSubmit.isLoading ? "Loading..." : "Register"}
            </Button>
            <p className="text-center">
              Already have an account ? Klik
              <span
                style={{ cursor: "pointer" }}
                className="ms-1 fw-bold cursor-pointer"
                onClick={() => {
                  setShowRegister(false)
                  setShowLogin(true)
                }}
              >
                Here
              </span>
            </p>
          </Form.Group>
        </Form>
      </Card>
    </Modal>
  )
}

export default Register
