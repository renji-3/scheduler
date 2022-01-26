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

  //----------------------------------------------------------------

  function updateSpots(type) {
  
    const currentDayIndex = state.days.findIndex((day) => {
      return day.name === state.day
    })

    const clonedDays = JSON.parse(JSON.stringify(state.days))
    
    if (type === 'bookInterview') {
      clonedDays[currentDayIndex].spots -= 1
    } else if (type === 'removeInterview') { 
      clonedDays[currentDayIndex].spots += 1
    } 

    const newDays = [
      ...state.days,
      clonedDays[currentDayIndex]
    ]

    console.log('before', state.days)

    console.log('after', clonedDays)
    return newDays
  }

  //----------------------------------------------------------------

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
      });
    })

  }

//----------------------------------------------------------------
  
  function removeInterview(id) {

    const appointment = {
      ...state.appointments[id],
      interview: null
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    updateSpots('removeInterview')
    
    return axios.delete(`/api/appointments/${id}`)
    .then(function (response) {
      setState({
        ...state,
        appointments,
      });
    })
  }

  //----------------------------------------------------------------

  const fetchData = () => {
    Promise.all([
      axios.get('http://localhost:8001/api/days'),
      axios.get('http://localhost:8001/api/appointments'),
      axios.get('http://localhost:8001/api/interviewers')
    ]).then((all) => {
      const [first, second, third] = all;
      setState(prev => ({...prev, days: first.data, appointments: second.data, interviewers: third.data}))
    })
  }

  //----------------------------------------------------------------

  useEffect(() => {
    // fetchData should be called on every re-render of state.days
    // state.days gets updated in the `useSpots` function, but because it is just an optimistic clone of state.days it will change the spots first and THEN re-fetch this data once the "newDays" are set in state (after deleting or editing an interview)
    fetchData()
  }, [state.days])

  return {
     state,
     setDay,
     bookInterview,
     removeInterview,
     updateSpots
  };
}