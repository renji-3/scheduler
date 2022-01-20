import React from 'react'
import DayListItem from "components/DayListItem"

export default function DayList (props) {

const dayMap = props.days.map((day) => {
  return(
    <DayListItem
    key={props.id} 
    name={props.name} 
    spots={props.spots} 
    selected={props.name === props.value}
    setDay={props.onChange}
   />)
  })

return(
  <> 
    {dayMap}
  </>

)}
