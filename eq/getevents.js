exports.getEvents = functions.region("europe-west1").https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    const type = req.type || "";
    const now = new Date;
    let returnHtml = "";
    try {
      let queryRef = "";
      
      if (type) {
        queryRef = db.collection("events")
          .where("startDateTimestamp", ">", now)
          .where("typeEvent", "==", type)
          .orderBy("startDateTimestamp", "asc");
      } else {
        queryRef = db.collection("events")
          .where("startDateTimestamp", ">", now)
          .orderBy("startDateTimestamp", "asc");
      }

      const events = await queryRef.get();

      events.forEach((doc) => {
        const data = doc.data();
        const ageGroupsString = data.ageGroups.map(gr => `'${gr}'`).join(",");
        let iconHtml = "";
        if (data.typeEvent === "tornooien") {
          iconHtml = `<img src="/images/icon-tournament.png" loading="lazy" alt="" class="icon mid">`;
        } else if (data.typeEvent === "stages" || data.typeEvent === "kampen") {
          iconHtml = `<img src="/images/icon-ballmachine-bl.png" loading="lazy" alt="" class="icon small">`;
        }
        let eventDates = "";
        if (data.startDate) {
          eventDates += data.startDate;
        }
        if (data.endDate) {
          eventDates += ` tot ${data.endDate}`;
        }
        returnHtml += `
          <div class="event-holder" filter-date-start="${data.startDate || ""}" filter-date-end="${data.endDate || ""}" filter-type="${data.typeEvent || ""}" filter-leeftijd="[${ageGroupsString}
            <img src="${data.mainImage || '/images/placeholder.jpg'}" loading="lazy" alt="" class="event-im">
            <div class="gradientimevent"></div>
            <div class="holdericonwithsubtitle">
              ${iconHtml}
              <div>
                <h3 class="subtitle">${data.title || "KTC Diest event"}</h3>
                <div class="smalltext">${eventDates}</div>
              </div>
            </div>
            <p>
              ${data.introShort || ""}
            </p>
            <a class="button small dark w-button" href="/event/${doc.id}">Meer info</a>
          </div>
        `;
      });

      res.send(returnHtml);
    } catch (error) {
      console.error("Error fetching promotions:", error);
      res.send(`<div>Error loading promotions</div>`);
    }
  });
});
