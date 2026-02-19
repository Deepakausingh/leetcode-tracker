const axios = require("axios");

async function fetchLeetcodeData(username) {
  const query = {
    query: `
      query getUserProfile($username: String!) {
        matchedUser(username: $username) {
          submitStats {
            acSubmissionNum {
              difficulty
              count
            }
          }
        }
      }
    `,
    variables: { username }
  };

  const res = await axios.post(
    "https://leetcode.com/graphql",
    query
  );

  const stats =
    res.data.data.matchedUser.submitStats.acSubmissionNum;

  return {
    easy: stats[1].count,
    medium: stats[2].count,
    hard: stats[3].count,
    total: stats[0].count,
    updatedAt: new Date()
  };
}

module.exports = { fetchLeetcodeData };
