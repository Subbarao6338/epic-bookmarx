import React from 'react'

import { Link, Route, Routes } from 'react-router-dom'
import QueryMetrics from './QueryMetrics'
import AionModel from './AionModel'
import PredictiveModel from './PredictiveModel'

function View() {
  return (
    <Routes>
      <Route index element={<PageRouter />} />
      <Route path="/0" element={<QueryMetrics />} />
      <Route path="/1" element={<AionModel />} />
      <Route path="/2" element={<PredictiveModel />} />
    </Routes>
  )
}

export default View

function PageRouter() {
  const images = require.context('../../assets', true)

  return (
    <div className="row m-2 p-2">
      {cards.map((value) => (
        <div key={value.id} className="col-4">
          <Link
            to={value.link}
            style={{ textDecoration: 'none', color: 'black' }}
          >
            <div
              className="bg-light p-3 h-100 text-center border  mx-auto"
              style={{ maxWidth: 320, maxHeight: 250, borderRadius: 16 }}
            >
              <img
                src={images('./' + value.img_src)}
                alt={value.img_alt}
                width={80}
                height={80}
                style={{ objectFit: 'contain' }}
                className="mb-3"
              />
              <h6>
                <b>{value.heading}</b>
              </h6>
              <p>{value.description}</p>
            </div>
          </Link>
        </div>
      ))}
    </div>
  )
}

const cards = [
  {
    id: 0,
    img_src: 'database.png',
    img_alt: 'database',
    heading: 'Data Explorer',
    description: 'Query and export metrics data',
    link: '/view/0',
  },
  {
    id: 1,
    img_src: 'aion.png',
    img_alt: 'aion',
    heading: "HCL's AION",
    description:
      'An AI lifecycle management platform for applying machine learning to real world problems',
    link: '/view/#',
  },
  {
    id: 2,
    img_src: 'monitoring.png',
    img_alt: 'predictive monitoring',
    heading: 'Predictive Model',
    description:
      'Predictive model from historical metrics to get foresight about failure, alerts, etc..',
    link: '/view/#',
  },
]
