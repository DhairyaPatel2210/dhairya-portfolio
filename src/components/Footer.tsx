import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

const Footer = () => {
  const { name, featuredSocials } = useSelector(
    (state: RootState) => state.portfolio
  );

  return (
    <footer className="mt-12 pt-6 border-t">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-foreground/60">
            © {new Date().getFullYear()}. All rights reserved.
          </p>
          <div className="flex gap-4">
            {featuredSocials.map((social) => (
              <a
                key={social._id}
                href={social.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground/60 hover:text-foreground transition-colors"
              >
                <img
                  src={social.s3Link}
                  alt={social.name}
                  className="w-6 h-6"
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
