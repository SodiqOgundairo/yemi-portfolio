export type ProjectCategory = "ui" | "graphics" | "web" | "all";

export interface Project {
  id: string;
  title: string;
  category: ProjectCategory[]; // Can belong to multiple, though current data implies one
  thumbnailUrl: string; // For the card
  imageUrl: string; // For the modal lightbox (often same as thumbnail or a larger version)
  description: string;
  technologies: string[];
  projectUrl?: string; // Live site or Behance/GitHub
  moreDetailsUrl?: string; // e.g., specific Behance page or Google Drive for graphics
  client?: string; // Optional
  date?: string; // Optional
}

const GITHUB_IMG_BASE_URL = "https://raw.githubusercontent.com/SodiqOgundairo/portfolio/main/assets/img/portfolio/";

export const projectsData: Project[] = [
  {
    id: "akha",
    title: "AKHA FOUNDATION",
    category: ["web"],
    thumbnailUrl: `${GITHUB_IMG_BASE_URL}akha-x.png`,
    imageUrl: `${GITHUB_IMG_BASE_URL}akha.png`,
    description: "A static page website for an NGO foundation.",
    technologies: ["HTML", "CSS", "Tailwind CSS", "JavaScript"],
    projectUrl: "https://akha-1011.web.app",
  },
  {
    id: "eventx-ui",
    title: "EVENTX UI Design",
    category: ["ui"],
    thumbnailUrl: `${GITHUB_IMG_BASE_URL}eventX0-x.png`,
    imageUrl: `${GITHUB_IMG_BASE_URL}eventX0.png`,
    description: "The User Interface Design for an event management application where event organizers can upload their events and visitors can come to book such events.",
    technologies: ["Figma"],
    projectUrl: "https://behance.net/gr8QMgenesis",
  },
  {
    id: "beerpoint",
    title: "Beer Point",
    category: ["web"],
    thumbnailUrl: `${GITHUB_IMG_BASE_URL}beer-point-mclamba-x.png`,
    imageUrl: `${GITHUB_IMG_BASE_URL}beer-point-mclamba.png`,
    description: "A website for a liquor store where clients can view the wares of the store.",
    technologies: ["HTML", "CSS", "Tailwind CSS", "JavaScript"],
    projectUrl: "https://mclamba-gr8qm.web.app",
  },
  {
    id: "ezra-footwears",
    title: "Ezra Footwears Graphics",
    category: ["graphics"],
    thumbnailUrl: `${GITHUB_IMG_BASE_URL}ezraFootwears.png`, // Assuming -x version doesn't exist or is same
    imageUrl: `${GITHUB_IMG_BASE_URL}ezraFootwears.png`,
    description: "Creatives designed for a footwear company.",
    technologies: ["CorelDraw", "Adobe Photoshop"],
    moreDetailsUrl: "https://bit.ly/OgundairoSodiqPortfolio", // General graphics portfolio
  },
  {
    id: "agrotech-graphics",
    title: "Microsoft AgroTech Hackathon Graphics",
    category: ["graphics"],
    thumbnailUrl: `${GITHUB_IMG_BASE_URL}AgroTechv4.png`,
    imageUrl: `${GITHUB_IMG_BASE_URL}AgroTechv4.png`,
    description: "Creatives designed for Microsoft Hackathon competition.",
    technologies: ["CorelDraw", "Adobe Photoshop"],
    moreDetailsUrl: "https://bit.ly/OgundairoSodiqAgroTech",
  },
  {
    id: "freshpick-graphics",
    title: "Fresh Pick Mart Ad",
    category: ["graphics"],
    thumbnailUrl: `${GITHUB_IMG_BASE_URL}freshpickad.png`,
    imageUrl: `${GITHUB_IMG_BASE_URL}freshpickad.png`,
    description: "Advertisement creative for Fresh Pick Mart.",
    technologies: ["CorelDraw", "Adobe Photoshop"],
    moreDetailsUrl: "https://bit.ly/OgundairoSodiqPortfolio",
  },
  {
    id: "lightlife-church-vue",
    title: "LightLife Church (Vue)",
    category: ["web"],
    thumbnailUrl: `${GITHUB_IMG_BASE_URL}lightlife-x.png`,
    imageUrl: `${GITHUB_IMG_BASE_URL}lightlife.png`,
    description: "A SPA web application for a church where information about the church is made available and an admin dashboard is made available for the church to upload weekly /monthly programmes.",
    technologies: ["VueJS"], // Add more if known, e.g., Firebase, Vuetify
    projectUrl: "https://lightlife-church.web.app",
  },
  {
    id: "servex-ui",
    title: "Servex Mobile App UI",
    category: ["ui"],
    thumbnailUrl: `${GITHUB_IMG_BASE_URL}servex-x.png`,
    imageUrl: `${GITHUB_IMG_BASE_URL}servex.png`,
    description: "The User Interface Design for a payment gateway which offers management of bank accounts for users simultaneously.",
    technologies: ["Figma"],
    projectUrl: "https://behance.net/gr8QMgenesis",
  },
  {
    id: "milares-events-graphics",
    title: "Milare's Events Graphics",
    category: ["graphics"],
    thumbnailUrl: `${GITHUB_IMG_BASE_URL}MILARE's-x.jpg`,
    imageUrl: `${GITHUB_IMG_BASE_URL}MILARE's.jpg`,
    description: "Branding and event creatives for Milare's Events.",
    technologies: ["CorelDraw", "Adobe Photoshop"],
    moreDetailsUrl: "https://bit.ly/OgundairoSodiqPortfolio",
  },
  {
    id: "eventx-web",
    title: "EventX Management Software (Web)",
    category: ["web"],
    thumbnailUrl: `${GITHUB_IMG_BASE_URL}eventX1-x.png`,
    imageUrl: `${GITHUB_IMG_BASE_URL}eventX1.png`,
    description: "A SPA web application where event organizers upload their events and visitors can view and also make reservations by redirecting them to a paystack payment gateway for the paid events. (Under construction, check GitHub).",
    technologies: ["VueJS"], // Add more if known
    projectUrl: "https://eventX.netlify.app", // Link to GitHub if site is down
    moreDetailsUrl: "https://github.com/SodiqOgundairo",
  },
  {
    id: "vacancy-graphics",
    title: "Vacancy Ad Graphic",
    category: ["graphics"],
    thumbnailUrl: `${GITHUB_IMG_BASE_URL}hire-x.jpg`,
    imageUrl: `${GITHUB_IMG_BASE_URL}hire.jpg`,
    description: "A graphic design for a vacancy announcement.",
    technologies: ["CorelDraw", "Adobe Photoshop"],
    moreDetailsUrl: "https://bit.ly/OgundairoSodiqPortfolio",
  },
  {
    id: "lightlife-flyer-graphics",
    title: "Lightlife Church Flyer",
    category: ["graphics"],
    thumbnailUrl: `${GITHUB_IMG_BASE_URL}JULY22-x.png`,
    imageUrl: `${GITHUB_IMG_BASE_URL}JULY22.png`,
    description: "Promotional flyer for Lightlife Church event.",
    technologies: ["CorelDraw", "Adobe Photoshop"],
    moreDetailsUrl: "https://bit.ly/OgundairoSodiqPortfolio",
  },
  {
    id: "ruffwal-web",
    title: "Ruffwal Website",
    category: ["web"],
    thumbnailUrl: `${GITHUB_IMG_BASE_URL}ruffwal-x.png`,
    imageUrl: `${GITHUB_IMG_BASE_URL}ruffwal.png`,
    description: "A website for a software management company carefully designed with the product of the company at heart.",
    technologies: ["HTML", "CSS", "Tailwind CSS", "JavaScript"],
    projectUrl: "https://www.ruffwal.com",
  },
  {
    id: "tedprime-event-graphics",
    title: "TedPrime Hub Event Graphics",
    category: ["graphics"],
    thumbnailUrl: `${GITHUB_IMG_BASE_URL}NewTrends-x.png`,
    imageUrl: `${GITHUB_IMG_BASE_URL}NewTrends.png`,
    description: "Event graphics for TedPrime Hub.",
    technologies: ["CorelDraw", "Adobe Photoshop"],
    moreDetailsUrl: "https://bit.ly/OgundairoSodiqPortfolio",
  },
  {
    id: "yomfield-flyer-graphics",
    title: "Yomfield Flyer",
    category: ["graphics"],
    thumbnailUrl: `${GITHUB_IMG_BASE_URL}YOMFIELDCOLOR-x.jpg`,
    imageUrl: `${GITHUB_IMG_BASE_URL}YOMFIELDCOLOR.jpg`,
    description: "Promotional flyer design for Yomfield.",
    technologies: ["CorelDraw", "Adobe Photoshop"],
    moreDetailsUrl: "https://bit.ly/OgundairoSodiqPortfolio",
  },
];

export const portfolioCategories: { name: string; id: ProjectCategory }[] = [
  { name: "All", id: "all" },
  { name: "UI Design", id: "ui" },
  { name: "Graphics Design", id: "graphics" },
  { name: "Web Applications", id: "web" },
];
