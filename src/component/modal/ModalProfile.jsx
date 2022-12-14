import React, { useState } from "react"
import { Form, Modal, Button } from "react-bootstrap"
import { useMutation } from "react-query"
import { API } from "../../config/api"

const ModalProfile = ({ show, setShow, hide, refetch }) => {
  const [form, setForm] = useState({
    fullname: "",
    password: "",
    image: "",
    address: "",
    phone: "",
  })

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]:
        e.target.type === "file" ? e.target.files : e.target.value,
    })
  }

  const handleSubmit = useMutation(async (e) => {
    try {
      e.preventDefault()

      const config = {
        headers: {
          "Content-type": "multipart/form-data",
        },
      }

      const formData = new FormData()
      formData.set("fullname", form.fullname)
      formData.set("password", form.password)
      formData.set("image", form.image[0])
      formData.set("address", form.address)
      formData.set("phone", form.phone)

      await API.patch("/user-update", formData, config)
      refetch()

      setShow(false)
    } catch (error) {
      console.log(error)
    }
  })
  return (
    <>
      
<Modal show={show} onHide={hide} centered>
<Card
  className=" position-absolute top-50 start-50 translate-middle p-5"
  style={{
    width: "400px",
  }}
>

  <Form onSubmit={(e) => handleSubmit.mutate(e)}>
    <Form.Group>
      <Form.Label className="mb-4 fs-1">Edit Profile</Form.Label>
      <Form>
        <Form.Control
          
          className="mb-4"
          onChange={handleChange}
          type="text"
          name="fullname"
          placeholder="Fullname"
          required
        />
        <Form.Control
         onChange={handleChange}
          className="mb-4"
        name="password"
          type="password"
          placeholder="Password"
          required
        />
         <Form.Control
         onChange={handleChange}
          className="mb-4"
          name="image"
          type="file"
          required
        />
         <Form.Control
         onChange={handleChange}
          className="mb-4"
          name="address"
          placeholder="Address"
          as="textarea"
          required
        />
      </Form>
      <Button
        variant="dark"
        className="mb-2 text-center w-100"
        type="submit"
      >
        Login
      </Button>
    </Form.Group>
  </Form>
</Card>
</Modal>
    </>
  )
}

export default ModalProfile
