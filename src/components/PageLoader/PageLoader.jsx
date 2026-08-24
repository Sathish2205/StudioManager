import React from 'react'
import './PageLoader.css'

export default function PageLoader() {
  return (
    <div className="page-loader">
      <div className="page-loader__dots">
        <span className="page-loader__dot" />
        <span className="page-loader__dot" />
        <span className="page-loader__dot" />
      </div>
    </div>
  )
}
