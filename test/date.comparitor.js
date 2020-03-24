module.exports = {
  compare: (date1, date2) => {
    if (typeof date1 === "string") {
      date1 = new Date(date1);
    }

    if (typeof date2 === "string") {
      date2 = new Date(date2);
    }

    if (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    ) {
      return true;
    } else {
      return false;
    }
  }
};
