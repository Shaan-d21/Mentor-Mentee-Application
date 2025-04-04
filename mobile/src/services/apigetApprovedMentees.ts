import axios from "axios";
import { MMKV } from "react-native-mmkv";

const storage = new MMKV();

export const apiGetApprovedMentees = async () => {
  const api = axios.create({
    baseURL: "http://181.214.44.15:8080",
    headers: {
      accept: "application/json",
    //   token: storage.getString("token"), // Ensure the token is stored in MMKV
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJyYWp1IiwiaWQiOjE1LCJyb2xlIjoibWVudG9yIiwiZXhwIjoxNzQ0OTc4NTMxfQ.-ye_O9gjiq8bVuimKwotO5UTvYAr2BsTgCEnFH5F3Bc"
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

export const  apiPostGenerateRoadMap=()=>{

  const roadMapData = `{
  "roadmap_id": 5,
  "roadmap_name": "Data Science Roadmap for mentee1",
  "topics": [
    "1.  Fundamentals of Programming (Python preferred)",
    "2.  Basic Statistics (Descriptive & Inferential)",
    "3.  Probability",
    "4.  Data Structures and Algorithms",
    "5.  Data Wrangling and Cleaning (e.g., handling missing values, outliers)",
    "6.  Exploratory Data Analysis (EDA)",
    "7.  Data Visualization (matplotlib, seaborn, plotly)",
    "8.  Introduction to Machine Learning (Supervised Learning)",
    "9.  Linear Regression",
    "10. Logistic Regression",
    "11. Classification Algorithms (Decision Trees, Support Vector Machines, Naive Bayes)",
    "12. Regression Algorithms (Polynomial Regression, Ridge, Lasso)",
    "13. Model Evaluation and Selection (Metrics, Cross-validation)",
    "14. Unsupervised Learning (Clustering, Dimensionality Reduction)",
    "15. Principal Component Analysis (PCA)",
    "16. K-Means Clustering",
    "17. Introduction to Deep Learning (Neural Networks)",
    "18. Working with Neural Networks (e.g., Keras, TensorFlow)",
    "19. Natural Language Processing (NLP) basics (text preprocessing, tokenization)",
    "20. Feature Engineering",
    "21. Time Series Analysis",
    "22. Big Data Technologies (Spark, Hadoop)",
    "23. Databases (SQL, NoSQL)",
    "24. Data warehousing and ETL (Extract, Transform, Load)",
    "25. Cloud Computing (AWS, Azure, GCP)",
    "26. Model Deployment and Monitoring",
    "27. Data Ethics and Bias",
    "28. Advanced Machine Learning Techniques (Ensemble methods, Boosting, Bagging)",
    "29. Deep Learning Architectures (CNNs, RNNs)",
    "30. Computer Vision (Image classification, object detection)",
    "31. Reinforcement Learning",
    "32. Causal Inference",
    "33.  Specific domain knowledge (e.g., finance, healthcare, etc.)",
    "34.  Advanced Statistical Modeling (e.g., Bayesian methods)",
    "35.  Project Portfolio Building",
    "36.  Communication & Presentation Skills",
    "36.  Communication & Presentation Skills",
    "37.  Version Control (Git)"
  ],
  "domain": "Data Science"
}`;
  return roadMapData;
};