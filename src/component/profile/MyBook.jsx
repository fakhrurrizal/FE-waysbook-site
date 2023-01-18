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

  const handleDownloadFile = (fileURL) => {
    fetch(fileURL, {
        method: 'GET',
        headers: {
        'Content-Type': 'application/pdf',
        },
    })
    .then((response) => response.blob())
    .then((response) => {
    
    const url = window.URL.createObjectURL(new Blob([response]),);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute(
    'download',
    `FileName.pdf`,
    );

    // Append to html link element page
    document.body.appendChild(link);

    // Start download
    link.click();

    // Clean up and remove the link
    link.parentNode.removeChild(link);
    });
}

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
                        <Button variant="dark" className="w-100 mt-3 mb-4" onClick={() => handleDownloadFile(a.book.filePDF)}>
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
