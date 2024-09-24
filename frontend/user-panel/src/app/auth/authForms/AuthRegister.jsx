import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import { Stack } from '@mui/system';
import AuthSocialButtons from './AuthSocialButtons';
import { useFormik } from 'formik';
import * as yup from 'yup';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';
import { IconButton, InputAdornment } from '@mui/material';
import { Api, Visibility, VisibilityOff } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import axios from 'axios';

import CustomTextField from '@/app/(DashboardLayout)/components/forms/theme-elements/CustomTextField';
import CustomFormLabel from '@/app/(DashboardLayout)/components/forms/theme-elements/CustomFormLabel';
import { useRouter } from 'next/navigation';
import { useUserData } from '@/store/useUserData';

// import { encryptData } from "@/utils/encryption/encryption";

const AuthRegister = ({ title, subtitle, subtext }) => {
  const router = useRouter();

  const initialValues = {
    fullName: '',
    phoneNumber: '',
    email: '',
    password: '',
    location: '',
    timezone: '',
    activityLog: {
      loginIp: '',
    },
  };
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const { setUserData } = useUserData();

  const validationSchema = yup.object({
    fullName: yup.string().required('Full name is required'),
    email: yup.string().email('Enter a valid email').required('Email is required'),
    phoneNumber: yup
      .string()
      .matches(/^\d{10}$/, 'Phone number should be exactly 10 digits')
      .required('Phone number is required'),
    password: yup
      .string()
      .min(8, 'Password should be of minimum 8 characters length')
      .matches(/\d/, 'Password must contain at least one number') // Enforces at least one number
      .matches(/[A-Z]/, 'Password must contain at least one uppercase letter') // Enforces at least one uppercase letter
      .required('Password is required'),
  });

  // get user's ip address
  async function getUserIpDetails() {
    try {
      const response = await fetch(`https://ipinfo.io?token=${process.env.NEXT_PUBLIC_API_TOKEN}`);
      const data = await response.json();

      console.log("User's IP Address:", data?.ip);
      console.log('Location:', `${data?.city}, ${data?.region}, ${data?.country}`);
      console.log('Timezone:', data.timezone);
      return data; // Return the data if you need to use it elsewhere
    } catch (error) {
      console.error('Error fetching IP details:', error);
    }
  }

  const handleSubmit = async (values) => {
    try {
      const userIpInfo = await getUserIpDetails();
      values.location = `${userIpInfo.city}, ${userIpInfo.region}, ${userIpInfo.country}`;
      values.timezone = userIpInfo.timezone;
      values.activityLog.loginIp = userIpInfo.ip;

      console.log(values);
      const res = await axios.post('/auth/signup', values);
      console.log(res);
      if (res.status === 201) {
        // Set the token in cookies

        toast.success('Congratulations!! You have successfully signed up!!', {
          icon: '🚀',
        });
        localStorage.setItem('userData', JSON.stringify(res.data.data.user));

        toast.success('Congratulations!! You have successfully signed in!!', {
          icon: '🚀',
        });
        setUserData(res.data.data.user);
        router.push('/');
      }
    } catch (error) {
      console.log(error.response.data.error.code);
      if (error.response.data.error.code === 11000) {
        toast.error(`Sorry!! Your email or phone number already exist!!`);
      } else {
        toast.error(`Sorry!! You can not successfully signed up!!`);
      }
    }
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: handleSubmit,
  });
  return (
    <>
      {title ? (
        <Typography fontWeight="700" variant="h3" mb={1}>
          {title}
        </Typography>
      ) : null}

      {subtext}
      <AuthSocialButtons title="Sign up with" />

      <Box mt={3}>
        <Divider>
          <Typography
            component="span"
            color="textSecondary"
            variant="h6"
            fontWeight="400"
            position="relative"
            px={2}
          >
            or sign up with
          </Typography>
        </Divider>
      </Box>

      {/* <Box> */}
      <form onSubmit={formik.handleSubmit}>
        <Stack>
          <Box mt="-10px">
            <CustomFormLabel>Full Name</CustomFormLabel>
            <CustomTextField
              fullWidth
              id="fullName"
              name="fullName"
              value={formik.values.fullName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.fullName && Boolean(formik.errors.fullName)}
              helperText={formik.touched.fullName && formik.errors.fullName}
            />
          </Box>
          <Box mt="-10px">
            <CustomFormLabel>Phone Number</CustomFormLabel>
            <CustomTextField
              fullWidth
              id="phoneNumber"
              name="phoneNumber"
              value={formik.values.phoneNumber}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)}
              helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}
            />
          </Box>

          <Box mt="-10px">
            <CustomFormLabel>Email Address</CustomFormLabel>
            <CustomTextField
              fullWidth
              id="email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
            />
          </Box>
          <Box mb={3}>
            <CustomFormLabel>Password</CustomFormLabel>
            <CustomTextField
              fullWidth
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
          {/* <Stack direction="row"> */}
          <Button variant="contained" type="submit">
            Sign up
          </Button>
          {/* </Stack> */}
        </Stack>
      </form>
      {/* </Box> */}
      {subtitle}
    </>
  );
};

export default AuthRegister;
