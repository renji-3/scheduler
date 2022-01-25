import React, { useState, useEffect } from "react";
import axios from "axios";
import "components/Application.scss";
import DayList from "components/DayList"
import Appointment from "./Appointment";
import { getAppointmentsForDay, getInterview, getInterviewersForDay } from "Helpers/selectors";



export default function Application(props) {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

  const dailyAppointments = getAppointmentsForDay(state, state.day)
  const interviewers = getInterviewersForDay(state, state.day)
  
  const setDay = day => setState(
    { ...state, day }
  );

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

  }

  function removeInterview(id) {
    console.log('delete')
    //needs to somehow use a promise in order to remove booking so promise can be used later
    //why cant it be passed as props like book

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


  function editInterview() {
    console.log('edit')
  }

  const apts = dailyAppointments.map((apt) => {
    const interview = getInterview(state, apt.interview);
    return (
    <Appointment
      key={apt.id}
      id={apt.id}
      time={apt.time}
      interview={interview}
      interviewers={interviewers}
      bookInterview={bookInterview}
      removeInterview={removeInterview}
      editInterview={editInterview}
    />
    );
  });

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

  return (
    <main className="layout">
      <section className="sidebar">
        <img
          className="sidebar--centered"
          src="images/logo.png"
          alt="Interview Scheduler"
        />
        <hr className="sidebar__separator sidebar--centered" />
        <nav className="sidebar__menu">
        <DayList 
            days={state.days} 
            value={state.day} 
            onChange={setDay} 
          />
          </nav>
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />
      </section>
      <section className="schedule">
        {apts}
        <Appointment key="last" time="5pm" />
      </section>
    </main>
  );
}
