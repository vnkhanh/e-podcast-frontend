export const formatTime = (time) => {
  if (!time || isNaN(time)) return "00:00:00";
  const h = Math.floor(time / 3600);
  const m = Math.floor((time % 3600) / 60);
  const s = Math.floor(time % 60);
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s
    .toString()
    .padStart(2, "0")}`;
};
export const truncateText = (text, maxLength) => {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.substr(0, maxLength) + "...";
};

export const formatNumber = (number) => {
  if (!number) return "0";
  if (number >= 1000000) {
    return (number / 1000000).toFixed(1) + "M";
  }
  if (number >= 1000) {
    return (number / 1000).toFixed(1) + "K";
  }
  return number.toString();
};

export const getProgressColor = (percent) => {
  if (percent < 30) return "#ff4d4f";
  if (percent < 70) return "#faad14";
  return "#52c41a";
};
