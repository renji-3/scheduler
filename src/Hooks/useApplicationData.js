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

  function weekPick(id) {
    if (id < 6) {
      return 0
    }
    if (id < 11) {
      return 1
    }
    if (id < 16) {
      return 2
    }
    if (id < 21) {
      return 3
    }
    if (id < 25) {
      return 4
    }
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
        appointments
      });
    })
    .then(function (response) {
      let clone = [...state.days]
      // console.log (state.days[weekPick(id)].spots - 1)
      console.log(clone[weekPick(id)].spots - 1)
    }
    )

    //clone days
    //update spots
    //setstate with prev and only update days

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
        appointments
      });
    })

  }

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