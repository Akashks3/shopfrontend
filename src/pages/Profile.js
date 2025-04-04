import React, { useState, useEffect } from "react";
import BreadCrumb from "../components/BreadCrumb";
import Container from "../components/Container";
import { useFormik } from "formik";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { updateProfile } from "../features/user/userSlice";
import { FiEdit } from "react-icons/fi";
import { TextField, Button, Grid, CircularProgress } from "@mui/material";

const profileSchema = yup.object({
  firstname: yup.string().required("First Name is Required"),
  lastname: yup.string().required("Last Name is Required"),
  email: yup
    .string()
    .required("Email is Required")
    .email("Email Should be valid"),
  mobile: yup
    .number()
    .required("Mobile No is Required")
    .positive()
    .integer("Mobile No must be a valid integer"),
});

const Profile = () => {
  const dispatch = useDispatch();
  const userState = useSelector((state) => state.auth.user);
  const [edit, setEdit] = useState(true);
  const [loading, setLoading] = useState(false);

  // Retrieve the token from localStorage
  const getTokenFromLocalStorage = localStorage.getItem("customer")
    ? JSON.parse(localStorage.getItem("customer"))
    : null;

  const config2 = {
    headers: {
      Authorization: `Bearer ${getTokenFromLocalStorage?.token || ""}`,
      Accept: "application/json",
    },
  };

  const formik = useFormik({
    initialValues: {
      firstname: userState?.firstname || "",
      lastname: userState?.lastname || "",
      email: userState?.email || "",
      mobile: userState?.mobile || "",
    },
    validationSchema: profileSchema,
    onSubmit: (values) => {
      setLoading(true);
      dispatch(updateProfile({ data: values, config2: config2 })).finally(() => {
        setLoading(false);
        setEdit(true);
      });
    },
  });

  return (
    <>
      <BreadCrumb title="My Profile" />
      <Container class1="cart-wrapper home-wrapper-2 py-5">
        <div className="row">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center">
              <h3 className="my-3">Update Profile</h3>
              <FiEdit className="fs-3" onClick={() => setEdit(false)} />
            </div>
          </div>
          <div className="col-12">
            <form onSubmit={formik.handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="First Name"
                    variant="outlined"
                    fullWidth
                    name="firstname"
                    disabled={edit}
                    value={formik.values.firstname}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.firstname && Boolean(formik.errors.firstname)}
                    helperText={formik.touched.firstname && formik.errors.firstname}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Last Name"
                    variant="outlined"
                    fullWidth
                    name="lastname"
                    disabled={edit}
                    value={formik.values.lastname}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.lastname && Boolean(formik.errors.lastname)}
                    helperText={formik.touched.lastname && formik.errors.lastname}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Email"
                    variant="outlined"
                    fullWidth
                    name="email"
                    disabled={edit}
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={formik.touched.email && formik.errors.email}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Mobile No"
                    variant="outlined"
                    fullWidth
                    name="mobile"
                    disabled={edit}
                    value={formik.values.mobile}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.mobile && Boolean(formik.errors.mobile)}
                    helperText={formik.touched.mobile && formik.errors.mobile}
                  />
                </Grid>
              </Grid>

              {!edit && (
                <div className="mt-3">
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={loading}
                    fullWidth
                  >
                    {loading ? <CircularProgress size={24} color="inherit" /> : "Save"}
                  </Button>
                </div>
              )}
            </form>
          </div>
        </div>
      </Container>
    </>
  );
};

export default Profile;
