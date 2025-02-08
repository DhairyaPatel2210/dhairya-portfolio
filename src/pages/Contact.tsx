import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import Footer from "@/components/Footer";
import { Helmet } from "react-helmet-async";
import api from "@/lib/axios";
import { ContactSkeleton } from "@/components/LoadingCards";
import { fetchOwnerLocation } from "@/store/slices/contactSlice";
import { useTheme } from "@/components/theme-provider";

interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

interface SocialIcon {
  s3Link: string;
  s3Key: string;
}

interface FeaturedSocial {
  _id: string;
  name: string;
  link: string;
  lightIcon: SocialIcon;
  darkIcon: SocialIcon;
  user: string;
  createdAt: string;
  updatedAt: string;
}

const LOCATION_CACHE_KEY = "visitor_location";
const LOCATION_CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

const Contact = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { theme } = useTheme();
  const {
    featuredSocials,
    name: portfolioName,
    seo,
    loading: portfolioLoading,
  } = useSelector((state: RootState) => state.portfolio);
  const { ownerLocation, loading: locationLoading } = useSelector(
    (state: RootState) => state.contact
  );
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [visitorLocation, setVisitorLocation] = useState<string>("");

  // Helper function to get theme-based icon URL
  const getThemeBasedIconUrl = (social: FeaturedSocial) => {
    return theme === "dark" ? social.darkIcon.s3Link : social.lightIcon.s3Link;
  };

  useEffect(() => {
    // Only fetch owner location if it's not already in the store
    if (!ownerLocation) {
      dispatch(fetchOwnerLocation());
    }

    // Check for cached location first
    const getCachedLocation = () => {
      const cached = localStorage.getItem(LOCATION_CACHE_KEY);
      if (cached) {
        try {
          const { location, timestamp } = JSON.parse(cached);
          if (Date.now() - timestamp < LOCATION_CACHE_DURATION) {
            return location;
          }
        } catch (error) {
          console.error("Error parsing cached location:", error);
        }
      }
      return null;
    };

    // Silently get visitor's location
    const getVisitorLocation = async () => {
      try {
        // Check cache first
        const cachedLocation = getCachedLocation();
        if (cachedLocation) {
          setVisitorLocation(cachedLocation);
          return;
        }

        // First, get the IP address using ipify (free tier)
        const ipResponse = await fetch("https://api.ipify.org?format=json");
        if (!ipResponse.ok) {
          throw new Error("Failed to get IP address");
        }
        const { ip } = await ipResponse.json();

        // Then, get location data using freeipapi.com (free tier)
        const locationResponse = await fetch(
          `https://freeipapi.com/api/json/${ip}`
        );
        if (!locationResponse.ok) {
          throw new Error("Failed to get location data");
        }

        const data = await locationResponse.json();
        if (!data.countryName) {
          throw new Error("Failed to get location data");
        }

        const locationString = `${data.cityName}, ${data.regionName}, ${data.countryName}`;

        // Cache the result
        localStorage.setItem(
          LOCATION_CACHE_KEY,
          JSON.stringify({
            location: locationString,
            timestamp: Date.now(),
          })
        );

        setVisitorLocation(locationString);
      } catch (error) {
        console.error("Error getting visitor location:", error);
        // Don't show error toast to user as this is not critical
        setVisitorLocation("");
      }
    };

    getVisitorLocation();
  }, [dispatch, ownerLocation]);

  useEffect(() => {
    // Update favicon when SEO image is available
    if (seo?.image?.s3Url) {
      const favicon = document.getElementById("favicon") as HTMLLinkElement;
      if (favicon) {
        favicon.href = seo.image.s3Url;
      }
    }
  }, [seo?.image?.s3Url]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      setIsSending(true);
      await api.post("/api/contact/send-message", {
        ...formData,
        // Only include location if we have it
        ...(visitorLocation && { user_location: visitorLocation }),
      });
      toast.success("Message sent successfully!");
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  if (portfolioLoading || locationLoading || loading) {
    return (
      <div className="container mx-auto px-4 py-8 min-h-[calc(100vh-4rem)] flex flex-col">
        <div className="flex-grow">
          <h1 className="text-3xl font-bold text-center mb-8">Get in Touch</h1>
          <ContactSkeleton />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        {/* Primary Meta Tags */}
        <title>{`${portfolioName} - Contact`}</title>
        <meta name="title" content={`${portfolioName} - Contact`} />
        <meta
          name="description"
          content={seo?.description || "Get in touch with me"}
        />
        <meta name="keywords" content={seo?.keywords?.join(", ") || ""} />
        <meta name="author" content={portfolioName} />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:title" content={`${portfolioName} - Contact`} />
        <meta
          property="og:description"
          content={seo?.description || "Get in touch with me"}
        />
        {seo?.image?.s3Url && (
          <meta property="og:image" content={seo.image.s3Url} />
        )}

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={window.location.href} />
        <meta property="twitter:title" content={`${portfolioName} - Contact`} />
        <meta
          property="twitter:description"
          content={seo?.description || "Get in touch with me"}
        />
        {seo?.image?.s3Url && (
          <meta property="twitter:image" content={seo.image.s3Url} />
        )}

        {/* Favicon */}
        {seo?.image?.s3Url && <link rel="icon" href={seo.image.s3Url} />}
      </Helmet>
      <div className="container mx-auto px-4 py-8 min-h-[calc(100vh-4rem)] flex flex-col">
        <div className="flex-grow">
          <h1 className="text-3xl font-bold text-center mb-8">Get in Touch</h1>
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
            {/* Contact Form */}
            <div className="space-y-6 order-2 md:order-1">
              <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium mb-1"
                    >
                      Name *
                    </label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="Your name"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium mb-1"
                    >
                      Email *
                    </label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      placeholder="your.email@example.com"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium mb-1"
                    >
                      Message *
                    </label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      placeholder="Your message"
                      required
                      className="min-h-[150px]"
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isSending}>
                    {isSending ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </div>
            </div>

            {/* Socials */}
            <div className="space-y-6 order-1 md:order-2">
              <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4">Connect with Me</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {featuredSocials.map((social: FeaturedSocial) => (
                    <a
                      key={social._id}
                      href={social.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-accent transition-colors"
                    >
                      <img
                        src={getThemeBasedIconUrl(social)}
                        alt={social.name}
                        className="w-8 h-8 object-contain transition-all"
                        onError={(e) => {
                          console.error(
                            `Error loading icon for ${social.name}:`,
                            e
                          );
                        }}
                      />
                      <span className="text-sm font-medium">{social.name}</span>
                    </a>
                  ))}
                </div>
              </div>

              {ownerLocation && (
                <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
                  <h2 className="text-xl font-semibold mb-4">
                    {portfolioName}'s Location
                  </h2>
                  <p className="text-muted-foreground">{ownerLocation}</p>
                </div>
              )}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Contact;
