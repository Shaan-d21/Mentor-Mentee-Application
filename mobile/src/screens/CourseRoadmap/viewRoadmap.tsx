import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";

const roadmap = {
  roadmap_id: 11,
  roadmap_name:
    "1. Foundational Mathematics (Linear Algebra, Calculus, Probability & Statistics)\n" +
    "2. Programming Fundamentals (Python, R, or both)\n" +
    "3. Data Structures and Algorithms\n" +
    "4. Data Wrangling and Cleaning (using Pandas, or equivalent)\n" +
    "5. Exploratory Data Analysis (EDA) techniques\n" +
    "6. Data Visualization (using Matplotlib, Seaborn, or equivalent)\n" +
    "7. Supervised Learning Algorithms (Linear Regression, Logistic Regression, Decision Trees, Random Forests, Support Vector Machines)\n" +
    "8. Unsupervised Learning Algorithms (Clustering, Dimensionality Reduction, Association Rule Mining)\n" +
    "9. Model Evaluation and Selection\n" +
    "10. Model Tuning and Regularization\n" +
    "11. Feature Engineering and Selection\n" +
    "12. Time Series Analysis\n" +
    "13. Natural Language Processing (NLP) basics\n" +
    "14. Deep Learning Fundamentals (Neural Networks, Backpropagation)\n" +
    "15. Specific Deep Learning Architectures (Convolutional Neural Networks (CNNs), Recurrent Neural Networks (RNNs), Transformers)\n" +
    "16. Big Data Technologies (Hadoop, Spark, or equivalent)\n" +
    "17. Cloud Computing Platforms (AWS, Azure, or GCP)\n" +
    "18. Data Warehousing and ETL\n" +
    "19. Data Storytelling and Communication\n" +
    "20. Project Management and Deployment\n" +
    "21. Machine Learning Ethics and Bias\n" +
    "22. Advanced Statistical Modeling (Bayesian methods, Time Series Forecasting)\n" +
    "23. Reinforcement Learning\n" +
    "24. Computer Vision\n" +
    "25. Causal Inference\n" +
    "26. Specialization in a specific domain (healthcare, finance, etc.)\n" +
    "27. Advanced Deep Learning techniques (Generative Adversarial Networks (GANs), Autoencoders)\n" +
    "28. Deploying models to production (cloud platforms, APIs, etc.)\n" +
    "29. Continuous Learning and Staying Updated in the Field",
  domain: "Data Science",
};

const RoadmapScreen = () => {
  // Convert roadmap_name into an array of topics
  const roadmapSections = roadmap.roadmap_name.split("\n").map((item) => item.trim());

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Roadmap for {roadmap.domain}</Text>
      <FlatList
        data={roadmapSections}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{item}</Text>
          </View>
        )}
      />
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: "#F8F9FA",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
    color: "#333",
  },
  section: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#007AFF",
  },
});

export default RoadmapScreen;