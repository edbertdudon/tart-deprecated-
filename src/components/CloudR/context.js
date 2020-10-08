import React from 'react'

const CloudrContext = React.createContext(null)

export const withCloudr = Component => props => (
  <CloudrContext.Consumer>
    {cloudr => <Component {...props} cloudr={cloudr} />}
  </CloudrContext.Consumer>
)

export default CloudrContext
