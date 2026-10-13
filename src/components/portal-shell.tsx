import { Link } from "@tanstack/react-router";
import { useState, type ReactNode, type ChangeEvent } from "react";
import {
  GraduationCap,
  Home,
  BookOpen,
  FlaskConical,
  Wrench,
  Github,
  Linkedin,
  Menu,
  X,
  ArrowUpRight,
  UserRound,
  Camera,
  FileText,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { student } from "@/lib/learning-data";

const navigation = [
  { to: "/" as const, label: "Home", icon: Home },
  { to: "/modules" as const, label: "Modules", icon: BookOpen },
  { to: "/experiments" as const, label: "Experiments", icon: FlaskConical },
  { to: "/tools" as const, label: "Tools", icon: Wrench },
  { to: "/materials" as const, label: "Materials", icon: FileText },
];

const PROFILE_IMAGE_KEY = "mbu-student-profile-image";

export function PortalShell({ children }: { children: ReactNode }) {
  const [menu, setMenu] = useState(false);

  // Load the previously saved image when the portal opens.
  const [profileImage, setProfileImage] = useState<string>(() => {
    try {
      return localStorage.getItem(PROFILE_IMAGE_KEY) || "";
    } catch {
      return "";
    }
  });

  const [imageError, setImageError] = useState("");

  // Select an image and save it for future visits.
  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setImageError("Please select a valid image.");
      event.target.value = "";
      return;
    }

    // Keep the image small enough for browser storage.
    if (file.size > 1.5 * 1024 * 1024) {
      setImageError("Please select an image smaller than 1.5 MB.");
      event.target.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result !== "string") {
        setImageError("Unable to read the selected image.");
        return;
      }

      try {
        localStorage.setItem(PROFILE_IMAGE_KEY, reader.result);
        setProfileImage(reader.result);
        setImageError("");
      } catch {
        setImageError("Storage is full. Please choose a smaller image.");
      }
    };

    reader.onerror = () => {
      setImageError("Unable to read the selected image.");
    };

    reader.readAsDataURL(file);
    event.target.value = "";
  };

  // Remove the saved image if needed.
  const handleRemoveImage = () => {
    try {
      localStorage.removeItem(PROFILE_IMAGE_KEY);
      setProfileImage("");
      setImageError("");
    } catch {
      setImageError("Unable to remove the saved image.");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="portal-header">
        <div className="mx-auto flex h-full max-w-[1536px] items-center justify-between gap-4 px-5 lg:px-8">
          <Link to="/" className="flex items-center gap-3">
            <span className="university-mark bg-white px-1.5">
              <img
                src="/mbu-logo.svg"
                alt="Mohan Babu University logo"
                className="h-10 w-10 object-contain"
              />
            </span>

            <span>
              <span className="block font-display text-sm font-semibold sm:text-base">
                MOHAN BABU UNIVERSITY
              </span>
              <span className="mt-1 block text-[9px] font-medium tracking-[1.5px] text-muted-foreground sm:text-[10px]">
                DATA SCIENCE LEARNING PORTAL
              </span>
            </span>
          </Link>

          <nav className="portal-nav" aria-label="Main navigation">
            {navigation.map((n) => (
              <Link to={n.to} key={n.to} activeOptions={{ exact: n.to === "/" }}>
                <n.icon size={15} />
                {n.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <span className="hidden items-center gap-1.5 text-[10px] text-muted-foreground xl:flex">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              STUDENT PORTAL
            </span>

            {/* Small profile image in the header */}
            <div className="h-9 w-9 overflow-hidden rounded-full border border-border bg-accent">
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="Student profile"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="grid h-full w-full place-items-center text-sm text-primary">M</div>
              )}
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="sm:hidden"
              aria-label={menu ? "Close menu" : "Open menu"}
              onClick={() => setMenu(!menu)}
            >
              {menu ? <X /> : <Menu />}
            </Button>
          </div>
        </div>
      </header>

      {menu && (
        <nav className="flex flex-wrap justify-center gap-5 border-b border-border bg-card p-4 sm:hidden">
          {navigation.map((n) => (
            <Link
              to={n.to}
              key={n.to}
              onClick={() => setMenu(false)}
              className="text-sm text-muted-foreground"
            >
              {n.label}
            </Link>
          ))}
        </nav>
      )}

      <div className="portal-layout">
        <aside className="student-sidebar">
          <div className="flex items-center justify-between">
            <p className="sidebar-label">Student profile</p>
            <UserRound size={13} className="text-muted-foreground" />
          </div>

          {/* Profile image upload section */}
          <div className="mb-7 mt-6 flex flex-col items-center">
            <label
              htmlFor="profile-image-upload"
              className="group relative cursor-pointer"
              title="Click to upload or change your profile picture"
            >
              <div className="profile-avatar overflow-hidden">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt={`${student.name}'s profile`}
                    className="h-full w-full rounded-full object-cover"
                  />
                ) : (
                  <span>M</span>
                )}
              </div>

              {/* Camera icon overlay */}
              <span className="absolute bottom-0 right-0 grid h-8 w-8 place-items-center rounded-full border-2 border-background bg-primary text-primary-foreground shadow-sm transition-transform group-hover:scale-110">
                <Camera size={15} />
              </span>
            </label>

            <input
              id="profile-image-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />

            <p className="mt-2 text-[10px] text-muted-foreground">
              Click photo to upload or change
            </p>

            {profileImage && (
              <button
                type="button"
                onClick={handleRemoveImage}
                className="mt-1 text-[10px] text-destructive hover:underline"
              >
                Remove photo
              </button>
            )}

            {imageError && (
              <p role="alert" className="mt-2 text-center text-xs text-destructive">
                {imageError}
              </p>
            )}

            <h2 className="mt-3 font-display text-xl font-medium">{student.name}</h2>

            <p className="mt-1 text-xs text-muted-foreground">Data Science Student</p>

            <span className="mt-3 rounded border border-primary/20 bg-accent px-2.5 py-1 text-[9px] font-medium text-primary">
              UNDERGRADUATE
            </span>
          </div>

          <dl className="space-y-5">
            {[
              ["Student mail", `${student.rollNumber}@mbu.asia`],
              ["Roll Number", student.rollNumber],
              ["Branch", student.branch],
              ["Section", student.section],
            ].map(([label, value]) => (
              <div key={label}>
                <dt className="text-[10px] text-muted-foreground">{label}</dt>
                <dd
                  className={`mt-1 text-xs ${
                    value === "Not provided" ? "text-muted-foreground" : "text-foreground"
                  }`}
                >
                  {value}
                </dd>
              </div>
            ))}
          </dl>

          <div className="my-6 border-t border-border" />

          <p className="sidebar-label">Faculty</p>
          <p className="mt-3 text-xs text-muted-foreground">{student.faculty.name}</p>
          <p className="mt-1 text-[10px] text-muted-foreground">{student.faculty.designation}</p>

          <div className="mt-5 flex gap-2">
            <Button
              variant="outline"
              size="icon"
              asChild
              title="GitHub profile"
              aria-label="GitHub profile"
            >
              <a
                href="https://github.com/YOUR_GITHUB_USERNAME"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github size={18} />
              </a>
            </Button>

            <Button
              variant="outline"
              size="icon"
              asChild
              title="LinkedIn profile"
              aria-label="LinkedIn profile"
            >
              <a
                href="https://www.linkedin.com/in/YOUR_LINKEDIN_USERNAME/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Linkedin size={18} />
              </a>
            </Button>
          </div>

          {/* <div className="mt-5 flex gap-2">
            <Button
              variant="outline"
              size="icon"
              disabled
              title="GitHub profile not provided"
              aria-label="GitHub profile not provided"
            >
              <Github />
            </Button>

            <Button
              variant="outline"
              size="icon"
              disabled
              title="LinkedIn profile not provided"
              aria-label="LinkedIn profile not provided"
            >
              <Linkedin />
            </Button>
          </div> */}

          <div className="my-7 border-t border-border" />

          <p className="sidebar-label">Your workspace</p>

          <div className="mt-3 space-y-1">
            {navigation.slice(1).map((n) => (
              <Link
                key={n.to}
                to={n.to}
                className="flex items-center justify-between rounded px-2 py-3 text-xs text-muted-foreground hover:bg-accent hover:text-primary"
              >
                <span className="flex items-center gap-3">
                  <n.icon size={15} />
                  {n.label}
                </span>
                <ArrowUpRight size={13} />
              </Link>
            ))}
          </div>

          <div className="mt-8 border-t border-border pt-6">
            <span className="flex items-center gap-2 text-xs text-foreground">
              <BookOpen size={14} className="text-primary" />
              Keep your curiosity alive.
            </span>
            <p className="mt-2 text-[10px] leading-relaxed text-muted-foreground">
              Every experiment is a step toward your next discovery.
            </p>
          </div>
        </aside>

        <main className="portal-main">
          {children}

          <footer className="mt-9 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-5 text-[10px] text-muted-foreground">
            <span>© 2026 Mohan Babu University</span>
            <span className="flex items-center gap-1.5">
              <GraduationCap size={13} />
              Learn. Experiment. Make an impact.
            </span>
          </footer>
        </main>
      </div>
    </div>
  );
}
