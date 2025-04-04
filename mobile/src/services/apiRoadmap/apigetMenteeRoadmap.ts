import { ApprovedMentor } from "../../redux/slices/sliceMenteeRoadmap";

export const getApprovedMentors = async (): Promise<ApprovedMentor[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          mentor_id: 1,
          mentor_name: "Jane Smith",
          domain_id: 101,
          domain_name: "Database & Backend",
        },
        {
          mentor_id: 2,
          mentor_name: "Falguni Chetwani",
          domain_id: 102,
          domain_name: "Frontend Development",
        },
        {
          mentor_id: 3,
          mentor_name: "Alice Johnson",
          domain_id: 103,
          domain_name: "Data Science",
        },
        {
          mentor_id: 4,
          mentor_name: "Bob Williams",
          domain_id: 104,
          domain_name: "Mobile App Development",
        },
        {
          mentor_id: 5,
          mentor_name: "Charlie Brown",
          domain_id: 101,
          domain_name: "Database & Backend",
        },
        {
          mentor_id: 6,
          mentor_name: "Diana Miller",
          domain_id: 105,
          domain_name: "Cloud Computing",
        },
        {
          mentor_id: 7,
          mentor_name: "Ethan Davis",
          domain_id: 102,
          domain_name: "Frontend Development",
        },
        {
          mentor_id: 8,
          mentor_name: "Sophia Rodriguez",
          domain_id: 106,
          domain_name: "Cybersecurity",
        },
        {
          mentor_id: 9,
          mentor_name: "David Garcia",
          domain_id: 103,
          domain_name: "Data Science",
        },
        {
          mentor_id: 10,
          mentor_name: "Olivia Martinez",
          domain_id: 104,
          domain_name: "Mobile App Development",
        },
      ]);
    }, 10000); // Simulating a 1-second delay to mimic an API response
  });
};