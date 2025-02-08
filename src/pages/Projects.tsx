import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import { useTheme } from "@/components/theme-provider";
import {
  fetchProjects,
  setSelectedLanguages,
  setSelectedProjectTypes,
  type Project,
} from "../store/slices/projectsSlice";
import { ProjectCardSkeleton } from "@/components/LoadingCards";
import { Button } from "@/components/ui/button";
import { FaGithub, FaGlobe, FaFilter } from "react-icons/fa";
import ReactMarkdown from "react-markdown";
import { Badge } from "@/components/ui/badge";
import { Helmet } from "react-helmet-async";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Check } from "lucide-react";

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

const formatDate = (date: string) => {
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
};

const Projects = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { theme } = useTheme();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const {
    projects,
    availableLanguages,
    availableProjectTypes,
    selectedLanguages,
    selectedProjectTypes,
    loading,
    error,
    dataFetched,
  } = useSelector((state: RootState) => state.projects);
  const { featuredSocials, name, seo } = useSelector(
    (state: RootState) => state.portfolio
  );

  const [expandedDescriptions, setExpandedDescriptions] = useState<{
    [key: string]: boolean;
  }>({});

  useEffect(() => {
    if (isAuthenticated && !dataFetched) {
      dispatch(fetchProjects());
    }
  }, [dispatch, isAuthenticated, dataFetched]);

  useEffect(() => {
    // Update favicon when SEO image is available
    if (seo?.image?.s3Url) {
      const favicon = document.getElementById("favicon") as HTMLLinkElement;
      if (favicon) {
        favicon.href = seo.image.s3Url;
      }
    }
  }, [seo?.image?.s3Url]);

  const handleLanguageToggle = (language: string) => {
    const newSelection = selectedLanguages.includes(language)
      ? selectedLanguages.filter((l: string) => l !== language)
      : [...selectedLanguages, language];
    dispatch(setSelectedLanguages(newSelection));
  };

  const handleProjectTypeToggle = (type: string) => {
    const newSelection = selectedProjectTypes.includes(type)
      ? selectedProjectTypes.filter((t: string) => t !== type)
      : [...selectedProjectTypes, type];
    dispatch(setSelectedProjectTypes(newSelection));
  };

  const filteredProjects = projects
    .filter((project: Project) => {
      const matchesLanguages =
        selectedLanguages.length === 0 ||
        project.programmingLanguages.some((lang: string) =>
          selectedLanguages.includes(lang)
        );
      const matchesTypes =
        selectedProjectTypes.length === 0 ||
        project.projectType.some((type: string) =>
          selectedProjectTypes.includes(type)
        );
      return matchesLanguages && matchesTypes;
    })
    .sort(function (a, b) {
      var keyA = new Date(a.endDate),
        keyB = new Date(b.endDate);
      // Compare the 2 dates
      if (keyA < keyB) return 1;
      if (keyA > keyB) return -1;
      return 0;
    });
  const truncateText = (text: string, limit: number) => {
    if (text.length <= limit) return text;
    return text.slice(0, limit) + "...";
  };

  // Helper function to get theme-based icon URL
  const getThemeBasedIconUrl = (social: FeaturedSocial) => {
    return theme === "dark" ? social.darkIcon.s3Link : social.lightIcon.s3Link;
  };

  // Get GitHub and browser icons based on theme
  const githubSocial = featuredSocials.find((social) =>
    social.name.toLowerCase().includes("github")
  );

  const browserSocial = featuredSocials.find(
    (social) =>
      social.name.toLowerCase().includes("browser") ||
      social.name.toLowerCase().includes("web")
  );

  if (loading) {
    return (
      <div className="container mx-auto px-2 sm:px-4 py-8 space-y-12 overflow-x-hidden">
        <Helmet>
          <title>{name} - Projects</title>
        </Helmet>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <ProjectCardSkeleton key={i} />
          ))}
        </div>
        {/* Footer */}
        <footer className="mt-12 pt-6 border-t">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-foreground/60">
                © {new Date().getFullYear()} All rights reserved
              </p>
              <div className="flex gap-4">
                {featuredSocials.map((social: FeaturedSocial) => (
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
                      className="w-6 h-6 transition-all"
                      onError={(e) => {
                        console.error(
                          `Error loading icon for ${social.name}:`,
                          e
                        );
                      }}
                    />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-2 sm:px-4 py-8 space-y-12 overflow-x-hidden">
        <Helmet>
          <title>{name} - Projects</title>
        </Helmet>
        <div className="text-red-500 text-center">Error: {error}</div>
        {/* Footer */}
        <footer className="mt-12 pt-6 border-t">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-foreground/60">
                © {new Date().getFullYear()} All rights reserved
              </p>
              <div className="flex gap-4">
                {featuredSocials.map((social: FeaturedSocial) => (
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
                      className="w-6 h-6 transition-all"
                      onError={(e) => {
                        console.error(
                          `Error loading icon for ${social.name}:`,
                          e
                        );
                      }}
                    />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-2 sm:px-4 py-8 space-y-12 overflow-x-hidden">
      <Helmet>
        <title>{name} - Projects</title>
      </Helmet>
      {/* Filters */}
      <div className="mb-8 flex flex-wrap gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <FaFilter className="w-4 h-4" />
              Skills
              {selectedLanguages.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {selectedLanguages.length}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className="w-56 max-h-[300px] overflow-y-auto"
          >
            <DropdownMenuLabel>Skills</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {availableLanguages.map((language: string) => (
              <DropdownMenuItem
                key={language}
                onSelect={(event: Event) => {
                  event.preventDefault();
                  handleLanguageToggle(language);
                }}
              >
                <span className="w-4 h-4 mr-2">
                  {selectedLanguages.includes(language) && (
                    <Check className="w-4 h-4" />
                  )}
                </span>
                {language}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <FaFilter className="w-4 h-4" />
              Project Types
              {selectedProjectTypes.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {selectedProjectTypes.length}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className="w-56 max-h-[300px] overflow-y-auto"
          >
            <DropdownMenuLabel>Project Types</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {availableProjectTypes.map((type: string) => (
              <DropdownMenuItem
                key={type}
                onSelect={(event: Event) => {
                  event.preventDefault();
                  handleProjectTypeToggle(type);
                }}
              >
                <span className="w-4 h-4 mr-2">
                  {selectedProjectTypes.includes(type) && (
                    <Check className="w-4 h-4" />
                  )}
                </span>
                {type}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {(selectedLanguages.length > 0 || selectedProjectTypes.length > 0) && (
          <Button
            variant="ghost"
            onClick={() => {
              dispatch(setSelectedLanguages([]));
              dispatch(setSelectedProjectTypes([]));
            }}
            className="text-muted-foreground"
          >
            Clear filters
          </Button>
        )}
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project: Project) => (
          <div
            key={project._id}
            className="border rounded-lg overflow-hidden shadow-sm"
          >
            <img
              src={project.iconImage}
              alt={project.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4 space-y-4">
              <div>
                <h3 className="text-xl font-semibold">{project.title}</h3>
                <p className="text-sm text-foreground/60">
                  {formatDate(project.startDate)} -{" "}
                  {project.currentlyWorking
                    ? "Present"
                    : formatDate(project.endDate)}
                </p>
              </div>

              <div className="prose dark:prose-invert">
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
                    className="text-blue-500 hover:underline"
                  >
                    {expandedDescriptions[project._id]
                      ? "Show less"
                      : "Read more"}
                  </button>
                )}
              </div>

              {project.specialNote && (
                <div className="bg-accent/50 p-3 rounded-md">
                  <ReactMarkdown>{project.specialNote}</ReactMarkdown>
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                {project.programmingLanguages.map((lang: string) => (
                  <Badge key={lang} variant="secondary">
                    {lang}
                  </Badge>
                ))}
              </div>

              <div className="flex justify-end gap-4">
                <a
                  href={project.githubRepo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground/60 hover:text-foreground transition-colors"
                >
                  {githubSocial ? (
                    <img
                      src={getThemeBasedIconUrl(githubSocial)}
                      alt="GitHub"
                      className="w-6 h-6 transition-all"
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
                    {browserSocial ? (
                      <img
                        src={getThemeBasedIconUrl(browserSocial)}
                        alt="Live Website"
                        className="w-6 h-6 transition-all"
                      />
                    ) : (
                      <FaGlobe className="w-6 h-6" />
                    )}
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <footer className="mt-12 pt-6 border-t">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-foreground/60">
              © {new Date().getFullYear()} All rights reserved
            </p>
            <div className="flex gap-4">
              {featuredSocials.map((social: FeaturedSocial) => (
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
                    className="w-6 h-6 transition-all"
                    onError={(e) => {
                      console.error(
                        `Error loading icon for ${social.name}:`,
                        e
                      );
                    }}
                  />
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Projects;
