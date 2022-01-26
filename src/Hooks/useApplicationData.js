import React, { useState, useEffect } from "react";
import axios from "axios";

export default function useApplicationData() {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

  const setDay = day => setState(
    { ...state, day }
  );

  function updateSpots(type) {
  
    const currentDayIndex = state.days.findIndex((day) => {
      return day.name === state.day
    })

    const clonedDays = JSON.parse(JSON.stringify(state.days))

    console.log('before', state.days)

    if (type === 'bookInterview') {
      clonedDays[currentDayIndex].spots -= 1
    } else if 
       (type === 'removeInterview') {
        clonedDays[currentDayIndex].spots += 1
    } else {
        clonedDays[currentDayIndex].spots += 0
    }

    console.log('after', clonedDays)
    return clonedDays
    
  }

  function bookInterview(id, interview) {

    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    return axios.put(`/api/appointments/${id}`, {
      interview
    })
    .then(function (response) {
      setState({
        ...state,
        appointments,
        days: updateSpots('bookInterview')
      });
    })

  }

  function removeInterview(id) {

    const appointment = {
      ...state.appointments[id],
      interview: null
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    
    return axios.delete(`/api/appointments/${id}`)
    .then(function (response) {
      setState({
        ...state,
        appointments,
        days: updateSpots('removeInterview')
      });
    })
  }

  //edit affects counter

  useEffect(() => {
    Promise.all([
      axios.get('http://localhost:8001/api/days'),
      axios.get('http://localhost:8001/api/appointments'),
      axios.get('http://localhost:8001/api/interviewers')
    ]).then((all) => {
      const [first, second, third] = all;
      setState(prev => ({...prev, days: first.data, appointments: second.data, interviewers: third.data}))
    })
  }, [])

  return{state, setDay, bookInterview, removeInterview}



}