// Signature component: a slot rendered as a physical event ticket stub.
// Left side = activity/slot info, right side (past perforation) = the action.

export default function SlotTicket({ slot, children }) {
  const seatsLeft = slot.capacity - slot.bookedCount;
  const isFull = seatsLeft <= 0;

  const formattedDate = new Date(slot.date).toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });

  return (
    <div className="ticket-stub">
      <div className="p-5 flex flex-col gap-2">
        <div className="flex items-center gap-3 font-mono text-sm text-stone">
          <span>{formattedDate}</span>
          <span className="w-1 h-1 rounded-full bg-stone/50" />
          <span>{slot.startTime} – {slot.endTime}</span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`text-sm font-mono ${isFull ? 'text-red-500' : 'text-sage'}`}
          >
            {isFull ? 'Sold out' : `${seatsLeft} of ${slot.capacity} seats left`}
          </span>
        </div>
      </div>

      <div className="ticket-stub__divider" />

      <div className="px-5 flex items-center justify-center min-w-[140px]">
        {children}
      </div>
    </div>
  );
}
