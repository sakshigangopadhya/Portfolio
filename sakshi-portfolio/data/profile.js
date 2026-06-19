export const profile = {
  name: "Sakshi Gangopadhya",
  tagline: "Translating statistical insight into operational advantage.",
  quote: "Chance favors the prepared mind.",
  quoteAuthor: "Louis Pasteur",
  location: "Pune, India",
  email: "gangopadhyasakshi@gmail.com",
  phone: "+91 85308 00899",
  linkedin: "https://www.linkedin.com/in/sakshi-gangopadhya/",
  github: "https://github.com/sakshigangopadhya",
  resume: "/Resume_Sakshi_Gongopadhya.pdf",
  status: "Open to Energy & Utilities consulting, BI, and technical sales roles",
};

export const about = {
  heading: "About",
  paragraphs: [
    "I work at the point where machine learning meets the people who have to act on it - building models that classify, predict, and explain, then translating what they find into something a stakeholder can actually use to make a decision.",
    "Most of my work has lived in that gap: a computer vision system that needed to prove its accuracy to funders, an outreach pipeline that needed to prove its ROI to a founder, a quantum computing club that needed to prove its relevance to research institutions. The technical part is half the job. Communicating it is the other half.",
  ],
};

export const skills = {
  heading: "Skills",
  groups: [
    {
      label: "Languages",
      items: [
        { name: "Python", slug: "python", level: 90 },
        { name: "R", slug: "r", level: 75 },
        { name: "Java", slug: "openjdk", level: 65 },
      ],
    },
    {
      label: "Machine Learning & AI",
      items: [
        { name: "PyTorch", slug: "pytorch", level: 88 },
        { name: "TensorFlow", slug: "tensorflow", level: 85 },
        { name: "Scikit-learn", slug: "scikitlearn", level: 92 },
        { name: "OpenCV", slug: "opencv", level: 86 },
        { name: "CNNs", slug: null, level: 90 },
        { name: "Image Processing", slug: null, level: 84 },
        { name: "Explainable AI", slug: null, level: 80 },
        { name: "Generative AI", slug: null, level: 72 },
      ],
    },
    {
      label: "Systems & IoT",
      items: [
        { name: "Embedded C", slug: "c", level: 70 },
        { name: "Arduino", slug: "arduino", level: 68 },
        { name: "Raspberry Pi", slug: "raspberrypi", level: 65 },
      ],
    },
    {
      label: "Business Intelligence",
      items: [
        { name: "Power BI", slug: "powerbi", level: 82 },
        { name: "Tableau", slug: "tableau", level: 78 },
        { name: "KPI Tracking", slug: null, level: 80 },
        { name: "Data Visualization", slug: null, level: 76 },
      ],
    },
    {
      label: "Platforms",
      items: [
        { name: "Git", slug: "git", level: 88 },
        { name: "GitHub", slug: "github", level: 86 },
        { name: "Google Cloud", slug: "googlecloud", level: 74 },
        { name: "RStudio", slug: "rstudio", level: 72 },
      ],
    },
    {
      label: "Business Development",
      items: [
        { name: "Outreach Automation", slug: null, level: 80 },
        { name: "Technical Sales", slug: null, level: 74 },
        { name: "Consulting", slug: null, level: 70 },
        { name: "SEO", slug: "semrush", level: 65 },
      ],
    },
  ],
};

export const experience = {
  heading: "Experience",
  roles: [
    {
      company: "LatentHQ",
      title: "Technical Intern",
      location: "Pune, India",
      period: "Aug 2025 - Apr 2026",
      points: [
        "Grew outreach to 100+ qualified prospects, directly contributing to new strategic partnerships in the AI/tech space.",
        "Designed and shipped automated outreach pipelines that cut manual lead-tracking effort by over 30%.",
        "Owned end-to-end production on 2+ podcast episodes, restructuring the workflow to cut turnaround time by ~30%.",
      ],
    },
  ],
};

export const projects = {
  heading: "Projects",
  items: [
    {
      slug: "metal-identification",
      title: "Metal Identification System",
      status: "In Progress",
      image: "/projects/MetalDetection.jpg",
      github: "https://github.com/sakshigangopadhya/Metal-Detection-code",
      description: "A computer vision system that identifies metal types from high-resolution imaging, built to hold up against structured test data. Secured Rs.4 lakh in funding on the strength of its early accuracy.",
      tags: [
        { name: "Python", slug: "python" },
        { name: "OpenCV", slug: "opencv" },
        { name: "Scikit-learn", slug: "scikitlearn" },
        { name: "CNN", slug: null },
      ],
      pipeline: [
        { label: "Input", detail: "High-res metallographic image captured via microscope camera" },
        { label: "Preprocessing", detail: "Resize to 224x224, normalize pixel values, augmentation" },
        { label: "Feature Extraction", detail: "EfficientNet-B0 extracts edges, texture, grain patterns" },
        { label: "Classification", detail: "Softmax layer outputs alloy class probabilities" },
        { label: "Output", detail: "Identified alloy type with confidence score in ~47ms" },
      ],
      caseStudy: {
        problem: "Manual metal sorting in the target environment was slow, inconsistent, and required specialist judgment that did not scale.",
        approach: "Trained a CNN on high-resolution imaging data, iterating on feature extraction until classification held up against structured test sets.",
        result: "Secured Rs.4 lakh in funding on the strength of early accuracy results. System currently in progress toward deployment.",
      },
    },
    {
      slug: "explainable-ai",
      title: "Explainable AI Models",
      status: "Completed",
      image: "/projects/ExplainableAi.jpg",
      github: null,
      description: "Classification and regression models built specifically to be interpretable - every prediction traceable across 10+ input features, tuned and validated rather than left as a black box.",
      tags: [
        { name: "Python", slug: "python" },
        { name: "Scikit-learn", slug: "scikitlearn" },
        { name: "Pandas", slug: "pandas" },
        { name: "NumPy", slug: "numpy" },
      ],
      pipeline: [
        { label: "Raw Data", detail: "Structured tabular dataset with 10+ input features" },
        { label: "Preprocessing", detail: "Normalization, encoding, train/test split" },
        { label: "Model Training", detail: "Classification/regression with Scikit-learn" },
        { label: "Explainability", detail: "SHAP values + feature importance analysis" },
        { label: "Output", detail: "Prediction with full feature-level audit trail" },
      ],
      caseStudy: {
        problem: "Stakeholders needed to trust model predictions enough to act on them, not just see an accuracy score.",
        approach: "Applied explainability techniques across 10+ input features, tuning and validating until predictions were both accurate and auditable.",
        result: "Delivered a model stakeholders could interrogate feature-by-feature, not just a score to take on faith.",
      },
    },
    {
      slug: "startup-dashboard",
      title: "Startup Evaluation Dashboard",
      status: "Completed",
      image: "/projects/StartupEvolution.jpg",
      github: null,
      description: "A scoring dashboard that turns 10+ raw startup metrics into an investment-readiness summary - built so a non-technical reviewer could act on it in minutes, not hours.",
      tags: [
        { name: "Python", slug: "python" },
        { name: "Scikit-learn", slug: "scikitlearn" },
        { name: "Explainable AI", slug: null },
      ],
      pipeline: [
        { label: "Input Metrics", detail: "10+ startup parameters: team, traction, market, financials" },
        { label: "Scoring Engine", detail: "ML model weights each parameter by investment relevance" },
        { label: "Explainability Layer", detail: "SHAP highlights which factors drive the score" },
        { label: "Summary Generation", detail: "Investment-readiness score with supporting rationale" },
        { label: "Dashboard Output", detail: "Visual summary reviewable in under 5 minutes" },
      ],
      caseStudy: {
        problem: "Evaluating startup readiness from raw metrics took manual analysis that did not scale across a pipeline of candidates.",
        approach: "Built a dashboard that processes 10+ input parameters into a single investment-readiness summary.",
        result: "Cut review time from hours to minutes per startup, with outputs aimed at non-technical reviewers.",
      },
    },
    {
      slug: "drone-pollination",
      title: "Drone-Based Pollination System",
      status: "Patent Filed - 202421044528",
      image: "/projects/DronePollenation.jpeg",
      github: null,
      description: "An automated drone system designed to pollinate low-fertility crops at scale - engineered from sensor integration upward, and far enough along to file a patent on the approach.",
      tags: [
        { name: "Embedded C", slug: "c" },
        { name: "Arduino", slug: "arduino" },
        { name: "Raspberry Pi", slug: "raspberrypi" },
      ],
      pipeline: [
        { label: "Sensor Input", detail: "Proximity and flower-detection sensors identify target zones" },
        { label: "Navigation", detail: "Microcontroller processes sensor data for flight path control" },
        { label: "Pollination Mechanism", detail: "Automated pollen dispersion triggered on target detection" },
        { label: "Coverage Tracking", detail: "System logs treated zones to avoid duplication" },
        { label: "Output", detail: "Scalable precision pollination at crop-field scale" },
      ],
      caseStudy: {
        problem: "Low-fertility crops need precision pollination at a scale manual methods cannot reach.",
        approach: "Designed an automated drone system from sensor integration upward, engineering for scalable precision delivery.",
        result: "The approach was novel enough to file a patent (202421044528) on the design.",
      },
    },
  ],
};

export const leadership = {
  heading: "Leadership",
  items: [
    {
      title: "Founder & Tech Lead, QQuest",
      description: "Built a quantum computing initiative from scratch and brought it into contact with people doing the real research - collaborating with scientists at TCG Crest, CDAC, and IISER.",
    },
  ],
};

export const contact = {
  heading: "Let's Connect",
  message: "Building something that sits at the intersection of data, systems, and real-world impact - I want to be in that conversation.",
};

