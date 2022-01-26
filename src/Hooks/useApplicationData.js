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

    const currentDay = state.days[currentDayIndex]

    const clonedDays = JSON.parse(JSON.stringify(state.days))
    let currentDayOldSpots = 0;

    if (type === 'bookInterview') {
      currentDayOldSpots--
      clonedDays[currentDayIndex].spots -= 1
    } else if 
       (type === 'removeInterview') {
        currentDayOldSpots++
        clonedDays[currentDayIndex].spots += 1
    } 

    const testDays = {
      ...state,
      days: {
        ...state.days,
        [currentDay]: {
          ...state.days[currentDayIndex],
          spots: currentDayOldSpots
        }
      }
    }
    console.log('LOOK HERE ==>', {testDays, currentDay, clonedDays})

    console.log('before', state.days)

    // if (type === 'bookInterview') {
    //   clonedDays[currentDayIndex].spots -= 1
    // } else if 
    //    (type === 'removeInterview') {
    //     clonedDays[currentDayIndex].spots += 1
    // } 


    //else {
    //     clonedDays[currentDayIndex].spots += 0
    // }

    console.log('after', clonedDays)
    return clonedDays
    
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
    const clonedDays =  updateSpots('bookInterview')
    console.log({clonedDays, stateDays: state.days});

    return axios.put(`/api/appointments/${id}`, {
      interview
    })
    .then(function (response) {
      setState({
        ...state,
        appointments,
        days: clonedDays
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
    
    return axios.delete(`/api/appointments/${id}`)
    .then(function (response) {
      setState({
        ...state,
        appointments,
        days: updateSpots('removeInterview')
      });
    })
  }

  //----------------------------------------------------------------

  //thinking of doing an editInterview function that exists just to make sure updateSpots isnt called
  //changing the updateSpots parameter to anything but book or remove causes it to not effect spots
  //this idea SHOULD work

  // function editInterview (id, interview) {
  //   const appointment = {
  //     ...state.appointments[id],
  //     interview: { ...interview }
  //   };

  //   const appointments = {
  //     ...state.appointments,
  //     [id]: appointment
  //   };

  //   const newDays = updateSpots();
  //   console.log({newDays})
  //   return axios.put(`/api/appointments/${id}`, {
  //     interview
  //   })
  //   .then(function (response) {
  //     setState({
  //       ...state,
  //       appointments,
  //       days: newDays
  //     });
  //   })
  // }

  //----------------------------------------------------------------

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

  return {
     state,
     setDay,
     bookInterview,
     removeInterview,
    //  editInterview,
     updateSpots
  };
}