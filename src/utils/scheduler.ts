
import { autoReturnExpiredBookings } from '../modules/booking/booking.service';

const getMillisecondsUntilMidnight = (): number => {
  const now = new Date();
  const midnight = new Date();
  midnight.setHours(24, 0, 0, 0); // Next midnight (00:00:00)
  return midnight.getTime() - now.getTime();
};

export const startBookingScheduler = () => {
  autoReturnExpiredBookings().catch(() => { });

  const msUntilMidnight = getMillisecondsUntilMidnight();

  setTimeout(() => {
    autoReturnExpiredBookings().catch(() => { });
    setInterval(() => {
      autoReturnExpiredBookings().catch(() => { });
    }, 24 * 60 * 60 * 1000);
  }, msUntilMidnight);
};
