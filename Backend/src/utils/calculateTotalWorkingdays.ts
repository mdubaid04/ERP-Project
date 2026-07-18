const calculateTotalWorkingdays = async (
  year: number,
  month: number
): Promise<number> => {
  const totalDays = new Date(year, month, 0).getDate();
  let workingDays = 0;
  for (let date = 1; date <= totalDays; date++) {
    const dateDay = new Date(year, month - 1, date).getDay();
    if (dateDay !== 0 && dateDay !== 6) {
      workingDays++;
    }
  }
  return workingDays;
};

export default calculateTotalWorkingdays;

// in js date months start from 0 to 11
// in js Date date start from 1 to 31
// in js Date day start from 0 to 6
