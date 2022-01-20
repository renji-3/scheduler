import React from 'react'
import "components/Appointment/styles.scss"

export default function Appointment(props) {

  const aptTime = function() {
    let fb = 'No Apts'
    if (props.time) {
      fb = 'Appointment at ' + (props.time)
    }
      return fb
  }

  return (
    <article className="appointment">{aptTime()}</article>
  )

}
