"use client";

import { useState, useCallback } from "react";
import {
  shouldShowTour,
  markTourCompleted,
  resetOnboarding as resetOnboardingUtil,
} from "@/lib/onboarding";

export function useOnboarding() {
  const [showTour, setShowTour] = useState(() => shouldShowTour());

  const completeTour = useCallback(() => {
    markTourCompleted();
    setShowTour(false);
  }, []);

  const resetOnboarding = useCallback(() => {
    resetOnboardingUtil();
    setShowTour(true);
  }, []);

  return { showTour, completeTour, resetOnboarding };
}
