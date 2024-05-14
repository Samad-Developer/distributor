import React from 'react'
import { useSelector } from 'react-redux'
const Country = () => {
  const locationData = useSelector((state) => state.location.locationData)
  console.log('oooh my god here from screen country getting from redux', locationData)
  return (
    <div>Country</div>
  )
}

export default Country