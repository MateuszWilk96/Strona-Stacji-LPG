import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const FAVICONS = {
  lpg: "/icons/twoja-stacja-lpg-32.png",
  insurance: "/icons/ubezpieczenia-32.png",
};

export default function RouteFavicon() {
  const { pathname } = useLocation();

  useEffect(() => {
    const isInsurance = pathname === "/ubezpieczenia" || pathname.startsWith("/ubezpieczenia/");
    const href = isInsurance ? FAVICONS.insurance : FAVICONS.lpg;

    let link = document.querySelector('link[data-route-favicon="true"]');

    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      link.type = "image/png";
      link.sizes = "32x32";
      link.dataset.routeFavicon = "true";
      document.head.appendChild(link);
    }

    link.href = href;
  }, [pathname]);

  return null;
}
