import React from 'react';
import 'components/Appointment/styles.scss';

import Header from './Header';
import Show from './Show';
import Empty from './Empty';
import Form from './Form';
import Status from './Status';
import useVisualMode from 'Hooks/useVisualMode';
import Error from './Error';
import Confirm from './Confirm';

export default function Appointment(props) {
  const EMPTY = 'EMPTY';
  const SHOW = 'SHOW';
  const CREATE = 'CREATE';
  const CONFIRM = 'CONFIRM'
  const SAVING = 'SAVE'
  const DELETING = 'DELETING'
  const EDIT = 'EDIT'
  const ERROR_SAVE = 'ERROR_SAVE'
  const ERROR_DELETE = 'ERROR_DELETE'


  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  //----------------------------------------------------------------

  function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer
    };
    transition(SAVING, true)
    props.bookInterview(props.id, interview).then(() => {
      transition(SHOW)
    })
    .catch (() => {
      transition(ERROR_SAVE, true)
    })
  }
  //----------------------------------------------------------------

  function deleteInterview() {
   props.removeInterview(props.id, transition(DELETING, true))
   .then(() => {
      transition(EMPTY)
    })
    .catch (() => {
      transition(ERROR_DELETE, true)
    })
  }

  //----------------------------------------------------------------

  // function editInt(name, interviewer) {
  //   const interview = {
  //     student: name,
  //     interviewer
  //   };
  //   props.editInterview(props.id, interview).then(() => {
      
  //   })
  // }

  //----------------------------------------------------------------
   
  return (
    <article className="appointment">
      <Header time={props.time} />
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === SHOW && 
        <Show
          student={props.interview.student}
          interviewer={props.interview.interviewer}
          onDelete={() => transition(CONFIRM)}
          onEdit={() => transition(EDIT)}
        />
      }
      {mode === CREATE && 
          <Form 
          student="" 
          interviewer={null} 
          interviewers={props.interviewers} 
          onSave={save} 
          onCancel={back} 
      />}
      {mode === SAVING && <Status message="Saving"/>}
      {mode === DELETING && <Status message="Deleting"/>}
      {mode === EDIT && 
            <Form 
            student={props.interview.student} 
            interviewer={props.interview.interviewer.id}
            interviewers={props.interviewers} 
            onSave={save} 
            onCancel={back}
      />}
      {mode === ERROR_SAVE && <Error message="Error Saving Appointment" onClose={back} />}
      {mode === ERROR_DELETE && <Error message="Error Deleting Appointment" onClose={back} />}
      {mode === CONFIRM && <Confirm message="Do you want to Delete this Appointment" onCancel={back} onConfirm={deleteInterview} />}
    </article>
  );
}
