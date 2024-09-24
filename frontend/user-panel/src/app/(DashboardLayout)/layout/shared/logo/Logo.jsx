import { useSelector } from 'react-redux';
import Link from 'next/link';
import { styled } from '@mui/material/styles';
import Image from 'next/image';

const Logo = () => {
  const customizer = useSelector((state) => state.customizer);
  const LinkStyled = styled(Link)(() => ({
    // height: customizer.TopbarHeight,
    // width: customizer.isCollapse ? '40px' : '180px',
    // overflow: 'hidden',
    // display: 'block',
  }));

  return (
    <LinkStyled href="/">
      <Image
        src="/images/xora.svg"
        alt="logo"
        className="flex justify-center items-center"
        height={customizer.TopbarHeight}
        width={70}
        priority
      />
    </LinkStyled>
  );
};

export default Logo;
