import { SidebarLink } from "@/types";

export const themes = [
  { value: "light", label: "Light", icon: "/assets/icons/sun.svg" },
  { value: "dark", label: "Dark", icon: "/assets/icons/moon.svg" },
];

export const sidebarLinks: SidebarLink[] = [
  {
    imgURL: "/assets/icons/home.svg",
    route: "/",
    label: "Home",
  },
  {
    imgURL: "/assets/icons/eye.svg",
    route: "/mockinterview",
    label: "Mock Interview",
  },
  {
    imgURL: "/assets/icons/microphone.svg",
    route: "/qagpt",
    label: "QA GPT",
  },
  {
    imgURL: "/assets/icons/tag.svg",
    route: "/trail",
    label: "Trail",
  },
  {
    imgURL: "/assets/icons/cc.svg",
    route: "/purchase",
    label: "Purchase",
  },
  {
    imgURL: "/assets/icons/star.svg",
    route: "/collection",
    label: "Collections",
  },
  {
    imgURL: "/assets/icons/user.svg",
    route: "/profile",
    label: "Profile",
  },
  {
    imgURL: "/assets/icons/question.svg",
    route: "/contact-us",
    label: "Contact Us",
  },
  {
    imgURL: "/assets/icons/like.svg",
    route: "/tips",
    label: "Tips",
  },
];
