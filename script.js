// The provided course information.
const CourseInfo = {
    id: 451,
    name: "Introduction to JavaScript",
  };
  
  // The provided assignment group.
  const AssignmentGroup = {
    id: 12345,
    name: "Fundamentals of JavaScript",
    course_id: 451,
    group_weight: 25,
    assignments: [
      {
        id: 1,
        name: "Declare a Variable",
        due_at: "2023-01-25",
        points_possible: 50,
      },
      {
        id: 2,
        name: "Write a Function",
        due_at: "2023-02-27",
        points_possible: 150,
      },
      {
        id: 3,
        name: "Code the World",
        due_at: "3156-11-15",
        points_possible: 500,
      },
    ],
  };
  
  // The provided learner submission data.
  const LearnerSubmissions = [
    {
      learner_id: 125,
      assignment_id: 1,
      submission: {
        submitted_at: "2023-01-25",
        score: 47,
      },
    },
    {
      learner_id: 125,
      assignment_id: 2,
      submission: {
        submitted_at: "2023-02-12",
        score: 150,
      },
    },
    {
      learner_id: 125,
      assignment_id: 3,
      submission: {
        submitted_at: "2023-01-25",
        score: 400,
      },
    },
    {
      learner_id: 132,
      assignment_id: 1,
      submission: {
        submitted_at: "2023-01-24",
        score: 39,
      },
    },
    {
      learner_id: 132,
      assignment_id: 2,
      submission: {
        submitted_at: "2023-03-07",
        score: 140,
      },
    },
  ];
  function getLearnerData(courseInfo, assignmentGroup, learnerSubmissions) {
      // Handling possible errors gracefully
    try {
      if (assignmentGroup.course_id !== courseInfo.id) {
        throw new Error("Sorry: The Assignment Group does not belong to this course!");
      }
  
      const result = [];
  
      for (const submission of learnerSubmissions) {
        const assignment = assignmentGroup.assignments.find(a => a.id === submission.assignment_id);
  
        if (!assignment) {
          console.warn(`You are submitting for an assignment that does not existent (ID: ${submission.assignment_id})`);
          continue;
        }
  
        if (assignment.points_possible === 0) {
          throw new Error("Sorry: The points possible cannot be 0 for an assignment.");
        }
  
        const dueDate = new Date(assignment.due_at);
        const submittedDate = new Date(submission.submission.submitted_at);

        // Penalty to late assignment

        if (submittedDate > dueDate) {
          const daysLate = Math.floor((submittedDate - dueDate) / (1000 * 60 * 60 * 24));
          const latePenalty = Math.min(10 * daysLate, 100);
  
          submission.submission.score = Math.max(0, submission.submission.score - latePenalty);
        }
          // Processing grades

        const learnerIndex = result.findIndex(item => item.id === submission.learner_id);
  
        if (learnerIndex === -1) {
          result.push({
            id: submission.learner_id,
            [assignment.id]: submission.submission.score / assignment.points_possible
          });
        } else {
          result[learnerIndex][assignment.id] = submission.submission.score / assignment.points_possible;
        }
      }
  
      for (const learner of result) {
        const totalPoints = Object.values(learner).reduce((total, score) => total + score, 0);
        const totalWeight = assignmentGroup.group_weight / 100;
        learner.avg = totalPoints / totalWeight;
      }
  
      return result;
    } catch (error) {
      console.error(error.message);
      return null;
    }
  }
  
  const result = getLearnerData(CourseInfo, AssignmentGroup, LearnerSubmissions);
  console.log(result);