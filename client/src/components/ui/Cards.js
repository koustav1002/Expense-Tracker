import React from "react";
import clsx from "clsx";

export const Card = ({ className, children, ...props }) => (
  <div
    className={clsx(
      "rounded-lg border bg-card text-card-foreground shadow-lg dark:shadow-gray-800",
      className
    )}
    {...props}
  >
    {children}
  </div>
);
