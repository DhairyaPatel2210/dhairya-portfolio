import { Skeleton } from "@/components/ui/skeleton";

export function ProjectCardSkeleton() {
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="p-6 space-y-4">
        <div className="h-12 w-12 bg-muted-foreground/30 dark:bg-accent/20 rounded-full animate-pulse" />
        <div className="h-6 w-3/4 bg-muted-foreground/30 dark:bg-accent/20 rounded animate-pulse" />
        <div className="h-20 w-full bg-muted-foreground/30 dark:bg-accent/20 rounded animate-pulse" />
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-6 w-20 bg-muted-foreground/30 dark:bg-accent/20 rounded animate-pulse"
            />
          ))}
        </div>
        <div className="flex gap-4">
          <div className="h-9 w-24 bg-muted-foreground/30 dark:bg-accent/20 rounded animate-pulse" />
          <div className="h-9 w-24 bg-muted-foreground/30 dark:bg-accent/20 rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
}

export function ExperienceCardSkeleton() {
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="p-6 space-y-4">
        <div className="h-6 w-3/4 bg-muted-foreground/30 dark:bg-accent/20 rounded animate-pulse" />
        <div className="h-5 w-1/2 bg-muted-foreground/30 dark:bg-accent/20 rounded animate-pulse" />
        <div className="h-4 w-1/3 bg-muted-foreground/30 dark:bg-accent/20 rounded animate-pulse" />
        <div className="h-24 w-full bg-muted-foreground/30 dark:bg-accent/20 rounded animate-pulse" />
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-6 w-20 bg-muted-foreground/30 dark:bg-accent/20 rounded animate-pulse"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export function EducationCardSkeleton() {
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="p-6 space-y-4">
        <div className="h-6 w-3/4 bg-muted-foreground/30 dark:bg-accent/20 rounded animate-pulse" />
        <div className="h-5 w-1/2 bg-muted-foreground/30 dark:bg-accent/20 rounded animate-pulse" />
        <div className="h-4 w-1/3 bg-muted-foreground/30 dark:bg-accent/20 rounded animate-pulse" />
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-6 w-24 bg-muted-foreground/30 dark:bg-accent/20 rounded animate-pulse"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export function ContactSkeleton() {
  return (
    <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
      {/* Contact Form Loading */}
      <div className="space-y-6 order-2 md:order-1">
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="h-4 w-1/4 bg-muted-foreground/30 dark:bg-accent/20 rounded animate-pulse" />
              <div className="h-10 w-full bg-muted-foreground/30 dark:bg-accent/20 rounded animate-pulse" />
            </div>
            <div className="space-y-2">
              <div className="h-4 w-1/4 bg-muted-foreground/30 dark:bg-accent/20 rounded animate-pulse" />
              <div className="h-10 w-full bg-muted-foreground/30 dark:bg-accent/20 rounded animate-pulse" />
            </div>
            <div className="space-y-2">
              <div className="h-4 w-1/4 bg-muted-foreground/30 dark:bg-accent/20 rounded animate-pulse" />
              <div className="h-32 w-full bg-muted-foreground/30 dark:bg-accent/20 rounded animate-pulse" />
            </div>
            <div className="h-10 w-full bg-muted-foreground/30 dark:bg-accent/20 rounded animate-pulse" />
          </div>
        </div>
      </div>

      {/* Socials Loading */}
      <div className="space-y-6 order-1 md:order-2">
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <div className="h-6 w-1/3 bg-muted-foreground/30 dark:bg-accent/20 rounded animate-pulse mb-6" />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="flex flex-col items-center gap-2 p-4">
                <div className="h-8 w-8 bg-muted-foreground/30 dark:bg-accent/20 rounded animate-pulse" />
                <div className="h-4 w-16 bg-muted-foreground/30 dark:bg-accent/20 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
