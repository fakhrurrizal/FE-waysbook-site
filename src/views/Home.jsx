import React from "react"
import Hero from "../component/home/Hero"
import HighlightBook from "../component/home/HighlightBook"
import ListBook from "../component/home/ListBook"

const Home = () => {
  return (
    <div className="mb-5">
      <Hero />
      <HighlightBook />
      <ListBook />
    </div>
  )
}

export default Home
