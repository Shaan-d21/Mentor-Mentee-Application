import React, { FC, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import DropdownComponent from '../../components/Dropdown'; // Adjust path if needed
import { ScreenProps } from '../../navigation/types';
import AppBar from '../../components/appbar_component';

const menteeOptions = [
  { label: 'Mentee A', value: 'Mentee A' },
  { label: 'Mentee B', value: 'Mentee B' },
];
const domainOptions = [
  { label: 'Programming Languages', value: 'Programming Languages' },
  { label: 'Database & Backend', value: 'Database & Backend' },
  { label: 'Cloud Computing', value: 'Cloud Computing' },
  { label: 'DevOps & Deployment', value: 'DevOps & Deployment' },
  { label: 'Artificial Intelligence & Machine Learning', value: 'Artificial Intelligence & Machine Learning' },
  { label: 'Data Science & Analytics', value: 'Data Science & Analytics' },
  { label: 'Project & Team Management', value: 'Project & Team Management' },
  { label: 'Software Development', value: 'Software Development' },
  { label: 'Soft Skills', value: 'Soft Skills' },
  { label: 'Web Development', value: 'Web Development' },
];

const topics = [
    "Fundamentals of Programming (Python preferred)",
    "Basic Statistics (Descriptive & Inferential)",
    "Probability",
    "Data Structures and Algorithms",
    "Data Wrangling and Cleaning (e.g., handling missing values, outliers)",
    "Exploratory Data Analysis (EDA)",
    "Data Visualization (matplotlib, seaborn, plotly)",
    "Introduction to Machine Learning (Supervised Learning)",
    "Linear Regression",
    "Logistic Regression",
    "Classification Algorithms (Decision Trees, Support Vector Machines, Naive Bayes)",
    "Regression Algorithms (Polynomial Regression, Ridge, Lasso)",
    "Model Evaluation and Selection (Metrics, Cross-validation)",
    "Unsupervised Learning (Clustering, Dimensionality Reduction)",
    "Principal Component Analysis (PCA)",
    "K-Means Clustering",
    "Introduction to Deep Learning (Neural Networks)",
    "Working with Neural Networks (e.g., Keras, TensorFlow)",
    "Natural Language Processing (NLP) basics (text preprocessing, tokenization)",
    "Feature Engineering",
    "Time Series Analysis",
    "Big Data Technologies (Spark, Hadoop)",
    "Databases (SQL, NoSQL)",
    "Data warehousing and ETL (Extract, Transform, Load)",
    "Cloud Computing (AWS, Azure, GCP)",
    "Model Deployment and Monitoring",
    "Data Ethics and Bias",
    "Advanced Machine Learning Techniques (Ensemble methods, Boosting, Bagging)",
    "Deep Learning Architectures (CNNs, RNNs)",
    "Computer Vision (Image classification, object detection)",
    "Reinforcement Learning",
    "Causal Inference",
    "Specific domain knowledge (e.g., finance, healthcare, etc.)",
    "Advanced Statistical Modeling (e.g., Bayesian methods)",
    "Project Portfolio Building",
    "Communication & Presentation Skills",
    "Version Control (Git)"
];

export const MentorRoadmapGeneration: FC<ScreenProps<'MentorRoadmapGeneration'>> = ({ navigation }) => {
    const [selectedMentee, setSelectedMentee] = useState('');
    const [selectedDomain, setSelectedDomain] = useState('');
    const [showTopics, setShowTopics] = useState(false);
  
    const handleGenerateRoadmap = () => {
      setShowTopics(true);
    };
  
    const buttonLabel = showTopics
      ? `Assign to ${selectedMentee || 'Name'}`
      : 'Generate Roadmap using AI';
  
    return (
      <View style={styles.container}>
        <AppBar onProfilePress={() => {}} openDrawer={() => {}} />
  
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {!showTopics && (
            <>
              <View style={styles.dropdownContainer}>
                <Text style={styles.label}>Select Mentee</Text>
                <DropdownComponent
                  data={menteeOptions}
                  selectedValue={selectedMentee}
                  onSelect={(value) => setSelectedMentee(value)}
                />
              </View>
  
              <View style={styles.dropdownContainer}>
                <Text style={styles.label}>Select Domain</Text>
                <DropdownComponent
                  data={domainOptions}
                  selectedValue={selectedDomain}
                  onSelect={(value) => setSelectedDomain(value)}
                />
              </View>
            </>
          )}
  
          {showTopics && (
            <View style={styles.topicsWrapper}>
              <Text style={styles.header}>
                {selectedDomain || 'Your Domain'} Roadmap for{' '}
                {selectedMentee || 'Your Mentee'}
              </Text>
  
              {topics.map((topic, index) => (
                <View key={index} style={styles.topicCard}>
                  <Text style={styles.topicItem}>{topic}</Text>
                </View>
              ))}
            </View>
          )}
        </ScrollView>
  
        <View style={styles.bottomBar}>
          <TouchableOpacity style={styles.button} onPress={handleGenerateRoadmap}>
            <Text style={styles.buttonText}>{buttonLabel}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#ffffff',
    },
    scrollContent: {
      padding: 16,
    },
    dropdownContainer: {
      marginBottom: 20,
    },
    label: {
      marginBottom: 5,
      fontWeight: '700',
      fontSize: 18,
      color: '#000', // Black text
    },
    topicsWrapper: {
      marginTop: 20,
      marginBottom: 20,
    },
    header: {
      fontSize: 20, // Larger font
      fontWeight: '700',
      marginBottom: 12,
      color: '#000', // Black text
    },
    topicCard: {
      marginBottom: 10,
      borderRadius: 8,
      backgroundColor: '#fff9d9', // Pale yellow for emphasis
      padding: 12,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    topicItem: {
      fontSize: 16, // Slightly bigger font
      color: '#000', // Black text
    },
    bottomBar: {
      backgroundColor: '#ffffff', // Pale yellow
      borderTopWidth: 1,
      borderTopColor: '#ddd',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 16,
    },
    button: {
      backgroundColor: '#000',
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 8,
    },
    buttonText: {
      color: '#fff',
      fontWeight: '700',
      fontSize: 16,
    },
  });