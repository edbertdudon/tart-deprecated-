import React from 'react'

const Context = React.createContext({
  rename: false,
  setRename: () => {},
  inputRef: null
})

export default Context
