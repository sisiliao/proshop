import React from 'react'
import { Carousel, Image } from 'react-bootstrap'

const ProductCarousel = () => {
  // const dispatch = useDispatch()

  // const productTopRated = useSelector((state) => state.productTopRated)
  // const { loading, error, products } = productTopRated

  // useEffect(() => {
  //   dispatch(listTopProducts())
  // }, [dispatch])

  const pics = [
    '/images/carousel/carousel1.jpg',
    '/images/carousel/carousel2.jpg',
    '/images/carousel/carousel3.jpg',
  ]

  return (
    <Carousel pause='hover' className='bg-dark'>
      {pics.map((pic, ind) => (
        <Carousel.Item key={ind}>
          <Image src={pic} alt={pic} fluid />
          <Carousel.Caption className='carousel-caption'></Carousel.Caption>
        </Carousel.Item>
      ))}
    </Carousel>
  )
}

export default ProductCarousel
