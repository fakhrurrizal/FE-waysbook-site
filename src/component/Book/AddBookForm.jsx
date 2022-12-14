import React, { useState } from "react"
import { Button, Container, Form } from "react-bootstrap"
import { API } from "../../config/api"
import { useNavigate } from "react-router-dom"
import { useMutation } from "react-query"

const AddBookForm = () => {
  const [preview, setPreview] = useState(null) //For image preview
  const [form, setForm] = useState({
    title: "",
    publication_date: "",
    pages: "",
    isbn: "",
    price: "",
    description: "",
    author: "",
    image: "",
    filePDF: "",
  })

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]:
        e.target.type === "file" ? e.target.files : e.target.value,
    })

    // Create image url for preview
    if (e.target.type === "file" && e.target.name === "image") {
      let url = URL.createObjectURL(e.target.files[0])
      setPreview(url)
    }
  }

  let navigate = useNavigate()

  const handleSubmit = useMutation(async (e) => {
    try {
      e.preventDefault()

      // Configuration
      const config = {
        headers: {
          "Content-type": "multipart/form-data",
        },
      }

      // Store data with FormData as object
      const formData = new FormData()

      formData.set("title", form.title)
      formData.set("author", form.author)
      formData.set("publication_date", form.publication_date)
      formData.set("pages", form.pages)
      formData.set("isbn", form.isbn)
      formData.set("price", form.price)
      formData.set("description", form.description)
      formData.set("image", form.image[0], form.image[0].name)
      formData.set("filePDF", form.filePDF[0], form.filePDF[0].name)

      // Insert product data
      await API.post("/book", formData, config)
      navigate("/list-book")
    } catch (error) {
      console.log(error)
    }
  })

  return (
    <Container className="margin">
      <Form className="mx-5" onSubmit={(e) => handleSubmit.mutate(e)}>
        <h1>Add Book</h1>
        <Form.Group className="mb-3">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            placeholder="Title"
            onChange={handleChange}
            name="title"
          ></Form.Control>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Author</Form.Label>
          <Form.Control
            type="text"
            placeholder="Author"
            onChange={handleChange}
            name="author"
          ></Form.Control>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Publication Date</Form.Label>
          <Form.Control
            type="date"
            placeholder="Publication Date"
            onChange={handleChange}
            name="publication_date"
          ></Form.Control>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Pages</Form.Label>
          <Form.Control
            type="text"
            placeholder="Pages"
            onChange={handleChange}
            name="pages"
          ></Form.Control>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>ISBN</Form.Label>
          <Form.Control
            type="text"
            placeholder="ISBN"
            onChange={handleChange}
            name="isbn"
          ></Form.Control>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Price</Form.Label>
          <Form.Control
            type="text"
            placeholder="Price"
            onChange={handleChange}
            name="price"
          ></Form.Control>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>About this book</Form.Label>
          <Form.Control
            as="textarea"
            placeholder="About This Book"
            rows={3}
            onChange={handleChange}
            name="description"
          ></Form.Control>
        </Form.Group>
        <Form.Group className="mb-3">
          <img
            src={preview}
            style={{
              maxWidth: "150px",
              maxHeight: "150px",
              objectFit: "cover",
            }}
            alt={preview}
          />
          <br />
          <Form.Label>Cover Book</Form.Label>
          <Form.Control type="file" onChange={handleChange} name="image" />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Attach Book File</Form.Label>
          <Form.Control type="file" onChange={handleChange} name="filePDF" />
        </Form.Group>
        <Button type="submit" variant="dark" className="float-end">
          Add Book
        </Button>
      </Form>
    </Container>
  )
}

export default AddBookForm
