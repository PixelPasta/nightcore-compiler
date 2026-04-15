import { JSONFilePreset } from "lowdb/node";
import "dotenv/config";

const defaultData = { IDs: [] };
const db = await JSONFilePreset("database.json", defaultData);

const params = new URLSearchParams({
  q: "kawaii nightcore",
  part: "snippet",
  type: "video",
  maxResults: "50",
  videoDuration: "short",
  key: process.env.KEY,
});

if (db.data.IDs.length == 0) {
  if (db.data.page == 0) {
    let IDs = [];
    let res = await fetch(
      `https://www.googleapis.com/youtube/v3/search?${params}`,
    );
    res = await res.json();
    for (let i = 0; i < res.items.length; i++) {
      IDs.push(res.items[i].id.videoId);
    }
    await db.update((data) => {
      data.next_token = res.nextPageToken;
      data.page = 1;
      data.IDs = IDs;
    });
  }
}
