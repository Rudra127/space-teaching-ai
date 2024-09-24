import React from 'react';
import Box from '@mui/material/Box';
import CustomTextField from '@/app/(DashboardLayout)/components/forms/theme-elements/CustomTextField';
import CustomFormLabel from '@/app/(DashboardLayout)/components/forms/theme-elements/CustomFormLabel';
import { Stack } from '@mui/system';
import { useFormik } from 'formik';
import * as yup from 'yup';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { DialogTitle, IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Button, Dialog, DialogActions, DialogContent } from '@mui/material';
import { useSession } from 'next-auth/react';

function UserDataModal({ setTakeUserData, takeUserData }) {
  const initialValues = {
    phoneNumber: '',
    password: '',
    activityLog: {
      loginIp: '',
    },
  };

  const { data: session } = useSession();

  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const router = useRouter();
  const validationSchema = yup.object({
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
      values.fullName = session.user.name;
      values.email = session.user.email;
      values.profilePic = session.user.image;
      const userIpInfo = await getUserIpDetails();
      values.location = `${userIpInfo.city}, ${userIpInfo.region}, ${userIpInfo.country}`;
      values.timezone = userIpInfo.timezone;
      values.activityLog.loginIp = userIpInfo.ip;

      console.log(values);
      const res = await axios.post('/auth/signup', values);
      console.log(res);
      if (res.status === 201) {
        localStorage.setItem('userData', JSON.stringify(res.data.data.user));

        toast.success('Congratulations!! You have successfully signed up!!', {
          icon: '🚀',
        });
        router.push('/');
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
      //   if (error.response.data.error.code === 11000) {
      //     toast.error(`Sorry!! Your email or phone number already exist!!`);
      //   } else {
      //     toast.error(`Sorry!! You can not successfully signed up!!`);
      //   }
    }
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: handleSubmit,
  });

  return (
    <Dialog
      maxWidth="sm"
      open={takeUserData}
      onClose={() => {
        setTakeUserData(true);
      }}
      fullWidth
    >
      <DialogTitle>Complete your Profile</DialogTitle>
      <DialogContent>
        <div className="">
          <form onSubmit={formik.handleSubmit}>
            <Stack>
              <Box mt="-10px">
                <CustomFormLabel>Phone Number</CustomFormLabel>
                <CustomTextField
                  className=""
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
              <Button variant="contained" type="submit">
                Save
              </Button>
            </Stack>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default UserDataModal;
