import React from "react";
import "components/Application.scss";
import DayList from "components/DayList"
import Appointment from "./Appointment";
import { getAppointmentsForDay, getInterview, getInterviewersForDay } from "Helpers/selectors";
import useApplicationData from "Hooks/useApplicationData";
import useVisualMode from "Hooks/useVisualMode";


export default function Application(props) {
  const {
    state,
    setDay,
    bookInterview,
    removeInterview,
  } = useApplicationData();

  const {
    editInterview
  } = useVisualMode()

  const dailyAppointments = getAppointmentsForDay(state, state.day)
  const interviewers = getInterviewersForDay(state, state.day)
  

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
