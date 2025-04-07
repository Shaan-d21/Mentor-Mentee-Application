import React, { useState } from 'react';
import { ChevronRight, Code2, Database, Globe } from 'lucide-react';

interface RoadmapSection {
  title: string;
  topics: string[];
}

interface Mentor {
  name: string;
  sections: RoadmapSection[];
}

function App() {
  const [selectedSection, setSelectedSection] = useState<string | null>(null);

  const mentor: Mentor = {
    name: "Krupa Vyas",
    sections: [
      {
        title: "Data Science Track",
        topics: [
          "Foundational Mathematics (Linear Algebra, Calculus, Probability & Statistics)",
          "Programming Fundamentals (Python, R, or both)",
          "Data Structures and Algorithms",
          "Data Wrangling and Cleaning (using Pandas, or equivalent)",
          "Exploratory Data Analysis (EDA) techniques",
          "Data Visualization (using Matplotlib, Seaborn, or equivalent)",
          "SQL and Database Management",
          "Statistical Analysis and Hypothesis Testing",
          "Machine Learning Basics",
          "Supervised Learning Algorithms",
          "Unsupervised Learning Algorithms",
          "Feature Engineering and Selection",
          "Model Evaluation and Validation",
          "Time Series Analysis",
          "Natural Language Processing Basics",
          "Deep Learning Fundamentals",
          "Neural Networks and Deep Learning",
          "Big Data Technologies (Hadoop, Spark)",
          "Data Engineering Basics",
          "Cloud Platforms for Data Science",
          "Version Control and Git",
          "Data Ethics and Privacy",
          "Project Management for Data Science",
          "Communication and Data Storytelling",
          "Industry-Specific Applications"
        ]
      },
      {
        title: "Machine Learning Track",
        topics: [
          "Math Prerequisites",
          "Python Programming",
          "Data Preprocessing",
          "Supervised Learning",
          "Unsupervised Learning",
          "Feature Engineering",
          "Model Selection",
          "Model Evaluation",
          "Neural Networks",
          "Deep Learning",
          "Computer Vision",
          "NLP Fundamentals",
          "Time Series Analysis",
          "Reinforcement Learning",
          "ML Algorithms",
          "ML Libraries",
          "Model Deployment",
          "MLOps",
          "Data Pipeline",
          "Hyperparameter Tuning",
          "Transfer Learning",
          "Ensemble Methods",
          "ML Ethics",
          "Production ML",
          "Research Methods"
        ]
      },
      {
        title: "Web Development Track",
        topics: [
          "HTML5 Fundamentals",
          "CSS3 and Responsive Design",
          "JavaScript Basics",
          "Modern JavaScript (ES6+)",
          "Version Control with Git",
          "Frontend Frameworks (React)",
          "State Management",
          "Component Design Patterns",
          "CSS Frameworks (Tailwind)",
          "Web Performance Optimization",
          "Backend Development Basics",
          "RESTful APIs",
          "Database Design",
          "Authentication and Authorization",
          "Web Security Best Practices",
          "Testing Strategies",
          "CI/CD Pipelines",
          "Cloud Deployment",
          "Monitoring and Logging",
          "SEO Fundamentals",
          "Web Accessibility",
          "Progressive Web Apps",
          "TypeScript",
          "GraphQL",
          "Microservices Architecture"
        ]
      }
    ]
  };

  const getTrackIcon = (title: string) => {
    switch (title) {
      case "Data Science Track":
        return <Database className="w-6 h-6 text-purple-500" />;
      case "Machine Learning Track":
        return <Code2 className="w-6 h-6 text-green-500" />;
      case "Web Development Track":
        return <Globe className="w-6 h-6 text-blue-500" />;
      default:
        return <Globe className="w-6 h-6 text-gray-500" />;
    }
  };

  if (selectedSection) {
    const section = mentor.sections.find(s => s.title === selectedSection);
    if (!section) return null;

    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <button 
            onClick={() => setSelectedSection(null)}
            className="mb-6 text-blue-600 hover:text-blue-800 flex items-center"
          >
            ← Back to Tracks
          </button>
          
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-4 mb-8">
              {getTrackIcon(section.title)}
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{section.title}</h1>
                <p className="text-gray-600">Mentor: {mentor.name}</p>
              </div>
            </div>

            <div className="space-y-8">
              <div>
                <h2 className="text-xl font-semibold mb-4">Learning Roadmap</h2>
                <div className="space-y-4">
                  {section.topics.map((topic, index) => (
                    <div 
                      key={index}
                      className="flex items-center p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                    >
                      <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                        {index + 1}
                      </div>
                      <p className="text-gray-800">{topic}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-blue-600">K</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{mentor.name}</h1>
              <p className="text-gray-600">Full Stack Technical Mentor</p>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {mentor.sections.map((section, index) => (
            <div 
              key={index}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center gap-4 mb-4">
                {getTrackIcon(section.title)}
                <h2 className="text-xl font-semibold text-gray-900">{section.title}</h2>
              </div>
              
              <p className="text-gray-600 mb-4">{section.topics.length} topics</p>
              
              <button
                onClick={() => setSelectedSection(section.title)}
                className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                View Roadmap
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;