export function getAppointmentsForDay(state, day) {
  if (state.days.length === 0) {
    return []
  }

  const dayObj = state.days.find(item => {
    return item.name === day
  })
  //.find is used for arrays - returns first match only - looking for name to match day parameter
  if (!dayObj) {
    return []
  }
  //if no match return empty array
  const aptIds = dayObj.appointments
  //indidivual objects in days array
  const appointments = Object.values(state.appointments)
  //object values of appointment keys - turns into an array
  const filteredApts = appointments.filter(item => {
    return aptIds.includes(item.id)
  })
  //filtering array for where the aptIds match item.id
  
  return filteredApts
}

export function getInterview (state, interview) {
  
}