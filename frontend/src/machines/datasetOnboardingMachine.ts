import type { DataPackage } from "@interfaces/datapackage.interface";
import { assign, createMachine } from "xstate";

interface AddInitialDatapackageEvent {
  type: "addInitialDatapackage";
  data: DataPackage;
}

interface UpdateDatapackage {
  type: "updateDatapackage";
  data: DataPackage;
}

interface AddFileUrls {
  type: "addFileUrls";
  data: string[];
}

interface DatasetOnboardingContext {
  datapackage: DataPackage | null;
  fileUrls: string[];
}

const datasetOnboardingMachine = createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QQIYBcWzGg8gOwCMB7FAJwgEs8oBZFAYwAsqwA6CiAGzAGIUIIAMQrcAqqU6wA2gAYAuolAAHIrApoKRPIpAAPRABYDAVlYyDANgAcATmNWDAJmOOAzDYA0IAJ6IAjDYGrDYWjhYGNjZWVq4A7FYWAL6JXqgYWLiEJORUtAzMeGwc3DxKZFjC3NLyOipqGlo6+gj2pn7OMgEGrsbuMq5evgiOdqy9Vo7mIzIyCQbJqeiY2PjEZJTUdEwsrGWkatSVcHwCAJJ46hQonAAiS2X0ANYoMLIKSCB1l40fzbF+sVY0WMJmMMxGsV6g0Qk0crEcfhkgWMUXMMli4QWIDSy0yaxym3yOz2BygR1gPFgjCIAHccAA3MCkekUMA0t61VTfbS-RA2VxWMahYyhNGWCwDHyIVxI+GdAwyRyQ6yWeYpbFLDKrbIbPLbQqsKm03IMpkstk8UhwbAANWuAFc4ByPl8GjzQM0-H4IqwJf1vd0XEi-NCEAZoqxYq4LO0LBiURZ5VicVqsutclsCmwjTSTYzmayaTwoEQAEIMR4AFSIAGUMKQ0M7lFy3U0+e45TJQkYkTZHI5Q044f6wvEbIqo8nNSs0wS9VnDdTc9RTQWLZB1DRsPwlk3Pi3NO69HyfX4Y8YAsjzK4DIPYnCIuGvRZ7D0LDYp+kZ-jdZmdhuNE2bccWLMsK2rVdzXZGoXQPH4PRhSxglmBJOlcVwvTCYxQxRVx4SwmIQTcKIP3VFNvx1DMiQNACM2ApYeHtJQ0jAO4MAeZ5Xhg5t6kPNsw2HGYhOEoTvVDOI-GCAJHCsWIjASDCTE-XFtXTQl9TYWigIwECrQyO1OEdap3h47l+PvVhLFk9DUUcJwZGwqVhkhIERTHBywTRWJlNTH8qI01gtNoeiMFA8snmrOsyEbbj914+Dj2GJDx2iRM-HQzCX1DGTBRkyIozPEYbH+HyKLU+diXKXJyR4JlSCIUhzgABSq6g91dPjeQQflBRFZxRQVcVJSGZxBSjeJjAvDEEnS0q8Uo9SFxzXIAFFSHq0hLWtNADKM9q4KPZoQhkSyMQlKwAVkmwAlDC7TuuqwJxQiI-GSdU8CICA4B0cj5vKv9Ck5eLDsQABaUxIkhqGoYSUNQYsMwRKRmZvLI6c-rnAGii4MAgbMrqTCCJEJSjHsnHaRyRpCMxnEmUE4i7bo5tUzHqLYElqpEb7YOB8zjEBLsL26C6JUJ8T+nhUmjDiBUemZ2dfzZxdjRXfMoLx1suswmxLPDTpEUmpUuxw2xIyiYU-BRewMXlvzFv-ShAOCnSlg1zqEJaQE4wc+8bz8WwFNvJyDAsqJLvsId7FIxYvwxxWAuW6g1o2t2Es9dodfk-WPKNixst6X1ujcfnugldLHDexIgA */
  id: "datasetOnboardingMachine",
  initial: "idle",
  schema: {
    context: {} as DatasetOnboardingContext,
  },
  context: {
    datapackage: null,
    fileUrls: [],
  } as DatasetOnboardingContext,
  states: {
    general: {
      on: {
        addFileUrls: {
          actions: assign<DatasetOnboardingContext, AddFileUrls>({
            fileUrls: (_, event) => event.data,
          }),
        },
        next: "metadata",
      },
    },

    metadata: {
      on: {
        addInitialDatapackage: {
          actions: assign<DatasetOnboardingContext, AddInitialDatapackageEvent>(
            {
              datapackage: (_, event) => event.data,
            }
          ),
        },

        showOverview: "showingOverview",
        errorInParsing: "showingError",
      },
    },

    showingOverview: {
      on: {
        resetValues: {
          actions: assign<DatasetOnboardingContext>({
            datapackage: () => null,
            fileUrls: () => [],
          }),
        },
        goBackToStart: "idle",
        editMetadata: "editingMetadata",
      },
    },
  },
});

export default datasetOnboardingMachine;
