import { Outlet } from "react-router-dom";
import { TrackingScripts } from "./TrackingScripts";
import { ScrollToTop } from "./ScrollToTop";

/** Slim chrome for paid ads landing pages — tracking only, no site mega-nav. */
export function LandingLayout() {
  return (
    <>
      <ScrollToTop />
      <TrackingScripts />
      <Outlet />
    </>
  );
}
