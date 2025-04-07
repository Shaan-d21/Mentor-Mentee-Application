import React, { useState } from 'react';
import { Listbox } from '@headlessui/react';
import { ChevronUpDownIcon } from '@heroicons/react/20/solid';

const mentees = [
  {
    id: 1,
    name: "Krupa Vyas",
    domains: ["Data Science", "Machine Learning", "Web Development"]
  },
  {
    id: 2,
    name: "Arjun Patel",
    domains: ["Artificial Intelligence", "Cloud Computing", "DevOps"]
  },
  {
    id: 3,
    name: "Priya Sharma",
    domains: ["Cybersecurity", "Blockchain", "Mobile Development"]
  }
];

const domainTopics = {
  "Data Science": [
    "1. Foundational Mathematics (Linear Algebra, Calculus, Probability & Statistics)",
    "2. Programming Fundamentals (Python, R, or both)",
    "3. Data Structures and Algorithms",
    "4. Data Wrangling and Cleaning (using Pandas, or equivalent)",
    "5. Exploratory Data Analysis (EDA) techniques",
    "6. Data Visualization (using Matplotlib, Seaborn, or equivalent)",
    "7. SQL and Database Management",
    "8. Statistical Analysis and Hypothesis Testing",
    "9. Machine Learning Basics",
    "10. Supervised Learning Algorithms",
    "11. Unsupervised Learning Algorithms",
    "12. Feature Engineering and Selection",
    "13. Model Evaluation and Validation",
    "14. Time Series Analysis",
    "15. Natural Language Processing Basics",
    "16. Deep Learning Fundamentals",
    "17. Neural Networks and Deep Learning",
    "18. Big Data Technologies (Hadoop, Spark)",
    "19. Data Engineering Basics",
    "20. Cloud Platforms for Data Science",
    "21. Version Control and Git",
    "22. Data Ethics and Privacy",
    "23. Project Management for Data Science",
    "24. Communication and Data Storytelling",
    "25. Industry-Specific Applications"
  ],
  "Artificial Intelligence": [
    "1. Mathematics and Statistics Fundamentals",
    "2. Programming in Python",
    "3. Data Structures and Algorithms",
    "4. Machine Learning Basics",
    "5. Supervised Learning",
    "6. Unsupervised Learning",
    "7. Neural Networks Fundamentals",
    "8. Deep Learning Architectures",
    "9. Convolutional Neural Networks",
    "10. Recurrent Neural Networks",
    "11. Natural Language Processing",
    "12. Transformers and BERT",
    "13. Computer Vision",
    "14. Reinforcement Learning",
    "15. Generative AI",
    "16. AI Ethics and Bias",
    "17. Model Deployment and MLOps",
    "18. AI System Design",
    "19. Optimization Techniques",
    "20. Advanced Deep Learning",
    "21. AI Research Methods",
    "22. AI Project Management",
    "23. Industry Applications",
    "24. AI Safety and Security",
    "25. Future of AI and Emerging Trends"
  ],
  "Web Development": [
    "1. HTML5 Fundamentals",
    "2. CSS3 and Responsive Design",
    "3. JavaScript Basics",
    "4. Modern JavaScript (ES6+)",
    "5. Version Control with Git",
    "6. Frontend Frameworks (React)",
    "7. State Management",
    "8. Component Design Patterns",
    "9. CSS Frameworks (Tailwind)",
    "10. Web Performance Optimization",
    "11. Backend Development Basics",
    "12. RESTful APIs",
    "13. Database Design",
    "14. Authentication and Authorization",
    "15. Web Security Best Practices",
    "16. Testing Strategies",
    "17. CI/CD Pipelines",
    "18. Cloud Deployment",
    "19. Monitoring and Logging",
    "20. SEO Fundamentals",
    "21. Web Accessibility",
    "22. Progressive Web Apps",
    "23. TypeScript",
    "24. GraphQL",
    "25. Microservices Architecture"
  ],
  "Cloud Computing": [
    "1. Cloud Computing Fundamentals",
    "2. AWS/Azure/GCP Basics",
    "3. Virtual Machines and Containers",
    "4. Docker and Containerization",
    "5. Kubernetes Orchestration",
    "6. Cloud Storage Solutions",
    "7. Cloud Security",
    "8. Identity and Access Management",
    "9. Serverless Computing",
    "10. Cloud Networking",
    "11. Load Balancing",
    "12. Auto Scaling",
    "13. Cloud Databases",
    "14. Message Queues",
    "15. Microservices Architecture",
    "16. Cloud Monitoring",
    "17. Cost Optimization",
    "18. Disaster Recovery",
    "19. High Availability Design",
    "20. Cloud Migration Strategies",
    "21. DevOps in Cloud",
    "22. Infrastructure as Code",
    "23. Cloud Native Applications",
    "24. Multi-Cloud Strategies",
    "25. Edge Computing"
  ],
  "DevOps": [
    "1. Linux Fundamentals",
    "2. Shell Scripting",
    "3. Version Control (Git)",
    "4. CI/CD Concepts",
    "5. Jenkins Pipeline",
    "6. Docker Containers",
    "7. Kubernetes Orchestration",
    "8. Infrastructure as Code",
    "9. Terraform",
    "10. Ansible Automation",
    "11. Cloud Platforms (AWS/Azure)",
    "12. Monitoring Tools",
    "13. Log Management",
    "14. Security Practices",
    "15. Performance Tuning",
    "16. Database Management",
    "17. Network Fundamentals",
    "18. Microservices Architecture",
    "19. Service Mesh",
    "20. Configuration Management",
    "21. Continuous Testing",
    "22. DevSecOps",
    "23. Site Reliability Engineering",
    "24. Incident Management",
    "25. Agile Methodologies"
  ],
  "Cybersecurity": [
    "1. Security Fundamentals",
    "2. Network Security",
    "3. Operating System Security",
    "4. Cryptography",
    "5. Web Security",
    "6. Application Security",
    "7. Ethical Hacking",
    "8. Penetration Testing",
    "9. Malware Analysis",
    "10. Incident Response",
    "11. Digital Forensics",
    "12. Security Tools",
    "13. Cloud Security",
    "14. Mobile Security",
    "15. IoT Security",
    "16. Security Frameworks",
    "17. Risk Management",
    "18. Security Policies",
    "19. Compliance Standards",
    "20. Identity Management",
    "21. Security Architecture",
    "22. Threat Intelligence",
    "23. Security Operations",
    "24. Blockchain Security",
    "25. Zero Trust Security"
  ],
  "Blockchain": [
    "1. Blockchain Fundamentals",
    "2. Cryptography Basics",
    "3. Bitcoin Protocol",
    "4. Ethereum Platform",
    "5. Smart Contracts",
    "6. Solidity Programming",
    "7. Web3.js",
    "8. DApp Development",
    "9. Consensus Mechanisms",
    "10. Blockchain Architecture",
    "11. Cryptocurrency",
    "12. Token Standards",
    "13. DeFi Concepts",
    "14. NFT Development",
    "15. Chain Security",
    "16. Layer 2 Solutions",
    "17. Cross-chain Development",
    "18. Blockchain Testing",
    "19. Smart Contract Security",
    "20. Gas Optimization",
    "21. Blockchain Scalability",
    "22. Privacy Solutions",
    "23. Blockchain Governance",
    "24. Enterprise Blockchain",
    "25. Emerging Trends"
  ],
  "Mobile Development": [
    "1. Mobile UI Design",
    "2. Native Android Development",
    "3. Kotlin Programming",
    "4. iOS Development",
    "5. Swift Programming",
    "6. Cross-platform Development",
    "7. React Native",
    "8. Flutter Framework",
    "9. Mobile Architecture",
    "10. State Management",
    "11. API Integration",
    "12. Mobile Security",
    "13. Offline Storage",
    "14. Push Notifications",
    "15. App Performance",
    "16. Mobile Testing",
    "17. App Store Guidelines",
    "18. Analytics Integration",
    "19. Mobile CI/CD",
    "20. Responsive Design",
    "21. Mobile Authentication",
    "22. Location Services",
    "23. Mobile Payments",
    "24. App Optimization",
    "25. Mobile Best Practices"
  ],
  "Machine Learning": [
    "1. Math Prerequisites",
    "2. Python Programming",
    "3. Data Preprocessing",
    "4. Supervised Learning",
    "5. Unsupervised Learning",
    "6. Feature Engineering",
    "7. Model Selection",
    "8. Model Evaluation",
    "9. Neural Networks",
    "10. Deep Learning",
    "11. Computer Vision",
    "12. NLP Fundamentals",
    "13. Time Series Analysis",
    "14. Reinforcement Learning",
    "15. ML Algorithms",
    "16. ML Libraries",
    "17. Model Deployment",
    "18. MLOps",
    "19. Data Pipeline",
    "20. Hyperparameter Tuning",
    "21. Transfer Learning",
    "22. Ensemble Methods",
    "23. ML Ethics",
    "24. Production ML",
    "25. Research Methods"
  ]
};

function App() {
  const [selectedMentee, setSelectedMentee] = useState(mentees[0]);
  const [selectedDomain, setSelectedDomain] = useState(selectedMentee.domains[0]);
  const [roadmapGenerated, setRoadmapGenerated] = useState(false);
  const [topics, setTopics] = useState([]);

  const handleGenerateRoadmap = () => {
    setTopics(domainTopics[selectedDomain]);
    setRoadmapGenerated(true);
  };

  const handleAssignToMentee = () => {
    alert(`Roadmap assigned to ${selectedMentee.name} for ${selectedDomain}`);
    setRoadmapGenerated(false);
    setTopics([]);
  };

  // Update selected domain when mentee changes
  const handleMenteeChange = (mentee) => {
    setSelectedMentee(mentee);
    setSelectedDomain(mentee.domains[0]);
    setRoadmapGenerated(false);
    setTopics([]);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Roadmap Generator
          </h1>

          <div className="grid grid-cols-2 gap-6 mb-6">
            {/* Mentee Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mentee Name
              </label>
              <Listbox value={selectedMentee} onChange={handleMenteeChange}>
                <div className="relative mt-1">
                  <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left border focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                    <span className="block truncate">{selectedMentee.name}</span>
                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                      <ChevronUpDownIcon
                        className="h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                    </span>
                  </Listbox.Button>
                  <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-10">
                    {mentees.map((mentee) => (
                      <Listbox.Option
                        key={mentee.id}
                        value={mentee}
                        className={({ active }) =>
                          `relative cursor-default select-none py-2 pl-10 pr-4 ${
                            active ? 'bg-indigo-100 text-indigo-900' : 'text-gray-900'
                          }`
                        }
                      >
                        {mentee.name}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </div>
              </Listbox>
            </div>

            {/* Domain Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Domain Name
              </label>
              <Listbox 
                value={selectedDomain} 
                onChange={(domain) => {
                  setSelectedDomain(domain);
                  setRoadmapGenerated(false);
                  setTopics([]);
                }}
              >
                <div className="relative mt-1">
                  <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left border focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                    <span className="block truncate">{selectedDomain}</span>
                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                      <ChevronUpDownIcon
                        className="h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                    </span>
                  </Listbox.Button>
                  <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-10">
                    {selectedMentee.domains.map((domain) => (
                      <Listbox.Option
                        key={domain}
                        value={domain}
                        className={({ active }) =>
                          `relative cursor-default select-none py-2 pl-10 pr-4 ${
                            active ? 'bg-indigo-100 text-indigo-900' : 'text-gray-900'
                          }`
                        }
                      >
                        {domain}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </div>
              </Listbox>
            </div>
          </div>

          <div className="flex justify-center mb-6">
            <button
              onClick={handleGenerateRoadmap}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Generate Roadmap
            </button>
          </div>

          {roadmapGenerated && topics.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">List of Topics</h2>
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <ul className="space-y-2">
                  {topics.map((topic, index) => (
                    <li key={index} className="text-gray-700">{topic}</li>
                  ))}
                </ul>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleAssignToMentee}
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                >
                  Assign to Mentee
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;