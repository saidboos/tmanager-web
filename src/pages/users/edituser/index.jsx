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
import { api, callInitAPI, updateUserAPI } from "../../../api/client";
import { useLocation, useNavigate } from "react-router-dom";
import { clearInitData, INIT_KEY } from "../../../auth/AuthContext";
import { capitalizeFirstLetter } from "../../../utils/stringUtils";
import Loader from "../../../components/Loader";

const EditUser = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const { state } = useLocation();
  const navigate = useNavigate();
  const [titles, setTitles] = useState([]);
  const [roles, setRoles] = useState([]);
  const [formInit, setFormInit] = useState(initialValues);

  const [toast, setToast] = useState({
    open: false,
    msg: "",
    type: "success", // or "error"
  });

  const makeInitialValues = (u) => ({
    id: u?.id ?? "",
    firstName: u?.firstName ?? "",
    middleName: u?.middleName ?? "",
    lastName: u?.lastName ?? "",
    username: u?.username ?? "",
    contact: u?.phoneNumber ?? "",
    title: u?.title ?? "",
    role: u?.role ?? "",
    titleId: u?.titleId ?? "",
    roleId: u?.roleId ?? "",
  });

  useEffect(() => {
    const cachedInit = localStorage.getItem(INIT_KEY);
    if (cachedInit) {
      const init = JSON.parse(cachedInit);
      setTitles(init.mData.titles || []);
      setRoles(init.mData.roles || []);
    } else {
      // optional fallback if needed (e.g. token expired)
      console.log("No init data, please log in again");
    }

    // console.log("formInit", formInit);
    // update form when user changes
    setFormInit(makeInitialValues(state?.user));
  }, [state?.user]); // run once on mount

  const handleFormSubmit = async (values, { setSubmitting }) => {
    try {
      const numTitleId = Number(values.titleId); // convert to number
      const numRoleId = Number(values.roleId); // convert to number
      //Payload
      const data = {
        id: values.id,
        firstName: values.firstName,
        middleName: values.middleName,
        lastName: values.lastName,
        username: values.username,
        phoneNumber: values.contact,
        password: "test@123",
        titleId: numTitleId,
        roleId: numRoleId,
      };

      // // call update-users API to update user
      const response = await updateUserAPI(data);

      console.log("update user response", response);

      const message = response?.message || "User updated";

      setToast({ open: true, msg: message, type: "success" });

      clearInitData(); // clear cached init data to force refetch

      // call init API to save fresh data
      await callInitAPI();
      await new Promise((res) => setTimeout(res, 1000));

      navigate(getRoute());
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
      route = "/users"; // Default route
    }
    return route;
  };

  return (
    <Box m="0px 20px">
      <Box display="flex" alignItems="start">
        <IconButton color="primary" onClick={() => navigate(getRoute())}>
          <ArrowBack />
        </IconButton>
        <Header title="Edit user" />
      </Box>

      <Formik
        enableReinitialize
        onSubmit={handleFormSubmit}
        initialValues={formInit}
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
            {isSubmitting && <Loader />}

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
                    disabled={!roles.length} // optional: disable until roles load
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
                  value={values.middleName ?? ""}
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
                Update User
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
  id: "",
  firstName: "",
  middleName: "",
  lastName: "",
  username: "",
  contact: "",
  title: "",
  role: "",
  titleId: "",
  roleId: "",
};

export default EditUser;
