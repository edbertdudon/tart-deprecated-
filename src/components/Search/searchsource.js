import React from 'react'
import Icon from '@mdi/react';
import { mdilFile } from '@mdi/light-js'

const SearchSource = ({ filename }) => {
  return (
      <div className='datasource-thumbnail'>
      	<div className='datasource-icon'>
      	  <Icon path={mdilFile} size={5}/>
        </div>
        <div className='datasource-editabletext'>{filename.replace(/\.[^/.]+$/, "")}</div>
	    </div>
  )
}

export default SearchSource
