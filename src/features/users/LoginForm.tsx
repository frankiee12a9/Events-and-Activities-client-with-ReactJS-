import { ErrorMessage, Form, Formik } from 'formik'
import { observer } from 'mobx-react-lite'
import React from 'react'
import { Button, Header, Label, Segment } from 'semantic-ui-react'
import MyTextInput from '../../app/common/form/MyTextInput'
import { useStore } from "../../app/stores/store"


export default observer(function LoginForm() {
   const { userStore } = useStore() // whenever use useStore, observer() is needed as well

   return (
      <Segment clearing>
         <Formik
            initialValues={{ email: "", password: "", error: null }}
            // those are from Formik
            onSubmit={(values, { setErrors }) => userStore.login(values).catch(err =>
               setErrors({ error: "Invalid email or password" }))}
         >
            {/* those are from Formik as well */}
            {({ handleSubmit, isSubmitting, errors }) => (
               <Form className="ui form" onSubmit={handleSubmit} autoComplete="off">
                  <Header as="h2" content="Login" textAlign="center" color="teal" />
                  <MyTextInput name="email" placeholder="Email" />
                  <MyTextInput name="password" placeholder="Password" type="password" />
                  <ErrorMessage
                     name="error"
                     render={() => <Label basic color="red" content={errors.error} style={{ marBottom: 10 }} />}
                  />
                  <Button loading={isSubmitting} positive content="Login" type="submit" fluid />
               </Form>
            )}
         </Formik>
      </Segment>
   )
})