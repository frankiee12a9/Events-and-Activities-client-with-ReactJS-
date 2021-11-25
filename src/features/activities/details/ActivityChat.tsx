import { observer } from "mobx-react-lite";
import React, { useEffect } from "react";
import { Segment, Header, Comment, Loader } from "semantic-ui-react";
import { useStore } from "../../../app/stores/store";
import { Link } from "react-router-dom";
import CommentStore from "../../../app/stores/commentStore";
import { Formik, Form, Field, FieldProps } from "formik";
import { formatDistanceToNow } from "date-fns"; // format date time
import * as Yup from "yup";

interface Props {
  activityId: string;
}

export default observer(function ActivityChat({ activityId }: Props) {
  const {
    commentStore: { comments, createHubConnection, clearComments, addComment },
  } = useStore();

  useEffect(() => {
    if (activityId) {
      createHubConnection(activityId);
    }
    // todo: read more about cleanup function
    return () => {
      clearComments();
    };
  }, [activityId, CommentStore]); // note: pay attention here

  return (
    <>
      <Segment
        textAlign="center"
        attached="top"
        inverted
        color="teal"
        style={{ border: "none" }}
      >
        <Header>Chat about this event</Header>
      </Segment>
      <Segment clearing>
        <Comment.Group>
          {comments &&
            comments.map((comment) => (
              <Comment key={comment.id}>
                <Comment.Avatar src={comment.image || `/assets/user.png`} />
                <Comment.Content>
                  <Comment.Author
                    as={Link}
                    to={`/profiles/${comment.username}`}
                  >
                    {comment.displayName}
                  </Comment.Author>
                  <Comment.Metadata>
                    <div>{formatDistanceToNow(comment.timestamp)} ago</div>
                  </Comment.Metadata>
                  <Comment.Text style={{ whiteSpace: "pre-wrap" }}>
                    {comment.body}
                  </Comment.Text>
                  {/* <Comment.Actions>
                    <Comment.Action>Reply</Comment.Action>
                  </Comment.Actions> */}
                </Comment.Content>
              </Comment>
            ))}

          <Formik
            onSubmit={(values, { resetForm }) =>
              addComment(values).then(() => resetForm())
            }
            initialValues={{ body: "" }}
            validationSchema={Yup.object({
              body: Yup.string().required(),
            })}
          >
            {({ isSubmitting, isValid, handleSubmit }) => (
              <Form className="ui form">
                <Field name="body">
                  {(props: FieldProps) => (
                    <div style={{ position: "relative" }}>
                      <Loader active={isSubmitting} />
                      <textarea
                        rows={2}
                        placeholder="Enter your comment (Enter to submit, SHIFT + enter for new line.)"
                        {...props.field}
                        onKeyPress={(e) => {
                          if (e.key === "Enter" && e.shiftKey) {
                            return;
                          }
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            isValid && handleSubmit();
                          }
                        }}
                      />
                    </div>
                  )}
                </Field>
              </Form>
            )}
          </Formik>
        </Comment.Group>
      </Segment>
    </>
  );
});
