exports.findFreeSlots = async (schedule, appointments) => {
  try {
    const startTime = new Date(schedule?.working_time[0]?.time[0]);
    const endTime = new Date(schedule?.working_time[0]?.time[1]);
    const freeSlots = [];
    for (
      let i = startTime.getTime();
      i < endTime.getTime() - 60 * 60 * 1000;
      i += 60 * 60 * 1000
    ) {
      const slotStart = new Date(i);
      const slotEnd = new Date(i + 60 * 60 * 1000);
      const isSlotFree = appointments.every(appointment => {
        const appointmentTime = new Date(appointment?.startTime);
        const appointmentEnd = new Date(appointment?.endTime);
        return (
          appointmentEnd.getHours() <= slotStart.getHours() ||
          appointmentTime.getHours() >= slotEnd.getHours()
        );
      });
      if (isSlotFree) {
        freeSlots.push({ start: slotStart, end: slotEnd });
      }
    }
    return freeSlots;
  } catch (error) {
    console.log(error);
  }
};
