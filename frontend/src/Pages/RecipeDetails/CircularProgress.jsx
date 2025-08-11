import { useEffect } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import propTypes from "prop-types";

const CircularProgress = ({
      valueString = "0%", // e.g. "10%", "40%", "110%", "124%",
      dailyNeed ,
      label = "Cal",
      size = 50,
      duration = 1.3,
}) => {

      const nutrientsFillPercentage = (parseInt(valueString) / dailyNeed) * 100;

      const numericValue = parseFloat(nutrientsFillPercentage) || 0;

      const strokeWidth = 8;
      const radius = (size - strokeWidth) / 2;
      const circumference = 2 * Math.PI * radius;

      const baseValue = Math.min(numericValue, 100);
      const extraValue = numericValue > 100 ? Math.min(numericValue - 100, 100) : 0;

      const extraColor =
            numericValue > 100 && numericValue <= 125 ? "#f0ad4e" : // yellow
                  numericValue > 125 ? "#d9534f" : // red
                        "#2ea44f"; // default green

      const baseProgress = useMotionValue(0);
      const baseStrokeDashoffset = useTransform(baseProgress, [0, 100], [circumference, 0]);

      const extraProgress = useMotionValue(0);
      const extraStrokeDashoffset = useTransform(extraProgress, [0, 100], [circumference, 0]);

      useEffect(() => {
            const baseControls = animate(baseProgress, baseValue, {
                  duration,
                  ease: "easeInOut",
                  onComplete: () => {
                        if (extraValue > 0) {
                              animate(extraProgress, extraValue, {
                                    duration,
                                    ease: "easeInOut",
                              });
                        }
                  },
            });
            return baseControls.stop;
      }, [baseValue, extraValue, duration, baseProgress, extraProgress]);

      return (
            <div style={{ position: "relative", width: size, height: size }}>
                  <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
                        <circle
                              cx={size / 2}
                              cy={size / 2}
                              r={radius}
                              stroke="#eee"
                              strokeWidth={strokeWidth}
                              fill="transparent"
                        />

                        <motion.circle
                              cx={size / 2}
                              cy={size / 2}
                              r={radius}
                              stroke="#2ea44f"
                              strokeWidth={strokeWidth}
                              fill="transparent"
                              strokeDasharray={circumference}
                              style={{ strokeDashoffset: baseStrokeDashoffset }}
                              strokeLinecap="round"
                        />

                        {extraValue > 0 && (
                              <motion.circle
                                    cx={size / 2}
                                    cy={size / 2}
                                    r={radius}
                                    stroke={extraColor}
                                    strokeWidth={strokeWidth}
                                    fill="transparent"
                                    strokeDasharray={circumference}
                                    style={{ strokeDashoffset: extraStrokeDashoffset }}
                                    strokeLinecap="round"
                              />
                        )}
                  </svg>

                  <div
                        style={{
                              position: "absolute",
                              top: "50%",
                              left: "50%",
                              transform: "translate(-50%, -50%)",
                              textAlign: "center",
                              fontWeight: "bold",
                              color: "#333",
                        }}
                  >
                        <div>{label.substring(0, 3)}</div>
                        <div>{nutrientsFillPercentage.toFixed(1)}%</div>
                  </div>
            </div>
      );
};

CircularProgress.propTypes = {
      valueString: propTypes.string,
      label: propTypes.string,
      size: propTypes.number,
      duration: propTypes.number,
      dailyNeed: propTypes.number,
};

export default CircularProgress;