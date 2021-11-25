import { ErrorMessage, Form, Formik } from 'formik'
import { observer } from 'mobx-react-lite'
import React from 'react'
import { Button, Header,  Segment } from 'semantic-ui-react'
import MyTextInput from '../../app/common/form/MyTextInput'
import { useStore } from "../../app/stores/store"
import * as Yup from 'yup'
import ValidationError from '../error/ValidationError'

export default observer(function RegisterForm() {
   const { userStore } = useStore() // whenever use useStore, observer() is needed as well

   // form fields validated schema   
	const formFieldsValidation = Yup.object({
		displayName: Yup.string().required(),
		userName: Yup.string().required(),
		email: Yup.string().required().email(),
		password: Yup.string().required(),
	})

   return (
      <Segment clearing>
         <Formik
            initialValues={{ displayName: "", userName: "", email: "", password: "", error: null }}
            // those are from Formik
            onSubmit={(values, { setErrors }) => userStore.register(values).catch(error =>
               setErrors({error}))}
            validationSchema={formFieldsValidation}
         >
            {/* those are from Formik as well */}
            {({ handleSubmit, isSubmitting, errors, isValid, dirty}) => (
               // in className `error` must be included, if not <ValidationError /> will not be occured
               <Form className="ui form error" onSubmit={handleSubmit} autoComplete="off">
                  <Header as="h2" content="Register" textAlign="center" color="teal" />
                  <MyTextInput name="displayName" placeholder="Display Name" />
                  <MyTextInput name="userName" placeholder="User Name" />
                  <MyTextInput name="email" placeholder="Email" />
                  <MyTextInput name="password" placeholder="Password" type="password" />
                  <ErrorMessage
                     name="error"
                     render={() => <ValidationError errors={errors.error} />} // validationError goes here 
                  />
                  <Button
                     disabled={!isValid || !dirty || isSubmitting}
                     loading={isSubmitting} positive
                     content="Submit"
                     type="submit" fluid />
               </Form>
            )}
         </Formik>
      </Segment>
   )
})