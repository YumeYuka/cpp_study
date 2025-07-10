import { sidebar } from "vuepress-theme-hope";

export default sidebar({
  "/": [
    "",
    {
      text: "指南",
      icon: "laptop-code",
      prefix: "guide/",
      link: "guide/",
      children: "structure",
    },
  ],
});
