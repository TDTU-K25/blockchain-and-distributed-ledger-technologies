"use client";

import Countdown, { CountdownRenderProps } from "react-countdown";

import styles from "./countdownTimer.module.scss";

function Completionist() {
  return <span>The auction has ended</span>;
}

interface CountdownTimerProps {
  timestamp: number;
}

export default function CountdownTimer(props: CountdownTimerProps) {
  const { timestamp } = props;
  const renderer = (props: CountdownRenderProps) => {
    const { days, hours, minutes, seconds, completed } = props
    if (completed) {
      // Render a completed state
      return <Completionist />;
    } else {
      // Render a countdown
      return (
        <span className={styles.clock} style={{ color: "black" }}>
          <div data-value="days">
            <div>{days}</div>
            <div>days</div>
          </div>

          <div data-value="hours">
            <div>{hours}</div>
            <div>hours</div>
          </div>

          <div data-value="minutes">
            <div>{minutes}</div>
            <div>minutes</div>
          </div>

          <div data-value="seconds">
            <div>{seconds}</div>
            <div>seconds</div>
          </div>
        </span>
      );
    }
  };

  return (
    <div>
      <Countdown
        date={timestamp}
        renderer={renderer}
        intervalDelay={0}
      />
    </div>
  );
}
