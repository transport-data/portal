// @ts-nocheck

import { useEffect } from "react";

export const pageview = ({
  url,
  analyticsID,
}: {
  url: string;
  analyticsID: string;
}) => {
  if (typeof window.gtag !== undefined) {
    window.gtag("config", analyticsID, {
      page_path: url,
      debug_mode: true,
    });
  }
};

export const event = ({ action, category, label, value }) => {
  if (typeof window.gtag !== "undefined") {
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
      value,
    });
  }
};

export const datasetViewEvent = ({ datasetTitle, datasetId }) => {
  event({
    action: "dataset_view",
    category: "Dataset",
    label: `${datasetId}|${datasetTitle}`,
    value: 1,
  });
};

export const useDatasetViewEvent = ({ datasetTitle, datasetId }) => {
  useEffect(() => {
    datasetViewEvent({ datasetTitle, datasetId });
  }, []);
};

export const datasetDownloadEvent = ({ datasetTitle, datasetId }) => {
  // TODO: would it be worth it to track resourceId as well?
  event({
    action: "dataset_download",
    category: "Dataset",
    label: `${datasetId}|${datasetTitle}`,
    value: 1,
  });
};
