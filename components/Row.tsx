import React from 'react'
import { Movie } from "../typings"


interface Props {
    movies: Movie[]
}

function Row({ movies }: Props) {
  return (
    <div>Row</div>
  )
}

export default Row