import {
  EmailOutlined,
  LockOutlined,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Divider,
  IconButton,
  InputAdornment,
  Paper,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";

import { LoadingButton } from "@mui/lab";
import Loader from "../../components/Loader";
import { useAuth } from "../../auth/AuthContext";
import { useLocation, useNavigate } from "react-router";
import { useState } from "react";
import { Formik } from "formik";
import * as yup from "yup";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const [values, setValues] = useState({ email: "", password: "" });
  const [showPwd, setShowPwd] = useState(false);
  const [toast, setToast] = useState({ open: false, msg: "", type: "error" });

  const handleFormSubmit = async (values) => {
    try {
      await login({
        username: values.email,
        password: values.password,
      });

      setToast({ open: true, msg: "Login succeeded.", type: "success" });
      await new Promise((res) => setTimeout(res, 1000));
      navigate(from, { replace: true });
    } catch (e) {
      const message = e.response?.data?.message || "Unknown error occurred.";
      setToast({ open: true, msg: message, type: "error" });
    }

    // // console.log("hello" + data);
    // try {
    // } catch (err) {
    //   // console.log("nuur", err);
    // }
  };
  return (
    <Formik
      onSubmit={handleFormSubmit}
      initialValues={initialValues}
      validationSchema={checkoutSchema}
    >
      {({
        values,
        errors,
        touched,
        handleSubmit,
        handleChange,
        isSubmitting,
      }) => (
        <Box
          sx={{
            minHeight: "100vh",
            display: "grid",
            placeItems: "center",
            p: 2,
            // subtle gradient background
            background:
              "radial-gradient(1200px 600px at 10% -20%, rgba(99,102,241,.25) 0, transparent 60%), radial-gradient(1200px 600px at 110% 120%, rgba(16,185,129,.25) 0, transparent 60%)",
          }}
        >
          {isSubmitting && <Loader />}
          <Paper
            elevation={10}
            sx={{
              width: "100%",
              maxWidth: 420,
              borderRadius: 4,
              overflow: "hidden",
              backdropFilter: "blur(6px)",
            }}
          >
            {/* Top bar with back */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
                justifyContent: "center",
                pl: 4,
                pr: 4,
                pt: 2,
                pb: 2,
                bgcolor: "background.paper",
                borderBottom: (t) => `1px solid ${t.palette.divider}`,
              }}
            >
              <Box sx={{ p: 3, textAlign: "center" }}>
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    mx: "auto",
                    borderRadius: "50%",
                    display: "grid",
                    placeItems: "center",
                    mb: 1.5,
                    bgcolor: (t) =>
                      t.palette.mode === "dark"
                        ? "rgba(99,102,241,0.2)"
                        : "rgba(99,102,241,0.1)",
                  }}
                >
                  <LockOutlined fontSize="medium" />
                </Box>
                <Typography variant="h4" fontWeight={700}>
                  Welcome back!
                </Typography>
                <Typography variant="body4" color="text.secondary">
                  Please sign in to continue
                </Typography>
              </Box>
              <Divider />

              <form
                width="100%"
                m="0px 30px"
                component="form"
                onSubmit={handleSubmit}
              >
                <TextField
                  fullWidth
                  label="Username"
                  name="email"
                  type="text"
                  autoComplete="off"
                  margin="normal"
                  value={values.email}
                  onChange={handleChange}
                  error={!!touched.email && !!errors.email}
                  helperText={touched.email && errors.email}
                  autoFocus
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <EmailOutlined />
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  fullWidth
                  label="Password"
                  name="password"
                  type={showPwd ? "text" : "password"}
                  value={values.password}
                  onChange={handleChange}
                  autoComplete="off"
                  error={!!touched.password && !!errors.password}
                  helperText={touched.password && errors.password}
                  margin="normal"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          edge="end"
                          onClick={() => setShowPwd((s) => !s)}
                          aria-label={
                            showPwd ? "Hide password" : "Show password"
                          }
                        >
                          {showPwd ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                {/* Submit */}
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 2.5, py: 1.2, fontWeight: 600 }}
                >
                  Sign in
                </Button>
              </form>
            </Box>
          </Paper>

          {/* Snack bar */}
          <Snackbar
            open={toast.open}
            autoHideDuration={5000}
            onClose={() => setToast({ ...toast, open: false })}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
          >
            <Alert
              severity={toast.type}
              variant="filled"
              onClose={() => setToast({ ...toast, open: false })}
              sx={{ fontSize: "1.2rem" }} // 👈 change size here
            >
              {toast.msg}
            </Alert>
          </Snackbar>
        </Box>
      )}
    </Formik>
  );
};

const checkoutSchema = yup.object().shape({
  email: yup.string().required("required"),
  password: yup.string().required("required"),
});

const initialValues = {
  email: "",
  password: "",
};
export default Login;
