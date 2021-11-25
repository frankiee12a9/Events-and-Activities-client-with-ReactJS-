import React from "react";
import { Container, Header, Segment, Image, Button } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { useStore } from "../../app/stores/store";
import LoginForm from "../users/LoginForm";
import RegisterForm from "../users/RegisterForm";

export default function HomePage() {
  const { userStore, modalStore } = useStore();

  return (
    <Segment inverted textAlign="center" vertical className="masthead">
      <Container text>
        <Header as="h1" inverted>
          <Image
            size="massive"
            src="/assets/logo.png"
            alt="logo"
            style={{ marginBottom: 12 }}
          />
          Reactivities
        </Header>
        <Header as="h2" inverted content="Welcome to Reactivities"></Header>
        {userStore.isLoggedIn ? (
          <Button as={Link} to="/activities" size="huge" inverted>
            Go to activities
          </Button>
        ) : (
          <>
            <Button
              size="huge"
              inverted
              onClick={() => modalStore.openModal(<LoginForm />)}
            >
              Login
            </Button>
            <Button
              size="huge"
              inverted
              onClick={() => modalStore.openModal(<RegisterForm />)}
            >
              Register
            </Button>
          </>
        )}
      </Container>
    </Segment>
  );
}
