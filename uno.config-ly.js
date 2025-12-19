import { resolve } from "node:path";
import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetWind3,
  transformerDirectives,
  transformerVariantGroup,
} from "unocss";
import { animatedUno } from "animated-unocss";
import { FileSystemIconLoader } from "@iconify/utils/lib/loader/node-loaders";

const svgPath = resolve(__dirname, "./assets/svg");

export default defineConfig({
  separators: [":", "-"],
  shortcuts: [
    // 导航样式
    [
      "nav-item",
      " text-title-main px-4 py-1 rounded-12px hover:bg-[rgba(16,24,40,0.04)]",
    ],
    [
      "container",
      "flex w-full overflow-hidden mx-auto px-3 md:px-5 items-center md:max-w-320",
    ],
    [
      "btn",
      "px-4 py-1 inline-block bg-primary-600 text-white cursor-pointer hover:bg-teal-700 disabled:cursor-default disabled:bg-gray-600 disabled:opacity-50",
    ],
    [
      "icon-btn",
      "inline-block cursor-pointer select-none opacity-75 transition duration-200 ease-in-out hover:opacity-100 hover:text-teal-600",
    ],
    ["enter-x-right", "animated animated-fade-in-right !animate-duration-500"],
    ["border-vertical", "border-0 border-r-1 border-[#dfdfdf] border-solid"],
    ["border-init", "border-0 border-solid border-#eef0f5"],
    [
      "shadow-card",
      "shadow-[0px_0px_10px_0px_rgba(199,199,199,0.3)] transition-all hover:shadow-[0px_0px_12px_0px_rgba(199,199,199,0.6)]",
    ],
  ],
  theme: {
    colors: {
      primary: {
        700: "#35A268",
        600: "#42CA82",
        400: "#7BDAA8",
        300: "#8EDFB4",
        200: "#A1E5C1",
        100: "#B3EACD",
        50: "#D9F4E6",
        25: "#ECFAF3",
      },
      second: "#8792A2",
      title: {
        main: "#101828",
        sub: "#8792A2",
      },
      area: "#F4F4F4",
      regular: "#344054",
      danger: "#f56c6c",
    },
    breakpoints: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1460px",
      "2xl": "1681px",
    },
  },
  presets: [
    presetWind3(),
    presetAttributify(),
    presetIcons({
      extraProperties: {
        display: "inline-block",
        "vertical-align": "base-inline",
      },
      collections: {
        xm: FileSystemIconLoader(svgPath, (svg) =>
          svg.replace(/#000000|#333333/g, "currentColor")
        ),
      },
      autoInstall: true,
    }),
    animatedUno(),
    // presetIcons({
    //   scale: 1.2,
    // }),
    presetTypography(),
  ],
  transformers: [transformerDirectives(), transformerVariantGroup()],
});
