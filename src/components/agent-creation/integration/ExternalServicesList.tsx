
import React from "react";

export const ExternalServicesList = () => {
  return (
    <div className="space-y-3">
      <h4 className="text-base font-medium">Coming Soon</h4>
      <p className="text-sm text-muted-foreground">
        Support for integrating with external services like:
      </p>
      <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
        <li>Database connectors</li>
        <li>Third-party APIs</li>
        <li>External AI services</li>
        <li>Authentication providers</li>
        <li>Storage solutions</li>
      </ul>
    </div>
  );
};
