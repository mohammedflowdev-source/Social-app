const axios = require('axios');
const token = process.env.TOKEN;

async function test() {
  try {
    const res = await axios.get("https://route-posts.routemisr.com/posts?limit=50", {
      headers: { Authorization: "Bearer " + token }
    });
    const bookmarked = res.data.data.posts.filter(p => p.bookmarked);
    console.log("Bookmarked posts count in general feed:", bookmarked.length);
  } catch(e) {
    console.log("Error:", e.message);
  }
}
test();
