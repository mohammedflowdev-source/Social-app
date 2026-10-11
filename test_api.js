const axios = require('axios');
const token = process.env.TOKEN;

async function test() {
  try {
    const res = await axios.get("https://route-posts.routemisr.com/users/profile-data", {
      headers: { Authorization: "Bearer " + token }
    });
    console.log(JSON.stringify(res.data, null, 2));
  } catch(e) {
    console.log("Error:", e.response?.status, e.response?.data);
  }
}
test();
