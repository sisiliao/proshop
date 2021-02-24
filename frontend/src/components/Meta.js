import React from 'react'
import { Helmet } from 'react-helmet'

const Meta = ({ title, description, keywords }) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name='description' content={description} />
      <meta name='keywords' content={keywords} />
    </Helmet>
  )
}

Meta.defaultProps = {
  title: 'Secret Garden Florist',
  description:
    'We sell the best vase arrangement, flower bouquet and home decor.',
  keywords: 'Flowers, Florist',
}

export default Meta
