import React from 'react'
import { Card } from 'react-bootstrap'
import Rating from './Rating'
import { Link } from 'react-router-dom'

const Product = ({ product }) => {
  return (
    <Card className='my-3 p-3 rounded card-animation'>
      <Link to={`/product/${product._id}`}>
        <Card.Img className='card-img' src={product.image} variant='top' />

        <Card.Body>
          <Link to={`/product/${product._id}`}>
            <Card.Title as='div'>
              <strong>{product.name}</strong>
            </Card.Title>
          </Link>
          <Card.Text as='div'>
            <Rating value={product.rating} text={`${product.numReviews}`} />
          </Card.Text>
          <Card.Text as='h3'> ${product.price}</Card.Text>
        </Card.Body>
      </Link>
    </Card>
  )
}

export default Product
