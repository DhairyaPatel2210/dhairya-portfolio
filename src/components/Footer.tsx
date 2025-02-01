import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useTheme } from "@/components/theme-provider";
import type { FeaturedSocial } from "@/store/slices/portfolioSlice";
import { useEffect } from "react";

const Footer = () => {
  const { name, featuredSocials } = useSelector(
    (state: RootState) => state.portfolio
  );
  const { theme } = useTheme();

  return (
    <footer className="mt-12 pt-6 border-t">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-foreground/60">
            © {new Date().getFullYear()} {name}. All rights reserved.
          </p>
          <div className="flex gap-4">
            {featuredSocials.map((social: FeaturedSocial) => (
              <a
                key={social._id}
                href={social.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground/60 hover:text-foreground transition-colors"
                title={social.name}
              >
                <img
                  src={
                    theme === "dark"
                      ? social.darkIcon.s3Link
                      : social.lightIcon.s3Link
                  }
                  alt={social.name}
                  className="w-5 h-5 transition-all"
                />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
