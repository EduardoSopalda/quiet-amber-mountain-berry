import { i as __toESM } from "../_runtime.mjs";
import { R as require_react, y as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/opening-film-DwhmeOno.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function OpeningFilm() {
	const ref = (0, import_react.useRef)(null);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "grid min-h-dvh place-items-center bg-paper",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
			ref,
			className: "h-dvh w-full object-contain",
			src: "/talk/opening.mp4",
			autoPlay: true,
			muted: true,
			playsInline: true,
			onClick: () => {
				const v = ref.current;
				if (!v) return;
				v.currentTime = 0;
				v.play();
			}
		})
	});
}
//#endregion
export { OpeningFilm as t };
