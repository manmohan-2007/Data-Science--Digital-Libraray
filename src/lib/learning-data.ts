export const modules = [
  {
    id: "python",
    name: "Python for Data Science",
    description: "Build a strong foundation in Python, arrays, and working with data.",
    icon: "code",
    tone: "primary",
  },
  {
    id: "preprocessing",
    name: "Data Collection and Preprocessing",
    description: "Collect, clean, and transform real-world datasets for meaningful analysis.",
    icon: "database",
    tone: "sky",
  },
  {
    id: "analysis",
    name: "Exploratory Data Analysis",
    description:
      "Find patterns, investigate relationships, and understand the stories in your data.",
    icon: "chart",
    tone: "violet",
  },
  {
    id: "visualization",
    name: "Data Visualization",
    description: "Communicate your findings through clear, insightful charts and visualizations.",
    icon: "chart",
    tone: "amber",
  },
  {
    id: "machine-learning",
    name: "Machine Learning",
    description: "Train, evaluate, and compare models that learn from data.",
    icon: "brain",
    tone: "primary",
  },
] as const;
const titles = [
  "Python Data Analysis",
  "Numerical Computing with NumPy",
  "Data Manipulation with Pandas",
  "Data Collection & Cleaning",
  "Handling Missing Data",
  "Feature Engineering",
  "Exploratory Data Analysis",
  "Statistical Data Analysis",
  "Correlation & Regression",
  "Visualization with Matplotlib",
  "Advanced Visualization",
  "Interactive Data Dashboards",
  "Supervised Machine Learning",
  "Clustering & Classification",
  "Model Evaluation",
];
const descriptions = [
  "Explore Python techniques for loading, manipulating, and analyzing real-world datasets with confidence.",
  "Work with multidimensional arrays and discover fast, efficient numerical operations using NumPy.",
  "Transform raw data into meaningful insights with DataFrames and powerful Pandas operations.",
  "Collect real-world data and prepare clean, consistent datasets for your analysis.",
  "Identify incomplete records and explore strategies for handling missing values in datasets.",
  "Create meaningful features and prepare your data for machine learning workflows.",
  "Discover patterns, spot anomalies, and explore relationships through systematic data investigation.",
  "Understand distributions and apply statistical methods to answer questions about your data.",
  "Explore relationships between variables and build your first predictive regression models.",
  "Bring your data to life with expressive charts and publication-ready plots.",
  "Create insightful statistical visualizations and compare patterns across multiple variables.",
  "Build interactive visualizations that make complex datasets accessible and engaging.",
  "Train predictive models and explore practical supervised learning with Scikit-learn.",
  "Group similar observations and classify data using established machine learning algorithms.",
  "Compare model performance and choose suitable metrics for your prediction tasks.",
];
export const experiments = titles.map((title, i) => ({
  id: String(i + 1),
  number: String(i + 1).padStart(2, "0"),
  title,
  description: descriptions[i],
  module: modules[Math.floor(i / 3)] ?? modules[0],
  difficulty: i < 6 ? "Beginner" : i < 12 ? "Intermediate" : "Advanced",
  tools:
    i === 0
      ? ["Python", "Jupyter"]
      : i === 1
        ? ["NumPy", "Python"]
        : i < 9
          ? ["Pandas", "NumPy"]
          : i < 12
            ? ["Matplotlib", "Seaborn"]
            : ["Scikit-learn", "Python"],
}));
export const tools = [
  {
    name: "Python",
    category: "Programming",
    description: "The versatile language at the heart of data science.",
    url: "https://docs.python.org/3/",
  },
  {
    name: "Jupyter",
    category: "Programming",
    description: "Interactive notebooks for code, results, and research.",
    url: "https://docs.jupyter.org/",
  },
  {
    name: "Google Colab",
    category: "Programming",
    description: "Run Python notebooks in your browser.",
    url: "https://colab.research.google.com/",
  },
  {
    name: "NumPy",
    category: "Data Processing",
    description: "Powerful arrays and efficient numerical computing.",
    url: "https://numpy.org/doc/",
  },
  {
    name: "Pandas",
    category: "Data Processing",
    description: "Flexible tools for data manipulation and analysis.",
    url: "https://pandas.pydata.org/docs/",
  },
  {
    name: "Polars",
    category: "Data Processing",
    description: "Fast DataFrame operations for modern data workflows.",
    url: "https://docs.pola.rs/",
  },
  {
    name: "Matplotlib",
    category: "Visualization",
    description: "Create static, animated, and interactive visualizations.",
    url: "https://matplotlib.org/stable/",
  },
  {
    name: "Seaborn",
    category: "Visualization",
    description: "Statistical charts built on top of Matplotlib.",
    url: "https://seaborn.pydata.org/",
  },
  {
    name: "Plotly",
    category: "Visualization",
    description: "Interactive charts and scientific visualizations.",
    url: "https://plotly.com/python/",
  },
  {
    name: "Scikit-learn",
    category: "Machine Learning",
    description: "Accessible tools for predictive data analysis.",
    url: "https://scikit-learn.org/stable/",
  },
  {
    name: "XGBoost",
    category: "Machine Learning",
    description: "Efficient gradient boosting for structured data.",
    url: "https://xgboost.readthedocs.io/",
  },
  {
    name: "TensorFlow",
    category: "Deep Learning",
    description: "Build and train machine learning models at scale.",
    url: "https://www.tensorflow.org/learn",
  },
  {
    name: "Keras",
    category: "Deep Learning",
    description: "A clear, approachable API for neural networks.",
    url: "https://keras.io/",
  },
  {
    name: "PyTorch",
    category: "Deep Learning",
    description: "Flexible tensor computing and deep learning research.",
    url: "https://pytorch.org/docs/stable/",
  },
  {
    name: "MySQL",
    category: "Databases",
    description: "Organize structured data with relational databases.",
    url: "https://dev.mysql.com/doc/",
  },
  {
    name: "MongoDB",
    category: "Databases",
    description: "Store and query flexible document-based data.",
    url: "https://www.mongodb.com/docs/",
  },
  {
    name: "Git",
    category: "Development",
    description: "Track changes and collaborate on your projects.",
    url: "https://git-scm.com/doc",
  },
  {
    name: "GitHub",
    category: "Development",
    description: "Collaborate and share your data science projects.",
    url: "https://docs.github.com/",
  },
  {
    name: "VS Code",
    category: "Development",
    description: "An extensible editor for your code and notebooks.",
    url: "https://code.visualstudio.com/docs",
  },
  {
    name: "SciPy",
    category: "Data Processing",
    description: "Scientific algorithms for optimization and statistics.",
    url: "https://docs.scipy.org/doc/scipy/",
  },
];
export const student = {
  studentId: "24102A030169",
  name: "Manmohan",
  rollNumber: "24102A030169",
  branch: "Data Science",
  section: "DS - 3",
  faculty: {
    name: "Bosubabu",
    designation: "Assistant Professor",
  },
  github: "",
  linkedin: "",
};
export function pageHead(title: string, description: string) {
  return {
    meta: [
      { title: `${title} | MBU Data Science` },
      { name: "description", content: description },
      { property: "og:title", content: `${title} | MBU Data Science` },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  };
}
