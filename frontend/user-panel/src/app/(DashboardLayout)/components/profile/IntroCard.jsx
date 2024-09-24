import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import ChildCard from '../shared/ChildCard';
import {
  IconBriefcase,
  IconDeviceDesktop,
  IconMail,
  IconMapPin,
  IconPhone,
} from '@tabler/icons-react';

const IntroCard = ({ userData }) => (
  <ChildCard>
    <Typography fontWeight={600} variant="h4" mb={2}>
      Introduction
    </Typography>
    {/* <Typography color="textSecondary" variant="subtitle2" mb={2}>
      Hello, I am Julia Roberts. I love making websites and graphics. Lorem ipsum dolor sit amet,
      consectetur adipiscing elit.
    </Typography> */}
    {/* <Stack direction="row" gap={2} alignItems="center" mb={3}>
      <IconBriefcase size="21" />
      <Typography variant="h6">Sir, P P Institute Of Science</Typography>
    </Stack> */}
    <Stack direction="row" gap={2} alignItems="center" mb={3}>
      <IconMail size="21" />
      <Typography variant="h6">{userData.email}</Typography>
    </Stack>
    <Stack direction="row" gap={2} alignItems="center" mb={3}>
      <IconPhone size="21" />
      <Typography variant="h6">+91 {userData.phoneNumber}</Typography>
    </Stack>
    {/* <Stack direction="row" gap={2} alignItems="center" mb={1}>
      <IconMapPin size="21" />
      <Typography variant="h6">Newyork, USA - 100001</Typography>
    </Stack> */}
  </ChildCard>
);

export default IntroCard;
