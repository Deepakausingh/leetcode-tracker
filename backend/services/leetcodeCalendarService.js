const axios = require("axios");

async function getLeetCodeCalendar(username) {

  const query = `
    query userCalendar($username: String!) {
      matchedUser(username: $username) {
        userCalendar {
          submissionCalendar
        }
      }
    }
  `;

  const res = await axios.post(
    "https://leetcode.com/graphql",
    {
      query,
      variables: { username }
    },
    {
      headers: {
        "Content-Type": "application/json",
        "Referer": "https://leetcode.com"
      }
    }
  );

  const raw =
    res.data.data.matchedUser.userCalendar.submissionCalendar;

  return JSON.parse(raw); // timestamp → submissions
}

module.exports = getLeetCodeCalendar;
