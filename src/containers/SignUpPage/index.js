import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Typography,
  Grid,
  useMediaQuery,
  IconButton,
  InputBase,
  InputAdornment,
} from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { signup } from "../../store/authSlice";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import NextButton from "../../components/NextButton";
import signUpLogo from "../../assets/signUpLogo.png";
import signUpLogoDesktop from "../../assets/signUpLogoDesktop.png";
import { checkIfUserExists } from "../../utils/auth";
import NavigationBar from "../../components/NavigationBar";

const useStyles = makeStyles((theme) => ({
  container: {
    alignItems: "center",
  },
  title: {
    fontWeight: "bold",
    lineHeight: 1,
    fontSize: 50,
    textAlign: "center",
    paddingTop: 25,
    "@media (max-width:480px)": {
      fontSize: 35,
      paddingTop: 0,
      marginTop: "5vh",
    },
  },
  description: {
    fontSize: 25,
    textAlign: "center",
    margin: 0,
    paddingTop: "2vh",
    color: "#838181",
    "@media (max-width:480px)": {
      fontSize: 20,
      paddingTop: "2vh",
    },
  },
  button: {
    width: 95,
    height: 77,
    backgroundColor: "#3C79B0",
    color: "#FFFFFF",
    borderRadius: "15px",
    alignSelf: "flex-end",
    "&:hover": {
      backgroundColor: "#3C79B0",
    },
    "@media (max-width:480px)": {
      width: 45,
      height: 36,
      minWidth: 45,
      padding: "6px 6px",
    },
  },
  inputForm: {
    width: "auto",
    padding: "15vh 15vw 0vh",
    "@media (max-width:480px)": {
      padding: "2vh 15vw 0vh",
    },
  },
  errorMessage: {
    color: "#FF0000",
    fontSize: 14,
    textAlign: "end",
  },
  inputLabel: {
    color: "#838181",
    textAlign: "left",
    fontSize: 14,
    marginTop: 18,
  },
  input: {
    backgroundColor: "#EAEAEA",
    padding: "12px 12px",
    marginBottom: 18,
    minWidth: 216,
  },
  loginLogo: {
    position: "absolute",
    bottom: 0,
    right: "5vw",
    height: "90vh",
    zIndex: -1,
    "@media (max-width:480px)": {
      position: "absolute",
      bottom: 0,
      right: "auto",
      height: "35vh",
      zIndex: -1,
    },
  },
}));

function SignUpPage() {
  const classes = useStyles();
  const history = useHistory();
  const isMobile = useMediaQuery("(max-width:480px)");
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.userUID);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [accountCreated, setAccountCreated] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const emailRegex = /.+@.*ust.hk$/gm;
  const passwordRegex = /^.{8,}$/gm;

  const handleClick = () => {
    if (!emailRegex.test(email)) {
      setEmail("");
      setEmailError("Please use ITSC account eg. xxxxxxxx@connect.ust.hk");
    } else {
      setEmailError("");
    }
    if (!passwordRegex.test(password)) {
      setPassword("");
      setPasswordError(true);
    } else {
      setPasswordError(false);
    }
    if (email && password && !(emailError.length > 0) && !passwordError) {
      checkIfUserExists(email).then((res) => {
        if (res) {
          setEmailError("Account already created");
        } else {
          dispatch(signup({ email: email.trim(), password: password.trim() }));
        }
      });
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      setAccountCreated(true);
      history.push("/interests");
    }
  }, [isLoggedIn, dispatch]);

  return (
    <Grid container direction='column'>
      <NavigationBar showMenu />
      <Grid
        container
        className={classes.container}
        direction={isMobile ? "column" : "row"}
        alignItems='center'
      >
        <Grid container item className={classes.inputForm} direction='column'>
          <b className={classes.title}>
            <span
              style={{
                boxShadow: "inset 0 -13px 0 0 #FFD7D7",
              }}
            >
              Let’s get
            </span>{" "}
            started!
          </b>
          <Typography className={classes.description}>
            No request is too extreme
          </Typography>
          <Typography className={classes.inputLabel}>
            Full ITSC Email address
          </Typography>
          <InputBase
            className={classes.input}
            autoComplete='email'
            autoFocus
            inputProps={{ autoCapitalize: "none" }}
            onChange={(e) => setEmail(e.target.value)}
          ></InputBase>
          <Typography className={classes.inputLabel}>
            Your secret word
          </Typography>
          <InputBase
            className={classes.input}
            type={showPassword ? "text" : "password"}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete='new-password'
            endAdornment={
              <InputAdornment position='end'>
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge='end'
                >
                  {showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            }
          ></InputBase>
          {passwordError && (
            <Typography className={classes.errorMessage}>
              Secret word is too short😳 Use {">"}= 8 characters
            </Typography>
          )}
          {emailError && (
            <Typography className={classes.errorMessage}>
              {emailError}
            </Typography>
          )}
          <NextButton onClick={() => handleClick()} style={{ padding: 0 }} />
        </Grid>
        <img
          alt=''
          src={isMobile ? signUpLogo : signUpLogoDesktop}
          className={classes.loginLogo}
        />
      </Grid>
    </Grid>
  );
}

export default SignUpPage;
