import React from "react";
import { Button } from "semantic-ui-react";
import MyTextArea from "../../app/common/form/MyTextArea";
import MyTextInput from "../../app/common/form/MyTextInput";
import { useStore } from "../../app/stores/store";
import { Formik, Form } from "formik"; // using Formik
import * as Yup from "yup";
import { observer } from "mobx-react-lite";

/*To format a selection: Ctrl + K, Ctrl + F
To format a document: Ctrl + K, Ctrl + D*/

interface Props {
  setEditMode: (editMode: boolean) => void;
}

export default observer(function ProfileEditForm({ setEditMode }: Props) {
  const {
    profileStore: { updateProfile, attendeeProfile },
  } = useStore();

  const formFieldsValidation = Yup.object({
    displayName: Yup.string().required("The profile display name is required."),
  });

  // this is reusable form
  return (
    <Formik
      validationSchema={formFieldsValidation}
      enableReinitialize
      initialValues={{
        displayName: attendeeProfile?.displayName,
        bio: attendeeProfile?.bio,
      }}
      onSubmit={(values) => {
        updateProfile(values).then(() => setEditMode(false));
      }}
    >
      {({ isValid, isSubmitting, dirty }) => (
        <Form className="ui form" autoComplete="off">
          <MyTextInput name="displayName" placeholder="Username" />
          <MyTextArea rows={4} name="bio" placeholder="Add your bio" />
          <Button
            disabled={!isValid || !dirty}
            loading={isSubmitting}
            floated="right"
            positive
            type="submit"
            content="Update profile"
          />
        </Form>
      )}
    </Formik>

    // <Tab.Pane>
    //   <Grid>
    //     <Grid.Column width={16}>
    //       <Header
    //         icon="user"
    //         floated="left"
    //         content={profile?.displayName || "Username"}
    //       />
    //       {isCurrentUser && (
    //         <Button
    //           floated="right"
    //           content={editMode ? "Cancel" : "Edit profile"}
    //           onClick={() => setEditMode(!editMode)}
    //         />
    //       )}
    //     </Grid.Column>
    //     <Grid.Column width={16}>
    //       {editMode && (
    //         <Formik
    //           validationSchema={formFieldsValidation} // form validation schema
    //           enableReinitialize
    //           initialValues={profile}
    //           onSubmit={(values) => handleEditProfile(values)}
    //         >
    //           {({ handleSubmit, isValid, isSubmitting, dirty }) => (
    //             <Form
    //               className="ui form"
    //               onSubmit={handleSubmit}
    //               autoComplete="off"
    //             >
    //               <MyTextInput name="displayName" placeholder="Username" />
    //               <MyTextArea rows={4} name="bio" placeholder="Add your bio" />
    //               <Button
    //                 disabled={isSubmitting || !isValid || !dirty}
    //                 floated="right"
    //                 positive
    //                 type="submit"
    //                 content="Submit"
    //               />
    //             </Form>
    //           )}
    //         </Formik>
    //       )}
    //     </Grid.Column>
    //   </Grid>
    // </Tab.Pane>
  );
});
