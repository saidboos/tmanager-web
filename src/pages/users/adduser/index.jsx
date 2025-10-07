import {
  Alert,
  Box,
  Button,
  CircularProgress,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  TextField,
} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../../components/Header";
import { useEffect, useState } from "react";
import {
  ArrowBack,
  Email,
  Person,
  Person2,
  Phone,
  Security,
} from "@mui/icons-material";
import { api, callInitAPI } from "../../../api/client";
import { useNavigate } from "react-router-dom";
import { clearInitData, INIT_KEY } from "../../../auth/AuthContext";
import { capitalizeFirstLetter } from "../../../utils/stringUtils";

const AddUser = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const navigate = useNavigate();
  const [titles, setTitles] = useState([]);
  const [roles, setRoles] = useState([]);

  const [toast, setToast] = useState({
    open: false,
    msg: "",
    type: "success", // or "error"
  });

  useEffect(() => {
    const cachedInit = localStorage.getItem(INIT_KEY);
    if (cachedInit) {
      const init = JSON.parse(cachedInit);
      console.log("Loaded init data from cache inside users page", init.mData);
      setTitles(init.mData.titles || []);
      setRoles(init.mData.roles || []);
    } else {
      // optional fallback if needed (e.g. token expired)
      console.log("No init data, please log in again");
    }
  }, []); // run once on mount

  const handleFormSubmit = async (values, { setSubmitting }) => {
    try {
      const numTitleId = Number(values.titleId); // convert to number
      const numRoleId = Number(values.roleId); // convert to number
      //Payload
      const payload = {
        firstName: values.firstName,
        lastName: values.lastName,
        username: values.username,
        phoneNumber: values.contact,
        password: "test@123",
        titleId: numTitleId,
        roleId: numRoleId,
      };

      console.log(payload);
      await new Promise((res) => setTimeout(res, 1000));
      await api.post("/api/auth/register", payload);

      console.log("✅ Submitted:", values);

      setToast({ open: true, msg: "Registration succeeded", type: "success" });

      clearInitData(); // clear cached init data to force refetch

      // call init API to save fresh data
      await callInitAPI();
      await new Promise((res) => setTimeout(res, 1000));

      navigate(getRoute(), { state: { refreshAt: new Date().getTime() } });
    } catch (e) {
      const fieldErrors = e.response?.data?.fieldErrors;
      var message = e.response?.data?.message || "Registration failed";
      if (fieldErrors != null) {
        const firstKey = Object.keys(fieldErrors)[0];
        const firstValue = Object.values(fieldErrors)[0];
        message =
          e.response?.data?.message + ": " + firstKey + " " + firstValue ||
          "Registration failed";
      }

      console.error(e);

      setToast({ open: true, msg: message, type: "error" });
    } finally {
      setSubmitting(true); // hides the loader
    }
  };

  const getRoute = () => {
    // Check if there’s any history
    var route;
    if (window.history.state && window.history.state.idx > 0) {
      route = -1; // Go back in history
    } else {
      route = "/team"; // Default route
    }
    return route;
  };

  return (
    <Box m="0px 20px">
      <Box display="flex" alignItems="start">
        <IconButton color="primary" onClick={() => navigate(getRoute())}>
          <ArrowBack />
        </IconButton>
        <Header title="Add new user" />
      </Box>

      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        validationSchema={checkoutSchema}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
          isSubmitting,
        }) => (
          <form onSubmit={handleSubmit}>
            {/* Full-screen overlay loader */}
            {isSubmitting && (
              <Box
                sx={{
                  position: "fixed",
                  inset: 0,
                  backgroundColor: "rgba(0,0,0,0.5)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 1300, // above everything
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center", // centers horizontally
                    justifyContent: "center", // centers vertically if parent has height
                  }}
                >
                  {/* <CircularProgress size={64} sx={{ color: "white" }} /> */}
                  <Box
                    sx={{
                      position: "relative",
                      display: "inline-flex", // keep both stacked inline
                    }}
                  >
                    <CircularProgress
                      size={80}
                      sx={{ color: "white" }}
                      thickness={1}
                    />

                    {/* Image inside the circle */}
                    <Box
                      component="img"
                      src="../../assets/tawakal_logo.jpeg" // your image path
                      alt="Loading"
                      sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: 70, // adjust size to fit inside
                        height: 70,
                        borderRadius: "50%", // makes it circular
                      }}
                    />
                  </Box>
                  <br />
                  <Box
                    sx={{
                      fontSize: "1.2rem",
                      fontWeight: 500,
                      color: "white",
                      fontWeight: "bold",
                    }}
                  >
                    Please wait...
                  </Box>
                </Box>
              </Box>
            )}

            <Box
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
              }}
            >
              <Box sx={{ gridColumn: "span 2" }}>
                <FormControl fullWidth>
                  <InputLabel id="role-label">Select Role</InputLabel>
                  <Select
                    label="Select Role"
                    value={values.roleId}
                    onChange={handleChange}
                    name="roleId"
                    error={!!touched.roleId && !!errors.roleId}
                  >
                    {(roles || []).map((role) => (
                      <MenuItem key={role.id} value={role.id}>
                        {capitalizeFirstLetter(role.name)}
                      </MenuItem>
                    ))}
                    {/* <MenuItem value="1">Admin</MenuItem>
                    <MenuItem value="2">Manager</MenuItem>
                    <MenuItem value="3">User</MenuItem> */}
                  </Select>
                  <FormHelperText error>{errors.roleId}</FormHelperText>
                </FormControl>
              </Box>
              <Box sx={{ gridColumn: "span 2" }}>
                <FormControl fullWidth>
                  <InputLabel id="title-label">Select Title</InputLabel>
                  <Select
                    label="Select Title"
                    value={values.titleId}
                    onChange={handleChange}
                    name="titleId"
                    error={!!touched.titleId && !!errors.titleId}
                  >
                    {(titles || []).map((title) => (
                      <MenuItem key={title.id} value={title.id}>
                        {title.name}
                      </MenuItem>
                    ))}
                    {/* <MenuItem value="1">Customer Support Officer</MenuItem>
                    <MenuItem value="2">IT Officer</MenuItem>
                    <MenuItem value="3">Operational Manager</MenuItem>
                    <MenuItem value="4">Finance Officer</MenuItem>
                    <MenuItem value="4">Marketing Officer</MenuItem> */}
                  </Select>
                  <FormHelperText error>{errors.titleId}</FormHelperText>
                </FormControl>
              </Box>

              <Box display="flex" gap="20px" sx={{ gridColumn: "span 4" }}>
                <TextField
                  fullWidth
                  label="First Name"
                  variant="outlined"
                  onBlur={handleBlur}
                  value={values.firstName}
                  onChange={handleChange}
                  name="firstName"
                  error={!!touched.firstName && !!errors.firstName}
                  helperText={touched.firstName && errors.firstName}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Person />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ gridColumn: "span 1" }}
                />

                <TextField
                  fullWidth
                  label="Middle Name"
                  variant="outlined"
                  onBlur={handleBlur}
                  value={values.middleName}
                  onChange={handleChange}
                  name="middleName"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Person />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ gridColumn: "span 1" }}
                />

                <TextField
                  fullWidth
                  variant="outlined"
                  type="text"
                  label="Last Name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.lastName}
                  name="lastName"
                  error={!!touched.lastName && !!errors.lastName}
                  helperText={touched.lastName && errors.lastName}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Person />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ gridColumn: "span 1" }}
                />
              </Box>

              <TextField
                fullWidth
                variant="outlined"
                type="text"
                label="Username"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.username}
                name="username"
                error={!!touched.username && !!errors.username}
                helperText={touched.username && errors.username}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Security />
                    </InputAdornment>
                  ),
                }}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="outlined"
                type="text"
                label="Phone Number"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.contact}
                name="contact"
                error={!!touched.contact && !!errors.contact}
                helperText={touched.contact && errors.contact}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Phone />
                    </InputAdornment>
                  ),
                }}
                sx={{ gridColumn: "span 2" }}
              />
            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Create New User
              </Button>
            </Box>

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
          </form>
        )}
      </Formik>
    </Box>
  );
};

const phoneRegExp =
  /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/;

const checkoutSchema = yup.object().shape({
  firstName: yup.string().required("required"),
  lastName: yup.string().required("required"),
  username: yup.string().required("required"),
  contact: yup
    .string()
    .matches(phoneRegExp, "Phone number is not valid")
    .required("required"),
  titleId: yup.string().required("required"),
  roleId: yup.string().required("required"),
});
const initialValues = {
  firstName: "",
  middleName: "",
  lastName: "",
  username: "",
  contact: "",
  titleId: "",
  roleId: "",
};

export default AddUser;
