import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useSelector } from 'react-redux';
import { IconPower } from '@tabler/icons-react';
import Link from 'next/link';
import { useUserData } from '@/store/useUserData';
import { signOut } from 'next-auth/react';
import axios from 'axios';

export const Profile = () => {
  const customizer = useSelector((state) => state.customizer);
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'));
  const hideMenu = lgUp ? customizer.isCollapse && !customizer.isSidebarHover : '';
  const { userData } = useUserData();

  const handleLogout = async () => {
    await signOut('google');
    const res = await axios.post('/auth/logout');
    localStorage.removeItem('userData');
    if (res.statusCode === 200) {
      window.location.href = '/auth/login';
    }
  };

  return (
    <Box
      display={'flex'}
      alignItems="center"
      gap={2}
      sx={{ m: 3, p: 2, bgcolor: `${'secondary.light'}` }}
    >
      {!hideMenu ? (
        <>
          <Avatar
            alt="Remy Sharp"
            src={'/images/profile/user-1.jpg'}
            sx={{ height: 40, width: 40 }}
          />

          <Box>
            <Typography variant="h6">{userData.fullName}</Typography>
            {/* <Typography variant="caption">{userData.fullName}</Typography> */}
          </Box>
          <Box sx={{ ml: 'auto' }}>
            <Tooltip title="Logout" placement="top">
              <IconButton color="primary" onClick={handleLogout} aria-label="logout" size="small">
                <IconPower size="20" />
              </IconButton>
            </Tooltip>
          </Box>
        </>
      ) : (
        ''
      )}
    </Box>
  );
};
