import { uniqueId } from "lodash";

import {
  IconAperture,
  IconBrandPaypal,
} from "@tabler/icons-react";
import { IconHelp } from "@tabler/icons-react";

const Menuitems = [
  {
    navlabel: true,
    subheader: "Home",
  },

  {
    id: uniqueId(),
    title: "Dashboard",
    icon: IconAperture,
    href: "/",
    chipColor: "secondary",
  },


  {
    navlabel: true,
    subheader: "Billing",
  },

  {
    id: uniqueId(),
    title: "Invoice",
    icon: IconBrandPaypal,
    href: "/Invoice",
  },


  {
    navlabel: true,
    subheader: "Support",
  },
  { 
    id: uniqueId(),
    title: "Support",
    icon: IconHelp,
    href: "/Support",
  },

  {
    navlabel: true,
    subheader: "Contact",
  },
  {

    id: uniqueId(),
    title: "Send a mail",
    icon: IconHelp,
    href: "mailto:support@commerciax.com",
  },
  {

    id: uniqueId(),
    title: "Make a call",
    icon: IconHelp,
    href: "tel:+919016600610",
  },
];

export default Menuitems;
