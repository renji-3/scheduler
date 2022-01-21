import React, { useState, useEffect } from "react";
import axios from "axios";
import "components/Application.scss";
import DayList from "components/DayList"
import Appointment from "./Appointment";
import { getAppointmentsForDay } from "Helpers/selectors";



export default function Application(props) {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {}
  });

  const dailyAppointments = getAppointmentsForDay(state, state.day)
  
  const setDay = day => setState(
    { ...state, day }
  );

  const apts = dailyAppointments.map((apt) => {
    return (
      <Appointment key={apt.id} {...apt} />
    )
  })

  useEffect(() => {
    Promise.all([
      axios.get('http://localhost:8001/api/days'),
      axios.get('http://localhost:8001/api/appointments')
    ]).then((all) => {
      const [first, second] = all;
      setState(prev => ({...prev, days: first.data, appointments: second.data}))
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
