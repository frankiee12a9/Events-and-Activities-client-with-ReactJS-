import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { Button, Header, Segment } from "semantic-ui-react";
import { useStore } from "../../../app/stores/store";
import { Link, useParams, useHistory } from "react-router-dom";
import Loading from "../../../app/layout/Loading";
import { v4 as uuid } from "uuid";
import { Formik, Form } from "formik"; // using Formik
import * as Yup from "yup";
import MyTextInput from "../../../app/common/form/MyTextInput";
import MyTextArea from "../../../app/common/form/MyTextArea";
import { categoryOptions } from "../../../app/common/options/categoryOptions";
import MySelectInput from "../../../app/common/form/MySelectInput";
import MyDateInput from "../../../app/common/form/MyDateInput";
import { ActivityFormValues } from "../../../app/models/activity";

function ActivityForm() {
  const { activityStore } = useStore();
  const { updateActivity, createActivity, loadActivity, loadingInitial } =
    activityStore;
  // refer this: https://stackoverflow.com/questions/63660520/typescript-error-after-upgrading-version-4-useparams-from-react-router-dom-pr
  const { id } = useParams<{ id: string }>(); // need to specify type of param(e.g: id: string)
  const [activity, setActivity] = useState<ActivityFormValues>(
    new ActivityFormValues()
  );

  let history = useHistory();

  useEffect(() => {
    if (id)
      loadActivity(id).then((activity) =>
        setActivity(new ActivityFormValues(activity))
      );
  }, [id, loadActivity]);

  function handleFormSubmit(activity: ActivityFormValues) {
    if (!activity.id) {
      let newActivity = {
        ...activity,
        id: uuid(),
      };
      createActivity(newActivity).then(() => {
        history.push(`/activities/${newActivity.id}`); // useHistory
      });
    } else {
      updateActivity(activity).then(() => {
        history.push(`/activities/${activity.id}`);
      });
    }
  }

  // function handleInputChange(
  // 	event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> // handle multiple function type (input text, textArea)
  // ) {
  // 	const { name, value } = event.target
  // 	setActivity({ ...activity, [name]: value }) // value={activity.title}
  // }

  // form validation schema using Yup
  const formFieldsValidation = Yup.object({
    title: Yup.string().required("The activity title is required"),
    description: Yup.string().required("The activity title is required"),
    category: Yup.string().required("The activity title is required"),
    date: Yup.string().required("The activity title is required").nullable(),
    venue: Yup.string().required("The activity title is required"),
  });

  if (loadingInitial) return <Loading content="Loading activity..." />;

  return (
    <Segment clearing>
      <Header content="Activity Details" sub color="teal" />
      <Formik
        validationSchema={formFieldsValidation} // form validation schema
        enableReinitialize
        initialValues={activity}
        onSubmit={(values) => handleFormSubmit(values)}
      >
        {({ handleSubmit, isValid, isSubmitting, dirty }) => (
          <Form className="ui form" onSubmit={handleSubmit} autoComplete="off">
            <MyTextInput name="title" placeholder="Title" />
            <MyTextArea rows={3} name="description" placeholder="Description" />
            <MySelectInput
              options={categoryOptions}
              name="category"
              placeholder="Category"
            />
            <MyDateInput
              // those attributes are from datePicker!
              placeholderText="Date"
              name="date"
              showTimeSelect
              timeCaption="time"
              dateFormat="MMMM d, yyy h:mm aa"
            />
            <Header content="Location Details" sub color="teal" />
            <MyTextInput name="city" placeholder="City" />
            <MyTextInput name="venue" placeholder="Venue" />
            <Button
              disabled={isSubmitting || !isValid || !dirty}
              floated="right"
              positive
              type="submit"
              content="Submit"
              loading={isSubmitting}
            />
            <Button
              as={Link}
              to="/activities"
              floated="right"
              type="button"
              content="Cancel"
            />
          </Form>
        )}
      </Formik>
    </Segment>
  );
}

export default observer(ActivityForm);
