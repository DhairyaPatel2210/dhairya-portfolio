import {
  EducationCardSkeleton,
  ExperienceCardSkeleton,
  ProjectCardSkeleton,
} from "@/components/LoadingCards";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { FaDownload, FaGithub, FaGlobe } from "react-icons/fa";
import ReactMarkdown from "react-markdown";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { useTheme } from "@/components/theme-provider";

const formatDate = (date: string | null) => {
  if (!date) return "Present";
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

interface Project {
  _id: string;
  title: string;
  description: string;
  programmingLanguages: string[];
  githubRepo: string;
  liveWebLink: string;
  projectType: string[];
  specialNote: string;
  startDate: string;
  iconImage: string;
  currentlyWorking: boolean;
}

interface Experience {
  _id: string;
  role: string;
  company: string;
  startDate: string;
  endDate: string | null;
  isCurrentJob: boolean;
  responsibilities: string;
  technologies: string[];
}

interface Education {
  _id: string;
  universityName: string;
  major: string;
  degree: string;
  gpa: number;
  startDate: string;
  endDate: string;
  isPursuing: boolean;
  relatedCourseworks: string[];
}

interface FeaturedSocial {
  _id: string;
  name: string;
  link: string;
  lightIcon: {
    s3Link: string;
    s3Key: string;
  };
  darkIcon: {
    s3Link: string;
    s3Key: string;
  };
  user: string;
  createdAt: string;
  updatedAt: string;
}

interface PortfolioData {
  about: string;
  status: string;
  featuredProjects: Project[];
  experience: Experience[];
  education: Education[];
  resumes: {
    url: string;
    displayName: string;
  }[];
  featuredSocials: FeaturedSocial[];
  loading: boolean;
  error: string | null;
  name: string;
  seo: {
    title: string;
    description: string;
    keywords: string[];
    image: {
      s3Key: string;
      s3Url: string;
    };
  };
  analytics?: {
    googleAnalyticsId: string;
  };
}

const Home = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const portfolioData = useSelector((state: RootState) => state.portfolio);
  const { theme } = useTheme();

  const {
    loading: portfolioLoading,
    error,
    about,
    status,
    featuredProjects,
    experience,
    education,
    resumes,
    featuredSocials,
    name,
    seo,
    analytics,
  } = portfolioData;

  const [expandedStatus, setExpandedStatus] = useState(false);
  const [expandedAbout, setExpandedAbout] = useState(false);
  const [expandedDescriptions, setExpandedDescriptions] = useState<{
    [key: string]: boolean;
  }>({});

  const truncateText = (text: string, limit: number) => {
    if (text.length <= limit) return text;
    return text.slice(0, limit) + "...";
  };

  const calculateDuration = (startDate: string, endDate: string | null) => {
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : new Date();

    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // Calculate years and remaining months more accurately
    const years = Math.floor(diffDays / 365);
    const remainingDays = diffDays % 365;
    const months = Math.floor(remainingDays / 30); // Using average month length

    if (diffDays < 30) {
      return "Less than a month";
    }

    let duration = "";
    if (years > 0) {
      duration += `${years} year${years > 1 ? "s" : ""}`;
      if (months > 0) {
        duration += ` ${months} month${months > 1 ? "s" : ""}`;
      }
    } else {
      duration = `${months} month${months > 1 ? "s" : ""}`;
    }

    return duration;
  };

  useEffect(() => {
    // Update favicon when SEO image is available
    if (seo?.image?.s3Url) {
      const favicon = document.getElementById("favicon") as HTMLLinkElement;
      if (favicon) {
        favicon.href = seo.image.s3Url;
      }
    }
  }, [seo.image.s3Url]);

  // Helper function to get theme-based icon URL
  const getThemeBasedIconUrl = (social: FeaturedSocial) => {
    return theme === "dark" ? social.darkIcon.s3Link : social.lightIcon.s3Link;
  };

  if (portfolioLoading) {
    return (
      <div className="container mx-auto px-2 sm:px-4 py-8 space-y-12 overflow-x-hidden">
        {/* Status Loading */}
        <section className="space-y-6">
          <div className="max-w-3xl mx-auto">
            <div className="space-y-2">
              <div className="h-4 bg-muted-foreground/30 dark:bg-accent/20 rounded animate-pulse"></div>
              <div className="h-4 bg-muted-foreground/30 dark:bg-accent/20 rounded w-5/6 mx-auto animate-pulse"></div>
            </div>
          </div>
        </section>

        {/* About Loading */}
        <section className="space-y-6">
          <div className="max-w-3xl mx-auto">
            <div className="h-8 bg-muted-foreground/30 dark:bg-accent/20 rounded w-1/4 mx-auto mb-4 animate-pulse"></div>
            <div className="space-y-2">
              <div className="h-4 bg-muted-foreground/30 dark:bg-accent/20 rounded w-full animate-pulse"></div>
              <div className="h-4 bg-muted-foreground/30 dark:bg-accent/20 rounded w-5/6 mx-auto animate-pulse"></div>
            </div>
          </div>
        </section>

        {/* Experience Loading */}
        <section className="space-y-6">
          <div className="h-8 bg-muted-foreground/30 dark:bg-accent/20 rounded w-1/3 mx-auto mb-6 animate-pulse"></div>
          <div className="max-w-3xl mx-auto space-y-6">
            {[1, 2].map((i) => (
              <ExperienceCardSkeleton key={i} />
            ))}
          </div>
        </section>

        {/* Education Loading */}
        <section className="space-y-6">
          <div className="h-8 bg-muted-foreground/30 dark:bg-accent/20 rounded w-1/3 mx-auto mb-6 animate-pulse"></div>
          <div className="max-w-3xl mx-auto space-y-6">
            <EducationCardSkeleton />
          </div>
        </section>

        {/* Projects Loading */}
        <section className="space-y-6">
          <div className="h-8 bg-muted-foreground/30 dark:bg-accent/20 rounded w-1/3 mx-auto mb-6 animate-pulse"></div>
          <div className="max-w-4xl mx-auto">
            <ProjectCardSkeleton />
          </div>
        </section>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-red-500 text-center">Error: {error}</div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        {/* Primary Meta Tags */}
        <title>{seo?.title || name || "Portfolio"}</title>
        <meta name="title" content={seo?.title || name || "Portfolio"} />
        <meta
          name="description"
          content={seo?.description || "Welcome to my portfolio"}
        />
        <meta name="keywords" content={seo?.keywords?.join(", ") || ""} />
        <meta name="author" content={name} />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:title" content={seo?.title || name || "Portfolio"} />
        <meta
          property="og:description"
          content={seo?.description || "Welcome to my portfolio"}
        />
        {seo?.image?.s3Url && (
          <meta property="og:image" content={seo.image.s3Url} />
        )}

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={window.location.href} />
        <meta
          property="twitter:title"
          content={seo?.title || name || "Portfolio"}
        />
        <meta
          property="twitter:description"
          content={seo?.description || "Welcome to my portfolio"}
        />
        {seo?.image?.s3Url && (
          <meta property="twitter:image" content={seo.image.s3Url} />
        )}

        {/* LinkedIn */}
        <meta property="og:site_name" content={name} />
        <meta property="og:type" content="profile" />
        <meta property="profile:first_name" content={name.split(" ")[0]} />
        <meta
          property="profile:last_name"
          content={name.split(" ").slice(1).join(" ")}
        />

        {/* Favicon */}
        {seo?.image?.s3Url && <link rel="icon" href={seo.image.s3Url} />}

        {/* Google Analytics */}
        {analytics?.googleAnalyticsId && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${analytics.googleAnalyticsId}`}
            />
            <script>
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${analytics.googleAnalyticsId}');
              `}
            </script>
          </>
        )}
      </Helmet>
      <div className="container mx-auto px-2 sm:px-4 py-8 space-y-12 overflow-x-hidden">
        {/* Status Section */}
        <section className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="prose dark:prose-invert mx-auto">
            <ReactMarkdown>
              {expandedStatus ? status : truncateText(status, 60)}
            </ReactMarkdown>
            {status.length > 60 && (
              <button
                onClick={() => setExpandedStatus(!expandedStatus)}
                className="text-blue-500 hover:underline mt-2"
              >
                {expandedStatus ? "Show less" : "Read more"}
              </button>
            )}
          </div>
          <div className="flex justify-center gap-4 mt-4">
            {featuredSocials
              .filter(
                (social) =>
                  social.name.toLowerCase().includes("github") ||
                  social.name.toLowerCase().includes("linkedin")
              )
              .map((social) => (
                <a
                  key={social._id}
                  href={social.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground/60 hover:text-foreground transition-colors"
                >
                  <img
                    src={getThemeBasedIconUrl(social)}
                    alt={social.name}
                    className="w-6 h-6"
                  />
                </a>
              ))}
          </div>
        </section>

        {/* About Section */}
        <section className="space-y-4 max-w-3xl mx-auto">
          <h2 className="text-2xl font-semibold text-center">About Me</h2>
          <div
            className={`prose dark:prose-invert mx-auto w-full ${
              expandedAbout ? "text-justify" : "text-center"
            }`}
          >
            <ReactMarkdown>
              {expandedAbout ? about : truncateText(about, 60)}
            </ReactMarkdown>
            {about.length > 60 && (
              <button
                onClick={() => setExpandedAbout(!expandedAbout)}
                className="text-blue-500 hover:underline mt-2"
              >
                {expandedAbout ? "Show less" : "Read more"}
              </button>
            )}
          </div>
        </section>

        {/* Experience Section */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-center">Experience</h2>
          <div className="max-w-3xl mx-auto space-y-6">
            {experience.map((exp) => (
              <div
                key={exp._id}
                className="border rounded-lg p-6 space-y-4 shadow-sm"
              >
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold">{exp.role}</h3>
                  <p className="text-lg text-foreground/80">{exp.company}</p>
                  <p className="text-sm text-foreground/60">
                    {calculateDuration(exp.startDate, exp.endDate)}
                  </p>
                  <p className="text-sm text-foreground/60">
                    {formatDate(exp.startDate)} -{" "}
                    {exp.isCurrentJob ? "Present" : formatDate(exp.endDate!)}
                  </p>
                </div>
                <div className="prose dark:prose-invert max-w-none">
                  <ReactMarkdown>
                    {expandedDescriptions[exp._id]
                      ? exp.responsibilities
                      : truncateText(exp.responsibilities, 100)}
                  </ReactMarkdown>
                  {exp.responsibilities.length > 100 && (
                    <button
                      onClick={() =>
                        setExpandedDescriptions((prev) => ({
                          ...prev,
                          [exp._id]: !prev[exp._id],
                        }))
                      }
                      className="text-blue-500 hover:underline mt-2"
                    >
                      {expandedDescriptions[exp._id]
                        ? "Show less"
                        : "Read more"}
                    </button>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {exp.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 bg-accent rounded-full text-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Resume Section */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-center">Resume</h2>
          <div className="flex flex-col md:flex-row justify-center gap-4">
            {resumes.map((resume, index) => (
              <Button
                key={index}
                onClick={() => window.open(resume.url, "_blank")}
                className="flex items-center gap-2"
              >
                <FaDownload className="w-4 h-4" />
                {resume.displayName}
              </Button>
            ))}
          </div>
        </section>

        {/* Education Section */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-center">Education</h2>
          <div className="max-w-3xl mx-auto space-y-6">
            {education.map((edu) => (
              <div
                key={edu._id}
                className="border rounded-lg p-6 space-y-4 shadow-sm"
              >
                <h3 className="text-xl font-semibold">{edu.universityName}</h3>
                <div className="space-y-1">
                  <p className="text-lg">
                    {edu.degree} in {edu.major}
                  </p>
                  <p className="text-foreground/60">GPA: {edu.gpa}</p>
                  <p className="text-sm text-foreground/60">
                    {formatDate(edu.startDate)} -{" "}
                    {edu.isPursuing ? "Present" : formatDate(edu.endDate)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Featured Projects Section */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-center">
            Featured Projects
          </h2>
          <div className="max-w-4xl mx-auto">
            <Carousel>
              <CarouselContent>
                {featuredProjects.map((project) => (
                  <CarouselItem key={project._id}>
                    <div className="border rounded-lg p-6 space-y-4 shadow-sm">
                      <img
                        src={project.iconImage}
                        alt={project.title}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <div className="space-y-2">
                        <h3 className="text-xl font-semibold">
                          {project.title}
                        </h3>
                        <p className="text-sm text-foreground/60">
                          {formatDate(project.startDate)} -{" "}
                          {project.currentlyWorking ? "Present" : "Completed"}
                        </p>
                      </div>
                      <div className="prose dark:prose-invert max-w-none">
                        <ReactMarkdown>
                          {expandedDescriptions[project._id]
                            ? project.description
                            : truncateText(project.description, 100)}
                        </ReactMarkdown>
                        {project.description.length > 100 && (
                          <button
                            onClick={() =>
                              setExpandedDescriptions((prev) => ({
                                ...prev,
                                [project._id]: !prev[project._id],
                              }))
                            }
                            className="text-blue-500 hover:underline mt-2"
                          >
                            {expandedDescriptions[project._id]
                              ? "Show less"
                              : "Read more"}
                          </button>
                        )}
                      </div>
                      {project.specialNote && (
                        <div className="prose dark:prose-invert max-w-none">
                          <ReactMarkdown>{project.specialNote}</ReactMarkdown>
                        </div>
                      )}
                      <div className="flex justify-end gap-4">
                        <a
                          href={project.githubRepo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-foreground/60 hover:text-foreground transition-colors"
                        >
                          {featuredSocials.find((social) =>
                            social.name.toLowerCase().includes("github")
                          ) ? (
                            <img
                              src={getThemeBasedIconUrl(
                                featuredSocials.find((social) =>
                                  social.name.toLowerCase().includes("github")
                                )!
                              )}
                              alt="GitHub"
                              className="w-6 h-6"
                            />
                          ) : (
                            <FaGithub className="w-6 h-6" />
                          )}
                        </a>
                        {project.liveWebLink && (
                          <a
                            href={project.liveWebLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-foreground/60 hover:text-foreground transition-colors"
                          >
                            {featuredSocials.find(
                              (social) =>
                                social.name.toLowerCase().includes("browser") ||
                                social.name.toLowerCase().includes("web")
                            ) ? (
                              <img
                                src={getThemeBasedIconUrl(
                                  featuredSocials.find(
                                    (social) =>
                                      social.name
                                        .toLowerCase()
                                        .includes("browser") ||
                                      social.name.toLowerCase().includes("web")
                                  )!
                                )}
                                alt="Live Website"
                                className="w-6 h-6"
                              />
                            ) : (
                              <FaGlobe className="w-6 h-6" />
                            )}
                          </a>
                        )}
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-12 pt-6 border-t">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-foreground/60">
                © {new Date().getFullYear()} All rights reserved
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
                      src={getThemeBasedIconUrl(social)}
                      alt={social.name}
                      className="w-6 h-6"
                    />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Home;
