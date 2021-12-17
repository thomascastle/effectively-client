import { useAuth } from "./context/auth";
import { gql, useMutation } from "@apollo/client";
import { MarkGithubIcon } from "@primer/octicons-react";
import {
  Box,
  ButtonPrimary,
  FormGroup,
  Heading,
  Link,
  StyledOcticon,
  Text,
  TextInput,
} from "@primer/react";
import * as React from "react";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
  useHistory,
} from "react-router-dom";

const LOGIN_MUTATION = gql`
  mutation LogIn($loginInput: LogInInput) {
    login(input: $loginInput) {
      token
    }
  }
`;

const SIGNUP_MUTATION = gql`
  mutation SignUp($input: SignUpInput) {
    signup(input: $input) {
      token
    }
  }
`;

export function UnrestrictedPart() {
  return (
    <Router>
      <Switch>
        <Route path="/login" component={LogIn} />
        <Route path="/signup" component={SignUp} />
        <Route path="/">
          <Redirect to="/login" />
        </Route>
      </Switch>
    </Router>
  );
}

function LogIn() {
  const { updateToken } = useAuth();
  const history = useHistory();
  const [formData, setFormData] = React.useState({
    email: "",
    password: "",
  });

  const [login, { client }] = useMutation(LOGIN_MUTATION, {
    onCompleted: ({ login }) => {
      localStorage.setItem("token", login.token);
      updateToken(login.token);

      client.clearStore();

      history.push("/");
    },
    variables: {
      loginInput: {
        email: formData.email,
        password: formData.password,
      },
    },
  });

  const handleFormSubmitted = async (e) => {
    e.preventDefault();

    localStorage.removeItem("token");

    await login();
  };

  return (
    <>
      <Box sx={{ position: "relative" }}>
        <Box
          sx={{
            backgroundColor: "transparent",
            borderBottom: 0,
            pb: 4,
            pt: 5,
            width: "100%",
          }}
        >
          <Box sx={{ mx: "auto", textAlign: "center", width: "100%" }}>
            <Link href="/" sx={{ color: "fg.default" }}>
              <StyledOcticon icon={MarkGithubIcon} size={48} />
            </Link>
          </Box>
        </Box>
      </Box>
      <main>
        <Box sx={{ mx: "auto", my: 0, px: 3, width: 340 }}>
          <Box
            sx={{
              backgroundColor: "transparent",
              border: 0,
              color: "fg.default",
              m: 0,
              mb: 15,
              p: 0,
              textAlign: "center",
              textShadow: "none",
            }}
          >
            <Heading
              as="h1"
              sx={{ fontSize: 24, fontWeight: 300, letterSpacing: "-0.5px" }}
            >
              Sign in to GitHub
            </Heading>
          </Box>
          <Box
            sx={{
              backgroundColor: "canvas.subtle",
              borderRadius: 6,
              borderColor: "border.muted",
              borderStyle: "solid",
              borderWidth: 1,
              fontSize: 14,
              mt: 3,
              p: 20,
            }}
          >
            <form method="post" onSubmit={handleFormSubmitted}>
              <FormGroup sx={{ mt: 0 }}>
                <FormGroup.Label>E-mail address</FormGroup.Label>
                <TextInput
                  autoFocus
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                  }}
                  sx={{ width: "100%" }}
                  type="email"
                  value={formData.email}
                />
              </FormGroup>
              <FormGroup sx={{ mb: 0 }}>
                <FormGroup.Label>Password</FormGroup.Label>
                <TextInput
                  onChange={(e) => {
                    setFormData({ ...formData, password: e.target.value });
                  }}
                  sx={{ width: "100%" }}
                  type="password"
                  value={formData.password}
                />
              </FormGroup>
              <ButtonPrimary sx={{ mt: 20, width: "100%" }} type="submit">
                Sign in
              </ButtonPrimary>
            </form>
          </Box>
          <Text
            as="p"
            sx={{
              borderColor: "border.default",
              borderRadius: 6,
              borderStyle: "solid",
              borderWidth: "1px",
              mt: 3,
              px: 20,
              py: 15,
              textAlign: "center",
            }}
          >
            New to GitHub? <Link href="/signup">Create an account.</Link>
          </Text>
        </Box>
      </main>
    </>
  );
}

function SignUp() {
  const { updateToken } = useAuth();
  const history = useHistory();
  const [formData, setFormData] = React.useState({
    email: "",
    password: "",
    username: "",
  });

  const [signup, { client }] = useMutation(SIGNUP_MUTATION, {
    onCompleted: ({ signup }) => {
      localStorage.setItem("token", signup.token);
      updateToken(signup.token);

      client.clearStore();

      history.push("/");
    },
    variables: {
      input: {
        email: formData.email,
        password: formData.password,
        username: formData.username,
      },
    },
  });

  const handleFormSubmitted = async (e) => {
    e.preventDefault();

    await signup();
  };

  return (
    <>
      <Box sx={{ position: "relative" }}>
        <Box
          sx={{
            backgroundColor: "transparent",
            borderBottom: 0,
            pb: 4,
            pt: 5,
            width: "100%",
          }}
        >
          <Box sx={{ mx: "auto", textAlign: "center", width: "100%" }}>
            <Link href="/" sx={{ color: "fg.default" }}>
              <StyledOcticon icon={MarkGithubIcon} size={48} />
            </Link>
          </Box>
        </Box>
      </Box>
      <main>
        <Box sx={{ mx: "auto", my: 0, px: 3, width: 340 }}>
          <Box
            sx={{
              backgroundColor: "transparent",
              border: 0,
              color: "fg.default",
              m: 0,
              mb: 15,
              p: 0,
              textShadow: "none",
            }}
          >
            <Heading as="h1" sx={{ fontSize: 24, fontWeight: 300 }}>
              Welcome to GitHub!
              <br />
              Let's begin the adventure
            </Heading>
          </Box>
          <Box
            sx={{
              backgroundColor: "canvas.subtle",
              borderRadius: 6,
              borderColor: "border.muted",
              borderStyle: "solid",
              borderWidth: 1,
              fontSize: 14,
              mt: 3,
              p: 20,
            }}
          >
            <form method="post" onSubmit={handleFormSubmitted}>
              <FormGroup sx={{ mt: 0 }}>
                <FormGroup.Label>E-mail address</FormGroup.Label>
                <TextInput
                  autoFocus
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                  }}
                  sx={{ width: "100%" }}
                  type="email"
                  value={formData.email}
                />
              </FormGroup>
              <FormGroup>
                <FormGroup.Label>Password</FormGroup.Label>
                <TextInput
                  onChange={(e) => {
                    setFormData({ ...formData, password: e.target.value });
                  }}
                  sx={{ width: "100%" }}
                  type="password"
                  value={formData.password}
                />
              </FormGroup>
              <FormGroup sx={{ mb: 0 }}>
                <FormGroup.Label>Username</FormGroup.Label>
                <TextInput
                  onChange={(e) => {
                    setFormData({ ...formData, username: e.target.value });
                  }}
                  sx={{ width: "100%" }}
                  type="text"
                  value={formData.username}
                />
              </FormGroup>
              <ButtonPrimary sx={{ mt: 20, width: "100%" }} type="submit">
                Create account
              </ButtonPrimary>
            </form>
          </Box>
          <Text
            as="p"
            sx={{
              borderColor: "border.default",
              borderRadius: 6,
              borderStyle: "solid",
              borderWidth: "1px",
              mt: 3,
              px: 20,
              py: 15,
              textAlign: "center",
            }}
          >
            Already have an account? <Link href="/login">Sign in →</Link>
          </Text>
        </Box>
      </main>
    </>
  );
}
