import React, { useState } from "react";
import { Clock, Home } from "iconsax-react";
import { format } from "date-fns";

import Range from "../global-components/Range";
import Chip from "../global-components/Chip";
import Badge from "../global-components/Badge";
import ButtonsIcon from "../global-components/ButtonsIcon";
import Toggle from "../global-components/Toggle";
import TimePicker from "../global-components/TimePicker";
import CustomDatePicker from "../global-components/CustomDatePicker";
import Avatar from "../global-components/Avatar";
import Calendar from "../global-components/Calendar";
import Divider from "../global-components/Divider";
import ItemLimitDropdown from "../global-components/ItemLimitDropdown";

const MillborneDesignSystem: React.FC = () => {
  const [rangeValue, setRangeValue] = useState(0);
  const [toggle, setToggle] = useState(false);
  const [time, setTime] = useState("15:00 AM");
  const [timeProper, setTimeroper] = useState("15:00");
  const [value, setValue] = useState<Date>(new Date());
  const [currentCalendarDisplay, setCurrentCalendarDisplay] = useState(
    format(new Date(), "MMMM yyyy")
  );

  // Mock schedule for April 2025
  const shiftData: {
    date: string;
    type:
      | "rest"
      | "holiday"
      | "shift"
      | "business"
      | "leave"
      | "workOnLeave"
      | "suspended"
      | "absent";
    start?: string;
    end?: string;
    withPay?: boolean;
    schedules?: {
      start: string;
      end: string;
      type:
        | "rest"
        | "holiday"
        | "shift"
        | "business"
        | "leave"
        | "workOnLeave"
        | "suspended"
        | "absent";
    }[];
  }[] = [
    {
      date: "2025-04-01",
      type: "workOnLeave",
      schedules: [{ start: "9:00 AM", end: "6:00 PM", type: "shift" }],
    },
    {
      date: "2025-04-02",
      type: "shift",
      schedules: [{ start: "9:00 AM", end: "6:00 PM", type: "shift" }],
    },
    {
      date: "2025-04-03",
      type: "shift",
      schedules: [{ start: "9:00 AM", end: "6:00 PM", type: "shift" }],
    },
    {
      date: "2025-04-04",
      type: "shift",
      schedules: [{ start: "9:00 AM", end: "6:00 PM", type: "shift" }],
    },
    { date: "2025-04-05", type: "rest" }, // Saturday
    { date: "2025-04-06", type: "rest" }, // Sunday
    {
      date: "2025-04-07",
      type: "shift",
      schedules: [{ start: "9:00 AM", end: "6:00 PM", type: "shift" }],
    },
    {
      date: "2025-04-08",
      type: "shift",
      schedules: [{ start: "9:00 AM", end: "6:00 PM", type: "shift" }],
    },
    {
      date: "2025-04-09",
      type: "shift",
      schedules: [{ start: "9:00 AM", end: "6:00 PM", type: "shift" }],
    },
    {
      date: "2025-04-10",
      type: "shift",
      schedules: [{ start: "9:00 AM", end: "6:00 PM", type: "shift" }],
    },
    {
      date: "2025-04-11",
      type: "shift",
      schedules: [{ start: "9:00 AM", end: "6:00 PM", type: "shift" }],
    },
    { date: "2025-04-12", type: "rest" }, // Saturday
    { date: "2025-04-13", type: "rest" }, // Sunday
    {
      date: "2025-04-14",
      type: "absent",
      schedules: [{ start: "9:00 AM", end: "6:00 PM", type: "shift" }],
    },
    {
      date: "2025-04-15",
      type: "shift",
      schedules: [{ start: "9:00 AM", end: "6:00 PM", type: "shift" }],
    },
    { date: "2025-04-16", type: "leave", withPay: true },
    { date: "2025-04-17", type: "holiday", withPay: true },
    { date: "2025-04-18", type: "holiday", withPay: true },
    { date: "2025-04-19", type: "rest" }, // Saturday
    { date: "2025-04-20", type: "rest" }, // Sunday
    {
      date: "2025-04-21",
      type: "shift",
      schedules: [{ start: "9:00 AM", end: "6:00 PM", type: "shift" }],
    },
    { date: "2025-04-22", type: "business" },
    {
      date: "2025-04-23",
      type: "shift",
      schedules: [{ start: "9:00 AM", end: "6:00 PM", type: "shift" }],
    },
    {
      date: "2025-04-24",
      type: "shift",
      schedules: [{ start: "9:00 AM", end: "6:00 PM", type: "shift" }],
    },
    {
      date: "2025-04-25",
      type: "suspended",
      // schedules: [{ start: "9:00 AM", end: "6:00 PM", type: "shift" }],
    },
    { date: "2025-04-26", type: "rest" }, // Saturday
    { date: "2025-04-27", type: "rest" }, // Sunday
    {
      date: "2025-04-28",
      type: "shift",
      schedules: [
        { start: "9:00 AM", end: "6:00 PM", type: "shift" },
        { start: "7:00 PM", end: "12:00 AM", type: "absent" },
      ],
    },
    {
      date: "2025-04-29",
      type: "shift",
      schedules: [
        { start: "1:00 AM", end: "8:00 AM", type: "shift" },
        { start: "9:00 AM", end: "6:00 PM", type: "suspended" },
      ],
    },
    {
      date: "2025-04-30",
      type: "shift",
      schedules: [
        { start: "9:00 AM", end: "6:00 PM", type: "suspended" },
        { start: "7:00 PM", end: "12:00 AM", type: "shift" },
      ],
    },
  ];

  const shiftDataMay: {
    date: string;
    type:
      | "rest"
      | "holiday"
      | "shift"
      | "business"
      | "leave"
      | "workOnLeave"
      | "suspended"
      | "absent";
    start?: string;
    end?: string;
    withPay?: boolean;
    schedules?: {
      start: string;
      end: string;
      type:
        | "rest"
        | "holiday"
        | "shift"
        | "business"
        | "leave"
        | "workOnLeave"
        | "suspended"
        | "absent";
    }[];
  }[] = [
    {
      date: "2025-05-01",
      type: "shift",
      schedules: [{ start: "9:00 AM", end: "6:00 PM", type: "shift" }],
    },
    {
      date: "2025-05-02",
      type: "shift",
      schedules: [{ start: "9:00 AM", end: "6:00 PM", type: "shift" }],
    },
    {
      date: "2025-05-03",
      type: "rest", // Saturday
    },
    {
      date: "2025-05-04",
      type: "rest", // Sunday
    },
    {
      date: "2025-05-05",
      type: "holiday",
      withPay: true,
    },
    {
      date: "2025-05-06",
      type: "shift",
      schedules: [{ start: "9:00 AM", end: "6:00 PM", type: "shift" }],
    },
    {
      date: "2025-05-07",
      type: "shift",
      schedules: [{ start: "9:00 AM", end: "6:00 PM", type: "shift" }],
    },
    {
      date: "2025-05-08",
      type: "business",
    },
    {
      date: "2025-05-09",
      type: "shift",
      schedules: [{ start: "9:00 AM", end: "6:00 PM", type: "shift" }],
    },
    {
      date: "2025-05-10",
      type: "rest", // Sunday
    },
    {
      date: "2025-05-11",
      type: "shift",
      schedules: [{ start: "9:00 AM", end: "6:00 PM", type: "shift" }],
    },
    {
      date: "2025-05-12",
      type: "leave",
      withPay: true,
    },
    {
      date: "2025-05-13",
      type: "shift",
      schedules: [{ start: "9:00 AM", end: "6:00 PM", type: "shift" }],
    },
    {
      date: "2025-05-14",
      type: "suspended",
    },
    {
      date: "2025-05-15",
      type: "shift",
      schedules: [{ start: "9:00 AM", end: "6:00 PM", type: "shift" }],
    },
    {
      date: "2025-05-16",
      type: "rest", // Saturday
    },
    {
      date: "2025-05-17",
      type: "rest", // Sunday
    },
    {
      date: "2025-05-18",
      type: "shift",
      schedules: [{ start: "9:00 AM", end: "6:00 PM", type: "shift" }],
    },
    {
      date: "2025-05-19",
      type: "holiday",
      withPay: true,
    },
    {
      date: "2025-05-20",
      type: "shift",
      schedules: [{ start: "9:00 AM", end: "6:00 PM", type: "shift" }],
    },
    {
      date: "2025-05-21",
      type: "business",
    },
    {
      date: "2025-05-22",
      type: "shift",
      schedules: [{ start: "9:00 AM", end: "6:00 PM", type: "shift" }],
    },
    {
      date: "2025-05-23",
      type: "suspended",
    },
    {
      date: "2025-05-24",
      type: "rest", // Saturday
    },
    {
      date: "2025-05-25",
      type: "rest", // Sunday
    },
    {
      date: "2025-05-26",
      type: "shift",
      schedules: [{ start: "9:00 AM", end: "6:00 PM", type: "shift" }],
    },
    {
      date: "2025-05-27",
      type: "shift",
      schedules: [{ start: "9:00 AM", end: "6:00 PM", type: "shift" }],
    },
    {
      date: "2025-05-28",
      type: "absent",
      schedules: [{ start: "9:00 AM", end: "6:00 PM", type: "shift" }],
    },
    {
      date: "2025-05-29",
      type: "shift",
      schedules: [{ start: "9:00 AM", end: "6:00 PM", type: "shift" }],
    },
    {
      date: "2025-05-30",
      type: "shift",
      schedules: [{ start: "9:00 AM", end: "6:00 PM", type: "shift" }],
    },
    {
      date: "2025-05-31",
      type: "rest", // Sunday
    },
  ];

  const [valueShifts, setValueShifts] = useState(shiftDataMay);

  // const [time, setTime] = useState("00:00"); // Initialize with the default value
  // const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //     setTime(event.target.value); // Update state when the input changes
  // };

  const [limit, setLimit] = useState({ label: "10", value: "10" });

  // const [page, setPage] = useState(1);

  return (
    <div className="p-8">
      <div>
        <h2>MILLBORNE DESIGN SYSTEM 3</h2>
        <section className="m-4">
          <h3>RANGE -----------</h3>
          <section className="m-4 flex flex-wrap gap-5">
            <div>
              <h5>DEFAULT</h5>
              <Range
                value={rangeValue}
                min={1}
                max={100}
                onChange={(value: any) => {
                  setRangeValue(value);
                }}
              />
            </div>
            <div>
              <h5>DISABLED </h5>
              <Range value={50} min={1} max={100} disabled={true} />
            </div>
          </section>
        </section>
        <br />
        <section className="m-4">
          <h3>CHIPS -----------</h3>
          <section className="m-4 flex flex-col gap-5">
            <span>Default</span>
            <div className="flex gap-2">
              <Chip label="Chip" />
              <Chip label="Chip Clickable" onClick={() => {}} />
              <Chip label="Chip Deletable" onDelete={() => {}} />
              <Chip label="Chip Start Icon" startIcon={<Clock />} />
              <Chip
                label="Chip Avatar"
                avatar={
                  <Avatar
                    size="xsmall"
                    firstName="Millborne"
                    lastName="Galamiton"
                    src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAABVlBMVEX////7sEAAAAD2278quNjt075Gxun7rDH/tUL7rTX/s0H7rz37rjj7rzvx1L77qy77qib74MPkz7f91aL8vWT+4b2xycH//Pf93LH/9uvs1MJQxeP948L/+fD/uEP22r3+8Nz8yYX92Kn8wG3+8+T8zY3+69PkoDpgQxj90Zjupz2HXiI3Jw78u17bmjhXPRYoHArx9vH8xXn7tU78w3QeFQhALRCgcCnNkDS4gS91Uh42Jg4dDgDDqo/vzar01LGgtJVHt8mQtZ8AueBhtrvPsmyb09lhwtW/3tuodituTRzCiDKVaSYUDgVIOihQPiXWu5ychmyKdl5gTzhzY0+RfGUlGACul39vXUZnWkouJhseGhfWqHHOtqFuXkyplILFqIbcw5bFtoDks1uOvrS8s4Ous4zOzb3Rsml8x9Sjycq5y8CJv8LnsUxZt7+d1Nnc7/C34es+JhDLAAAPlUlEQVR4nO2d+3fTxhLHUWJblvWyYwfHeSkv54lTEhMgpYlxXg6F0hBo0/Ze7u0lgdYUSPj/f7krybL12JU0uys7nOMv57Shdez9eHZndmZXu3fuDDXUUEMNNdRQQw0VU5W55enxheJa1dRacWF8enmuMuhGcVF5aXqhuljP53VdFCVJUkyhf4uirufz2dr8wvRSedCNpFV5aaK6KOiipKiygJesKpKoq6XqxNzMoJsL1XJxsS6KZDaPVEXU64vF5UE3OrZmxrcFUYoH5zKnJKoPxr8BU1YmSnlRgdH1jCnmSwu32gFVJhaRJejoHEhJXJy4rZDL8zIjnmNJefsWjsnyhKArHPBsKbqwcLuCSGVNECnHHkGoO6wtDRqrq6V5ReLLZzFK0vztYKzMS/y6p1eKtD14p1Op5pPisxjz1cEylouqlCCfKUkpDtDnTNfFhPlMifXxAfEtlXT+/gUnWS8NxOUs5HmE93hS88W+8y3X+tFBexJrfZ7mFLnMzyBSxbU+8lVK/TWgLbHWt8AxrvbbgLZUpU9OtdonFxqUrFf7wDczkB7qSCwlXgVYlpOcpEVLURP2qeMD66GOZD3RwVgcZA91JCYY/ed12lblcrlsLmsL/ZTLsSDq80kBPoBbMGdiCesrK493nz16sWHqxaNnu5sr6wJCpeUUHyTCV34ATJRy2dnsyuNnG6sPd0aCeri6sbuJzEmFKC0mkVGVYIC52ZWN7+5j0NzaWd1dn6WBlErcEct1UJTI5TZXI+gc3Xu0TtFdlTpnxPIiCDAbm8/S6nMBzKhwtiJoDGbXNyB8liF3c1kgorQ4OMBdKJ+pnV2o15E4etR5QJjIrf9IA4j0cBNoRpFbXCwCAn125R4lINIGcDjqnGY34wALZlfo+ZCeAM0ocpmjLgMsmGMDRHoGQ9Q5ZBozMiCbWH/CSjiyAeqossyeL5YAgTD7PTMgCo6gwaiUWAGrEDe6yQEQ+VQQoshY2BiH5Euz33EhHLkHQmTLiCugHRXrfABNKwIkqyxFxhqkbJh7zotwZBXiUdUaPSCsaJF7xI1wZAOCSF/WWIbl9LPg+XaIdkGItFER1kezjzk5GlsrAG9D208XICbMbj7kyYe8DciICzSAS3kIIMcx2NELCGKeZgm1BOijOZ5D0NEmpJ9STG2mAbGeq4/p6jtQ3J+GApbr8WN9ll8g9AjiT2VwZQoQCnPc5jI+/QSanwKDYgWSUdCWLSIFShaBk7dq/NJT7nFSgCM7AEBBAiUZFUCkyHEOhG49g/TTPMSI8/E7aYImNPMogBRA6W0JUB7llRTi9RxiRCl+2IeYkLn2FCpQGhXfiEsQR/oiUULQBFxQ4o7ENUAnzTEUgOMINDuVYm6bKgNKF5yKT2TdnwUQynK8ic0EpLzGP6fwCTL/FsSJWIQCoPqUBa0T0gjUTWUhDiCkii+s/5Q0ISgTjlflB4SK5IfhCNSbxggYFUiFNPssecJdCKEsRK9jQPyMkE0k9fXqe1A3jeFrFkEFtkSnbLaeQAAFNXJ1vwKqkWZxe4EscfRAoIEoSFHzGlAJUcgG2/Oyw/bzH7wIYYumkd0UUmFDCrbn4qLzw+uXnAhBFf7IqtsMpEiKTSzOCq86P53/wocQVHNDiXC4N4XsSsCHw8JooWPFH5b3uIzGHa67Fx6AOimG8HVhdLRwZnXQV4WC8YYHIoxQ2Q4lhO1xxvTSV4hwtGDsnZ/vWT/tcXA4oDahBCMMELiehvE0FhciQ7J/MF5h2gwTLFyEr7UVgZtkg9HCGPWrYJy7X/AbnBCUQKGIGFYbBk1oTEL//pkfgoSIceyXXl8tnIHHJpAwbFoDWaywCf0baF4XMITWwHzzq/UC5H4KY+dBijABe2nYEsYcdBgGUvw3eEJzYI4aexcXZwUb+AIyHQA2ShDniISgvMIi9IeLX0iEHffT+/HsIu6IfALdPxwycauCn/jxLztdhBH6eS+wQG49NHOXR9Ddwwp5BQM4KRWC6dNefELEGBlIvl+/P7IKbVPI1LQMfq9AQRhEOFqImrnuZnPrUAuaiT7J1SzBH/rxr8sAeqmFaHnVHeKIBHpRRzppAWOa5rkt70MjoZ6GhLhDmvfA6mw9iaRF/QWK8xF8C8C/AwmtRGSvQOiujygfjJJI22vgrjSwXe8lbk4TjmjFEDwiZSclO1O4KzXlaRMx4keCYuZy9yBrFm4R522Qcn5Xs+66/v0zSkCE+JpbJxXkLIEQVMFwlHM9IfNbgdaESEbgQbd1SkBByOMBIdsT3Oo1iTDvjmnEMR/gj5SeVCBuWpijewY218svXrIQjhb2vISgNXyv9DksIWjRyUXYC/p/MBF24n93TFPzEZegqAK+qV+dRv2LjdA7FGFlUq8IIR9WSexKLXW/+p/A0dBnxDMX4b8ZnvcmVBRppjQmYeNtt1X7bITuqHh/co3+9AYJnyFCy1AdwO1JrZuwnzF209GeP32jTc5Tn7JFKEZBNpm43sxIa91U9i0rYeE/zlv9V0tP1miPqCBsO6GZlgpybTKd1pxmwdJDHGE3YrxNp9P7tP1U4UioVE3Cc16Eo4bT4zVEOAmtbvZaxY9Q2kctSTu+BpgAY624b73T7xYhnWvgTGiYhFpn2vyKnXDU+MEahubbpg06QBIhlXdWNaspe9xs2Omnb623TUNL1A4hfhxS+VLbhp2RCM9/MbJi4utRm5DSmxJ8KVWnt8chQvzzt9c8LNhxp39qTDYkxMMJGkLLl5pqFFiSQy/i+d64TajVqQBJcxqqealc6hDy6KAOYqHQsAlpAyJhXkqXW0gad0Ikm3CSyr0LxNyCLj9E81L76+ZKaGgsw5CUH1Lm+KrtaxpcCS1XSh3wSTk+ZZ1GrSXQTRvWW1LykffUUFailFJ6krcRGyyzUmKtja5eaiLW9ycnuRMypIfEeinoyWbPO6qLxX2uhNokAyD5yWfI/mf/e0rKA46AhqZBThzxi7gXmrJQY0uu8ySsyiyHwBLXnqjLibY4dtMG9QGNlojrhxRrwC5JC/wIGcpspohrwGWm44GVeX6E24wXnRC3DNEtIHYkl/gR0s7WOoDkbcK0E90OIrdZjcF2HUHIfhrwniiPpCIvQur5qK2QPVGUc++OVG4REbZTOUg4RyScYev/AidA2gpbR3I9ZC87/VzXFK94UWSLFaGPzbANAF7dlO17Dt8jDN7n7RMXb9pga0PEmUps356yxoOQIQGwpIYBAp+38EuucQBk9DNorIQSUq50O1I4+Bq2aUfkMzOw554CUtlnbgbr3RkRzz2xTU15BAzGSXf0iVFMWTCHkbjAakJi9usI9gwp5gPY3KnBOKtCwzDybAzGcMuY6sMORsco+jlgxvzCrHMxAAIObyIoxrPcoOfxcVLo/Slj8cKUHOMAl23Wj6FG5AAY8XilLcotih5Eqvkpa6g3Fe/0a2Z3Jqj1CTjgNoebFOOdbcLsa8xPkqpAvgbs/gyCYp5Pw1ZU7EiqQaKGsc3nqlZyGdErui18/g9Tt+MyGmsCn2uy4p4TBTquLezzLsfiMDYaadaMsPuJsQ9s4/KJstga0xqNcLdqNMyVwv/xIQQcusfFiPrTzJi5JaZhkCANw96QoH18x6XXAM7cY4/6aBxeZqbGOvulGshUftuhP519KmntbgZ09jtBsaK9I9qHS1zSP3UJbYz9Bhpypgyjsa+l3f/rbuaAeZoBPPsScn4pXtK7jJcwRIgw85k5RMHOLwWdQYuRKuktGOGVJEqMhT7gBQL09wDKiqhfvj/IwAinmkcfLnVRoR6P4MP1wccrdPGEd1epw8MpIGGmiX4pdXUsUELCz4KG3d3hfIwkHCO8VCrVzEAJp9Bv2ZB1mruGae7xAJczZLH+tGniUREiI9o6bB5c6lA3QHMmO+xcfct+B6kOXypldtJM5i8tGq9L2HJ+F73L0TGQkepcfZizUYSnPT7bhKYRYyFqHzNuI9qGPIa4Vto7POLvApPFv5uHrga2bMJMKw6hNjYVIESMV59jx2Tqe1hiH+YiSwee1nU6KVLbiA3o6qadvvo+rrMLWdaOUMx+KotHhwTCzKcoK2pjzkunUj4dHoixIgfL9bmx+qks+QGbmZ4+hiNqf3VfOdUMID6N8xWz3BUU774n8cAH6DIh0j9hiC7ATMYPiBCPo12qrFL5UUcx4r5y7Af0EobFDA9gJmBD1BuiZzist1hH3rsmC8GGtTyEGWLM8AL6XY3dT6McKuu9a9F35wX7aICQFBa1f3yvCxKmUhFbs9nvzou6/1D+jGmVt5eSwqIfEEsY4Wxklf3+w4gqv3gVNGGAMNNuYADv+l+FtWEz1Ig87rAM372gXuJa5W86Lix2pmqRhIcfQkYin3tIQ++SxZowaMNgWMQA4gnDjMjrLtmQ+4CxoxBD2JpqesOi9rE51YpHSI6J/O4DJt/pLD3FmdDnS1tNM54cusOi9smyTrMVgzB1RPh+ed7pjNJhLKIs4dvUa/iUjWeph6h9cr4YBNkzOCbiW0b8jO2mfO/lvlMu4RCVd1gTOr3UjWfSOCm/8cn94h4kiRAb9XnfrX6nXMN8jH6Eb5M5855qBhrcNDqAge/FhiQQppoYTyfVOAMiBa2IDxW2XbCttSK/5s9EQn/F1OHfgRRHYp/KBFUOjEWCnwnRJ03TvgB/x8oTA2OQvwVNbXs/SFaI3zpRR3fhvxMMiSJkDQakec+AUP+maCyVfCFR5xgH/fKUNSRMVpEQ4ZX7c1mKFtEa17v9RZZpOhydXN1UZs14ozQnOx1GveyXCd3eVBG4ZBNhmqmJtJ6UgdDxpmKJQz4YqardU/P966RO0Jf1uNtJGDWuqmZa0T8TIiNequYWnYSHYE+VkihIH/pKiOamYo3lmnioilL+yN8IfjzNq8B/+pIPfdgnAc355qSHRx/8yPSAgh7MrC/n+guIdO1tlSSqvFwPSnkDWct13/mQbtwVXDTr4OZcUXz3haLW1iAAkU67TUCeQOZmQ5TUe5cKTgfEh1Q+cRr1QSJUpWgI3ylyvffXk0EZ0NZW227UsULOh8GEB5KgOx2iPVi+LiOKyJg1KFp90QXx6rbwmbpBjJ9l6T2/iIgmFOa7tW8GjdbV1nVdF/nNxM0ecTno8edXeSKLLfDTEb7P1yduF5+lmzYvwtRV4kkgpbZOMcu4YLW+3kLz9bR1zQbZvL493oWora+03fXL7baeW+UbsClbJzfJVHmT09bNabsVa6rabF/ffDPG86l85+b0pP0Fz3mYan5pn5ze3PnWbIcVMujp1+uTk5N2u43++fXr6ek3a7ahhhpqqKGGGmqoAej/01RCaw/aqfwAAAAASUVORK5CYII="
                  />
                }
              />
            </div>
          </section>
          <section className="m-4 flex flex-col gap-5">
            <span>Schedule</span>
            <div className="flex gap-2 flex-wrap">
              <Chip
                label="9:00 AM 6:00 PM"
                type="schedule"
                scheduleType="shift"
              />
              <Chip label="leave - wp" type="schedule" scheduleType="leave" />
              <Chip
                label="suspended"
                type="schedule"
                scheduleType="suspended"
              />
              <Chip
                label="Work On leave"
                type="schedule"
                scheduleType="workOnLeave"
              />
              <Chip
                label="official bus."
                type="schedule"
                scheduleType="business"
              />
              <Chip
                label="holidy off wp"
                type="schedule"
                scheduleType="holiday"
              />
              <Chip label="rest day" type="schedule" scheduleType="rest" />
            </div>
          </section>
          <section className="m-4 flex flex-col gap-5">
            <span>Custom</span>
            <div className="flex gap-2 flex-wrap">
              <Chip
                label="Custom Chip"
                type="custom"
                customClass="px-5 py-2 bg-szPrimary200"
              />
            </div>
          </section>
        </section>
        <br />
        <section className="m-4">
          <h3>BADGE -----------</h3>
          <section className="m-4 flex flex-wrap items-center gap-5">
            {/* DEFAULT */}
            <div>
              <h5>DEFAULT</h5>
              <div className="flex flex-wrap gap-5">
                <div className="flex gap-5 px-5 py-5 border rounded-md">
                  <Badge badgeContent={"25"}>
                    <ButtonsIcon
                      icon={<Home variant="Linear" />}
                      onClick={() => console.log("clicked")}
                      variant="secondary"
                      size="small"
                    />
                  </Badge>

                  <Badge variant="dot">
                    <ButtonsIcon
                      icon={<Home variant="Linear" />}
                      onClick={() => console.log("clicked")}
                      variant="ghost"
                      size="small"
                    />
                  </Badge>
                </div>

                <div className="flex gap-5 px-5 py-5 border rounded-md bg-szPrimary200 ">
                  <Badge badgeContent={"25"} color="white" textColor="#6584FF">
                    <ButtonsIcon
                      icon={<Home variant="Linear" />}
                      onClick={() => console.log("clicked")}
                      variant="secondary"
                      size="small"
                    />
                  </Badge>

                  <Badge variant="dot" color="white" textColor="#6584FF">
                    <ButtonsIcon
                      icon={<Home variant="Linear" />}
                      onClick={() => console.log("clicked")}
                      variant="ghost"
                      size="small"
                    />
                  </Badge>
                </div>
              </div>
            </div>
            <span>---</span>
            {/* Top left */}
            <div>
              <h5>TOP LEFT</h5>
              <div className="flex flex-wrap gap-5">
                <div className="flex gap-5 px-5 py-5 border rounded-md">
                  <Badge
                    badgeContent={"25"}
                    anchorOrigin={{
                      vertical: "top",
                      horizontal: "left",
                    }}
                  >
                    <ButtonsIcon
                      icon={<Home variant="Linear" />}
                      onClick={() => console.log("clicked")}
                      variant="secondary"
                      size="small"
                    />
                  </Badge>

                  <Badge
                    variant="dot"
                    anchorOrigin={{
                      vertical: "top",
                      horizontal: "left",
                    }}
                  >
                    <ButtonsIcon
                      icon={<Home variant="Linear" />}
                      onClick={() => console.log("clicked")}
                      variant="ghost"
                      size="small"
                    />
                  </Badge>
                </div>

                <div className="flex gap-5 px-5 py-5 border rounded-md bg-szPrimary200 ">
                  <Badge
                    badgeContent={"25"}
                    color="white"
                    textColor="#6584FF"
                    anchorOrigin={{
                      vertical: "top",
                      horizontal: "left",
                    }}
                  >
                    <ButtonsIcon
                      icon={<Home variant="Linear" />}
                      onClick={() => console.log("clicked")}
                      variant="secondary"
                      size="small"
                    />
                  </Badge>

                  <Badge
                    variant="dot"
                    color="white"
                    textColor="#6584FF"
                    anchorOrigin={{
                      vertical: "top",
                      horizontal: "left",
                    }}
                  >
                    <ButtonsIcon
                      icon={<Home variant="Linear" />}
                      onClick={() => console.log("clicked")}
                      variant="ghost"
                      size="small"
                    />
                  </Badge>
                </div>
              </div>
            </div>
            <span>---</span>
            {/* Bottom left */}
            <div>
              <h5>BOTTOM LEFT</h5>
              <div className="flex flex-wrap gap-5">
                <div className="flex gap-5 px-5 py-5 border rounded-md">
                  <Badge
                    badgeContent={"25"}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "left",
                    }}
                  >
                    <ButtonsIcon
                      icon={<Home variant="Linear" />}
                      onClick={() => console.log("clicked")}
                      variant="secondary"
                      size="small"
                    />
                  </Badge>

                  <Badge
                    variant="dot"
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "left",
                    }}
                  >
                    <ButtonsIcon
                      icon={<Home variant="Linear" />}
                      onClick={() => console.log("clicked")}
                      variant="ghost"
                      size="small"
                    />
                  </Badge>
                </div>

                <div className="flex gap-5 px-5 py-5 border rounded-md bg-szPrimary200 ">
                  <Badge
                    badgeContent={"25"}
                    color="white"
                    textColor="#6584FF"
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "left",
                    }}
                  >
                    <ButtonsIcon
                      icon={<Home variant="Linear" />}
                      onClick={() => console.log("clicked")}
                      variant="secondary"
                      size="small"
                    />
                  </Badge>

                  <Badge
                    variant="dot"
                    color="white"
                    textColor="#6584FF"
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "left",
                    }}
                  >
                    <ButtonsIcon
                      icon={<Home variant="Linear" />}
                      onClick={() => console.log("clicked")}
                      variant="ghost"
                      size="small"
                    />
                  </Badge>
                </div>
              </div>
            </div>
            <span>---</span>
            {/* Bottom right */}
            <div>
              <h5>BOTTOM RIGHT</h5>
              <div className="flex flex-wrap gap-5">
                <div className="flex gap-5 px-5 py-5 border rounded-md">
                  <Badge
                    badgeContent={"25"}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "right",
                    }}
                  >
                    <ButtonsIcon
                      icon={<Home variant="Linear" />}
                      onClick={() => console.log("clicked")}
                      variant="secondary"
                      size="small"
                    />
                  </Badge>

                  <Badge
                    variant="dot"
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "right",
                    }}
                  >
                    <ButtonsIcon
                      icon={<Home variant="Linear" />}
                      onClick={() => console.log("clicked")}
                      variant="ghost"
                      size="small"
                    />
                  </Badge>
                </div>

                <div className="flex gap-5 px-5 py-5 border rounded-md bg-szPrimary200 ">
                  <Badge
                    badgeContent={"25"}
                    color="white"
                    textColor="#6584FF"
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "right",
                    }}
                  >
                    <ButtonsIcon
                      icon={<Home variant="Linear" />}
                      onClick={() => console.log("clicked")}
                      variant="secondary"
                      size="small"
                    />
                  </Badge>

                  <Badge
                    variant="dot"
                    color="white"
                    textColor="#6584FF"
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "right",
                    }}
                  >
                    <ButtonsIcon
                      icon={<Home variant="Linear" />}
                      onClick={() => console.log("clicked")}
                      variant="ghost"
                      size="small"
                    />
                  </Badge>
                </div>
              </div>
            </div>
          </section>
        </section>
        <br />
        <section className="m-4">
          <h3>Toggle -----------</h3>
          <section className="m-4 flex flex-wrap justify-start items-start gap-5">
            <div>
              <h5 className="mb-1">DEFAULT</h5>
              <Toggle
                isOn={toggle}
                onToggle={() => {
                  setToggle(!toggle);
                }}
              />
            </div>

            <div>
              <h5 className="mb-1">DISABLED</h5>
              <div className="flex gap-5">
                <Toggle
                  isOn={false}
                  onToggle={() => {
                    setToggle(!toggle);
                  }}
                  disabled
                />
                <Toggle
                  isOn={true}
                  onToggle={() => {
                    setToggle(!toggle);
                  }}
                  disabled
                />
              </div>
            </div>
          </section>
        </section>
        <br />
        <section className="m-4">
          <h3>Time Picker -----------</h3>
          <p>Output</p>
          <span>{timeProper}</span>
          <section className="m-4 flex flex-wrap justify-start items-start gap-7">
            <div>
              <h5 className="mb-2">DEFAULT</h5>
              <TimePicker
                value={timeProper}
                onChange={(time) => {
                  setTimeroper(time);
                }}
              />
            </div>
            <div>
              <h5 className="mb-2">WITH LABEL</h5>
              <TimePicker label="Time Label" />
            </div>
            <div>
              <h5 className="mb-2">WITH ICON </h5>
              <TimePicker icon={<Clock />} />
            </div>

            <div>
              <h5 className="mb-2">Wrong value </h5>
              <p>value={time} (Must be 15:00 only)</p>
              <p className="mb-5">format={"24-hour"}</p>
              <TimePicker
                value={time}
                format={"24-hour"}
                onChange={(time) => {
                  setTime(time);
                }}
                icon={<Clock />}
              />
            </div>

            <div>
              <h5 className="mb-2">DROPDOWN </h5>
              <TimePicker
                value={"16:00"}
                variant="dropdown"
                format={"24-hour"}
              />
            </div>
          </section>
        </section>
        <br />
        <section className="m-4">
          <h3>Date Picker -----------</h3>

          <p>Output</p>
          <span>{value?.toString()}</span>
          <section className="m-4 flex flex-wrap justify-start items-start gap-7">
            <div>
              <h5 className="mb-2">DEFAULT</h5>
              <div className="flex gap-2">
                <CustomDatePicker
                  value={value}
                  label="Custom Label"
                  onChange={(value) => setValue(value)}
                />
                <CustomDatePicker />
              </div>
            </div>
            <div>
              <h5 className="mb-2">DISABLED</h5>
              <div className="flex gap-2">
                <CustomDatePicker
                  value={value}
                  label="Disabled"
                  onChange={(value) => setValue(value)}
                  disabled
                />

                <CustomDatePicker disabled />
              </div>
            </div>

            <div>
              <h5 className="mb-2">Error</h5>
              <div className="flex gap-2">
                <CustomDatePicker
                  value={value}
                  label="Error"
                  onChange={(value) => setValue(value)}
                  error
                />

                <CustomDatePicker error />
              </div>
            </div>

            <div>
              <h5 className="mb-2">Helper text</h5>
              <div className="flex gap-2">
                <CustomDatePicker
                  value={value}
                  label="Custom Label"
                  onChange={(value) => setValue(value)}
                  helperText={"This is helper text"}
                />

                <CustomDatePicker
                  value={value}
                  label="Custom Label"
                  onChange={(value) => setValue(value)}
                  helperText={"This is helper text"}
                  error
                />
              </div>
            </div>
          </section>
        </section>

        <br />

        <section className="m-4">
          <h3>Calendar -----------</h3>
          <div>
            <h5>Current date: {currentCalendarDisplay}</h5>
          </div>
          <Calendar
            // value={new Date(2025, 3, 1)}
            shiftData={valueShifts}
            onChange={(date) => {
              const currentDate = new Date(date.year, date.month.value); // Create a date object
              const isApril =
                currentDate.getMonth() === 4 &&
                currentDate.getFullYear() === 2025; // April is month 3 (0-indexed)
              const isMay =
                currentDate.getMonth() === 5 &&
                currentDate.getFullYear() === 2025; // May is month 4 (0-indexed)

              if (isApril) {
                setValueShifts(shiftData);
              } else if (isMay) {
                setValueShifts(shiftDataMay);
              }

              setCurrentCalendarDisplay(`${date.month.name} ${date.year}`);
            }}
            // enableMonthYearFilter={false}
            // width="500px"
          />
        </section>

        <section className="m-4">
          <h3>Divider -----------</h3>
          <Divider />
        </section>

        <br />

        <section className="m-4">
          <h3>ItemLimit Dropdown -----------</h3>
          <div className="flex ">
            <div className="w-[220px]">
              <ItemLimitDropdown
                value={limit}
                options={[
                  { label: "5", value: "5" },
                  { label: "10", value: "10" },
                  { label: "25", value: "25" },
                  { label: "50", value: "50" },
                  { label: "100", value: "100" },
                ]}
                onChange={(value) => {
                  setLimit(value);
                }}
                page={1}
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default MillborneDesignSystem;
