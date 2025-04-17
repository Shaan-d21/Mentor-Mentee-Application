// import axios from "axios";
// import { MMKV } from "react-native-mmkv";

// const storage = new MMKV();

// export const apiGetApprovedMentees = async () => {
//   const api = axios.create({
//     baseURL: "http://181.214.44.15:8080/", // Ensure this is set in your environment variables
//     headers: {
//       accept: "application/json",
//       token: storage.getString("token"), // Ensure the token is stored in MMKV
//     // token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmYWxndW5pIiwiaWQiOjQzLCJyb2xlIjoibWVudG9yIiwiZXhwIjoxNzQ1MjM2NjYyfQ.CBXntNG8fr6kPsU5dvWhQb-ELU1Rjo6rZSOrnBUwRqg"
//     },
//   });

//   try {
//     const response = await api.get("/mentor/get-approved-mentee");
//     console.log("Response from get-approved-mentee:", response);

//     if (response.status === 200) {
//       return response.data;
//     } else {
//       console.error("Unexpected response status:", response.status);
//       return { error: "Unexpected response from server", status: response.status };
//     }
//   } catch (error: any) {
//     console.error("Error fetching approved mentees:", error);
//     return { error: "Request failed", details: error };
//   }
// };

// export const  apiPostGenerateRoadMap=async (domainId:string,menteeId:string)=>{
//   const api = axios.create({
//     baseURL: "http://181.214.44.15:8003/",
//         headers: {
//       accept: "application/json",
//       token: storage.getString("token"), // Ensure the token is stored in MMKV
//     // token: " eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmYWxndW5pIiwiaWQiOjQzLCJyb2xlIjoibWVudG9yIiwiZXhwIjoxNzQ1MjM2NjYyfQ.CBXntNG8fr6kPsU5dvWhQb-ELU1Rjo6rZSOrnBUwRqg"
//     },
//   });

//   try {
//     const response = await api.post("/roadmaps/generate/",{
//       domain_id: domainId,
//       mentee_id: menteeId,
//     });
//     console.log("Response from get-approved-mentee:", response);

//     if (response.status === 200) {

//       return response.data;
//     } else {
//       console.error("Unexpected response status:", response.status);
//       return { error: "Unexpected response from server", status: response.status };
//     }
//   } catch (error: any) {
//     console.error("Error fetching approved mentees:", error);
//     return { error: "Request failed", details: error };
//   }

// };

// export const apiPostAssignRoadmap = async (menteeId:string,domainId:string,roadmapId:string) => {
//   const api = axios.create({
//     baseURL: "http://181.214.44.15:8080/", // Ensure this is set in your environment variables
//     headers: {
//       accept: "application/json",
//       token: storage.getString("token"), // Ensure the token is stored in MMKV
//       // token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmYWxndW5pIiwiaWQiOjQzLCJyb2xlIjoibWVudG9yIiwiZXhwIjoxNzQ1MjM2NjYyfQ.CBXntNG8fr6kPsU5dvWhQb-ELU1Rjo6rZSOrnBUwRqg",
//     },
//   });

//   try {
//     const data = {
//       "mentee_id": menteeId,
//       "domain_id": domainId,
//       "roadmap_id": roadmapId,
//     }
//     const response = await api.post("/mentor/assign-roadmap", data);
//     console.log("Response from assign-roadmap:", response);
// // return 1;
//     if (response.status === 200) {
//       return 1;
//     } else {
//       console.error("Unexpected response status:", response.status);
//       return 0;
//     }
//   } catch (error: any) {
//     console.error("Error assigning roadmap:", error);
//     return 0;
//   }
// };

//LATEST FIXED CODE -------------------------------------
import axios from "axios";
import { MMKV } from "react-native-mmkv";
const storage = new MMKV();

export const apiGetApprovedMentees = async () => {
  const api = axios.create({
    // baseURL: "http://181.214.44.15:8080/", // Ensure this is set in your environment variables
    baseURL: process.env.API_URL,
    headers: {
      accept: "application/json",
      token: storage.getString("token"), // Ensure the token is stored in MMKV
      // token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmYWxndW5pIiwiaWQiOjQzLCJyb2xlIjoibWVudG9yIiwiZXhwIjoxNzQ1MjM2NjYyfQ.CBXntNG8fr6kPsU5dvWhQb-ELU1Rjo6rZSOrnBUwRqg"
    },
  });
  try {
    const response = await api.get("/mentor/get-approved-mentee");
    console.log("Response from get-approved-mentee:", response);
    if (response.status === 200) {
      return response.data;
    } else {
      console.error("Unexpected response status:", response.status);
      return { error: "Unexpected response from server", status: response.status };
    }
  } catch (error: any) {
    console.error("Error fetching approved mentees:", error);
    return { error: "Request failed", details: error };
  }
};
export const apiPostGenerateRoadMap = async (domainId: string, menteeId: string) => {
  const api = axios.create({
    // baseURL: "http://181.214.44.15:8003/",
    baseURL: process.env.API_URL,
    headers: {
      accept: "application/json",
      token: storage.getString("token"), // Ensure the token is stored in MMKV
      // token: " eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmYWxndW5pIiwiaWQiOjQzLCJyb2xlIjoibWVudG9yIiwiZXhwIjoxNzQ1MjM2NjYyfQ.CBXntNG8fr6kPsU5dvWhQb-ELU1Rjo6rZSOrnBUwRqg"
    },
  });
  try {
    const response = await api.post("roadmaps/generate/", {
      domain_id: domainId,
      mentee_id: menteeId,
    });
    console.log("Response from get-approved-mentee:", response);
    if (response.status === 200) {
      //TODO: remove this return statement
      return JSON.stringify(
        {
          "status_code": 200,
          "message": "success",
          "roadmap_id": 1,
          "roadmap_explanation": "This personalized learning roadmap is tailored for a Data Science professional who is looking to deepen their expertise and advance their career.  It builds upon existing knowledge, focusing on practical application and industry best practices.  The progression emphasizes skills relevant to the specific needs of a data scientist in the real world, like model deployment and collaboration. The roadmap is adaptable and can be adjusted based on the mentee's specific interests and current skill level.  The roadmap focuses on building stronger data science practices by integrating advanced techniques.",
          "topics": [
            {
              "topic_id": 1,
              "name": "Advanced Statistical Modeling",
              "description": "This topic delves deeper into statistical methods for creating, analyzing and interpreting predictive models.",
              "subtopics": [
                "Generalized Linear Models",
                "Time Series Analysis",
                "Bayesian Methods"
              ],
              "importance": "Understanding advanced statistical methods is crucial for a Data Scientist to address complex problems, improve model accuracy and uncover hidden patterns, which is vital in developing highly effective predictive models in today's data-driven world.",
              "topic_status": "assigned"
            },
            {
              "topic_id": 2,
              "name": "Model Deployment and MLOps",
              "description": "Learn how to deploy machine learning models to production effectively.",
              "subtopics": [
                "Model Serving",
                "Cloud Platforms (AWS/Azure/GCP)",
                "Monitoring"
              ],
              "importance": "This is critical for taking data science models from the experimentation phase into real-world use within the organization, enabling improved decision making and operational efficiency.",
              "topic_status": "assigned"
            },
            {
              "topic_id": 3,
              "name": "Feature Engineering",
              "description": "This topic explores how to select and transform input features, impacting the effectiveness of model training.",
              "subtopics": [
                "Feature Scaling",
                "Interaction Terms",
                "Dimensionality Reduction"
              ],
              "importance": "Effective feature engineering is paramount to the success of a model as a better understanding of data improves the accuracy and reliability of model predictions and insights.",
              "topic_status": "assigned"
            },
            {
              "topic_id": 4,
              "name": "Deep Learning for Data Science",
              "description": "Understand the application of deep learning algorithms in various data science applications.",
              "subtopics": [
                "Neural Networks",
                "Convolutional Neural Networks",
                "Recurrent Neural Networks"
              ],
              "importance": "This topic allows data scientists to apply these advanced methods to complex tasks, leading to more powerful and accurate models for use cases like image recognition or time series analysis.",
              "topic_status": "assigned"
            },
            {
              "topic_id": 5,
              "name": "Data Visualization and Communication",
              "description": "This expands visualization techniques beyond basic charts to present complex data insights effectively.",
              "subtopics": [
                "Interactive Dashboards",
                "Storytelling with Data",
                "Data Visualization Libraries (e.g.",
                "Tableau)"
              ],
              "importance": "Strong communication skills are essential to explain complex analysis to stakeholders, enabling data-driven decisions that drive business success.",
              "topic_status": "assigned"
            },
            {
              "topic_id": 6,
              "name": "Data Wrangling and Preprocessing",
              "description": "This topic reviews the necessary steps to prepare messy, inconsistent data for analysis.",
              "subtopics": [
                "Missing Value Imputation",
                "Data Cleaning",
                "Feature Transformation"
              ],
              "importance": "Data quality directly impacts model reliability, making a solid understanding of data wrangling and preprocessing a vital tool in a data scientist's toolkit.",
              "topic_status": "assigned"
            },
            {
              "topic_id": 7,
              "name": "Big Data Technologies",
              "description": "Understanding and using tools for large-scale data management and analysis.",
              "subtopics": [
                "Hadoop",
                "Spark",
                "Cloud-Based Data Warehousing"
              ],
              "importance": "Working with massive datasets is increasingly prevalent in many industries; this topic equips data scientists with the tools to handle the challenges of big data effectively.",
              "topic_status": "assigned"
            },
            {
              "topic_id": 8,
              "name": "Advanced Clustering and Classification",
              "description": "Learn advanced techniques for grouping and classifying data based on characteristics.",
              "subtopics": [
                "K-Means Clustering",
                "Hierarchical Clustering",
                "Decision Trees",
                "Support Vector Machines"
              ],
              "importance": "This enhances the ability to perform more nuanced analyses and create more sophisticated models, often resulting in deeper insight and better predictions.",
              "topic_status": "assigned"
            },
            {
              "topic_id": 9,
              "name": "Ethical Considerations in AI",
              "description": "Understanding the ethical implications of applying data science in a responsible manner.",
              "subtopics": [
                "Bias Detection",
                "Fairness in AI",
                "Explainable AI (XAI)"
              ],
              "importance": "Recognizing the potential biases in algorithms and implementing ethical data practices is becoming essential for the long-term success and good standing of data science projects.",
              "topic_status": "assigned"
            },
            {
              "topic_id": 10,
              "name": "Time Series Analysis in Depth",
              "description": "This topic goes further than basic time series analysis, exploring complex forecasting methods.",
              "subtopics": [
                "ARIMA models",
                "Exponential Smoothing",
                "SARIMA"
              ],
              "importance": "Understanding and accurately forecasting time-dependent data is crucial in finance, sales forecasting, or supply chain management, among other applications.",
              "topic_status": "assigned"
            },
            {
              "topic_id": 11,
              "name": "Collaboration and Project Management in Data Science",
              "description": "This covers working efficiently within teams and managing data science projects effectively.",
              "subtopics": [
                "Agile methodologies",
                "Version Control (Git)",
                "Effective communication in data science projects."
              ],
              "importance": "In real-world scenarios, data scientists are expected to be part of teams and be responsible for project success and output.",
              "topic_status": "assigned"
            }
          ]
        }
      )
      // add this
      // return response.data;
    } else {
      console.error("Unexpected response status:", response.status);
      return { error: "Unexpected response from server", status: response.status };
    }
  } catch (error: any) {
    console.error("Error fetching approved mentees:", error);
    return { error: "Request failed", details: error };
  }
};
export const apiPostAssignRoadmap = async (menteeId: string, domainId: string, roadmapId: string) => {
  const api = axios.create({
    baseURL: process.env.API_URL, // Ensure this is set in your environment variables
    headers: {
      accept: "application/json",
      token: storage.getString("token"), // Ensure the token is stored in MMKV
      // token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmYWxndW5pIiwiaWQiOjQzLCJyb2xlIjoibWVudG9yIiwiZXhwIjoxNzQ1MjM2NjYyfQ.CBXntNG8fr6kPsU5dvWhQb-ELU1Rjo6rZSOrnBUwRqg",
    },
  });
  try {
    const data = {
      "mentee_id": menteeId,
      "domain_id": domainId,
      "roadmap_id": roadmapId,
    }
    const response = await api.post("mentor/assign-roadmap", data);
    console.log("Response from assign-roadmap:", response);
    // return 1;
    if (response.status === 200) {
      return 1;
    } else {
      console.error("Unexpected response status:", response.status);
      return 0;
    }
  } catch (error: any) {
    console.error("Error assigning roadmap:", error);
    return 0;
  }
};