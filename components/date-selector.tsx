"use client";

import { useReservationContext } from "@/hooks/use-reservation-context";
import { Room, Settings } from "@/lib/type";
import { addYears, differenceInDays, isWithinInterval } from "date-fns";
import { DateRange, DayPicker } from "react-day-picker";

function isAlreadyBooked(range: DateRange | undefined, datesArr: Date[]) {
  return (
    range?.from &&
    range?.to &&
    datesArr.some((date) =>
      isWithinInterval(date, { start: range.from!, end: range.to! }),
    )
  );
}

type DateSelectorProps = {
  settings: Settings;
  room: Room;
  bookedDates: Date[];
};

function DateSelector({ settings, room, bookedDates }: DateSelectorProps) {
  const { handleSelect, resetRange, selectedRange } = useReservationContext();
  const displayRange = isAlreadyBooked(selectedRange, bookedDates)
    ? undefined
    : selectedRange;
  const { regularPrice, discount } = room;
  const numNights = displayRange
    ? differenceInDays(displayRange.to!, displayRange.from!)
    : 0;
  const roomPrice = numNights * (regularPrice - (discount || 0));

  // SETTINGS
  const { minBookingLength, maxBookingLength } = settings;

  return (
    <div className="flex flex-col justify-between">
      <DayPicker
        className="place-self-center pt-12"
        mode="range"
        min={minBookingLength}
        max={maxBookingLength}
        startMonth={new Date()}
        disabled={[{ before: new Date() }, ...bookedDates]}
        endMonth={addYears(new Date(), 2)}
        captionLayout="dropdown"
        numberOfMonths={2}
        selected={displayRange}
        onSelect={handleSelect}
      />

      <div className="flex h-[72px] items-center justify-between bg-accent-500 px-8 text-primary-800">
        <div className="flex items-baseline gap-6">
          <p className="flex items-baseline gap-2">
            {discount && discount > 0 ? (
              <>
                <span className="text-2xl">${regularPrice - discount}</span>
                <span className="font-semibold text-primary-700 line-through">
                  ${regularPrice}
                </span>
              </>
            ) : (
              <span className="text-2xl">${regularPrice}</span>
            )}
            <span className="">/night</span>
          </p>
          {numNights ? (
            <>
              <p className="bg-accent-600 px-3 py-2 text-2xl">
                <span>&times;</span> <span>{numNights}</span>
              </p>
              <p>
                <span className="text-lg font-bold uppercase">Total</span>{" "}
                <span className="text-2xl font-semibold">${roomPrice}</span>
              </p>
            </>
          ) : null}
        </div>

        {displayRange && (
          <button
            className="border border-primary-800 px-4 py-2 text-sm font-semibold"
            onClick={resetRange}
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
}

export default DateSelector;
