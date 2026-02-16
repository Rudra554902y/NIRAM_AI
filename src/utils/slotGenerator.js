const generateSlots = (startTime, endTime, duration) => {
  const slots = [];
  let [startH, startM] = startTime.split(":").map(Number);
  let [endH, endM] = endTime.split(":").map(Number);

  let start = startH * 60 + startM;
  let end = endH * 60 + endM;

  while (start + duration <= end) {
    const h = Math.floor(start / 60);
    const m = start % 60;
    slots.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
    start += duration;
  }

  return slots;
};

module.exports = generateSlots;
