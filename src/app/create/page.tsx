"use client";

/**
 * /create page - Configurator Wizard (Redesigned)
 * Modern UI with progress bar, tabs, and improved layout
 */

import { useMemo } from "react";
import { Button } from "@/ui/Button";
import { Progress } from "@/ui/Progress";
import { Tabs } from "@/ui/Tabs";
import { useWizardStore } from "@/features/configurator/stores/useWizardStore";
import { Step1VisualPreset } from "@/features/configurator/components/Step1VisualPreset";
import { Step2ProjectStack } from "@/features/configurator/components/Step2ProjectStack";
import { Step3Generate } from "@/features/configurator/components/Step3Generate";
import { LivePreviewPanel } from "@/features/configurator/components/LivePreviewPanel";

const STEPS = [
  { id: "visual", label: "Visual", description: "Choose your style, colors, fonts, and components" },
  { id: "stack", label: "Stack", description: "Configure your framework and stack features" },
  { id: "generate", label: "Generate", description: "Get your CLI command and share URL" },
] as const;

export default function CreatePage() {
  const { currentStep, setCurrentStep } = useWizardStore();

  // Calculate progress percentage
  const progressValue = useMemo(() => {
    const stepIndex = STEPS.findIndex((step) => step.id === currentStep);
    return ((stepIndex + 1) / STEPS.length) * 100;
  }, [currentStep]);

  const currentStepIndex = STEPS.findIndex((step) => step.id === currentStep);
  const currentStepInfo = STEPS[currentStepIndex] || STEPS[0];

  return (
    <div className="min-h-screen configurator-gradient configurator-theme">
      {/* Decorative Floating Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-64 h-64 bg-[#4628f1]/5 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#8b5cf6]/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-[#a78bfa]/3 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      </div>

      <div className="container mx-auto px-4 py-12 max-w-7xl relative z-10">
        {/* Header Section - Bold Editorial */}
        <div className="mb-12 text-center animate-stagger-1">
          <div className="inline-block mb-4">
            <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-[#4628f1]/10 text-[#4628f1] uppercase tracking-wider">
              Configurator
            </span>
          </div>
          <h1 className="text-6xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-[#ededed] via-[#4628f1] to-[#8b5cf6] bg-clip-text text-transparent font-['Space_Grotesk'] leading-tight">
            Create Your Project
          </h1>
          <p className="text-xl text-[#a1a1aa] max-w-2xl mx-auto font-light">
            Configure your React starter preset with bold, modern aesthetics
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-10 animate-stagger-2">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-[#a1a1aa] font-['Space_Grotesk']">
              Step {currentStepIndex + 1} of {STEPS.length}
            </span>
            <span className="text-sm font-bold text-[#4628f1] font-['Space_Grotesk']">
              {Math.round(progressValue)}%
            </span>
          </div>
          <Progress value={progressValue} className="h-1.5" />
        </div>

        {/* Desktop Layout: Two-Panel */}
        <div className="hidden lg:grid lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:gap-8 lg:items-start animate-stagger-3">
          {/* Left Panel - Wizard Controls */}
          <div className="space-y-6">
            <div className="bg-[#171717] border border-[#333333] rounded-2xl p-8 shadow-lg backdrop-blur-sm">
              <div className="mb-6">
                <h2 className="text-3xl font-bold mb-2 font-['Space_Grotesk'] text-[#ededed]">
                  {currentStepInfo.label}
                </h2>
                <p className="text-[#a1a1aa] text-sm">{currentStepInfo.description}</p>
              </div>

              {/* Step Content */}
              {currentStep === "visual" && <Step1VisualPreset />}
              {currentStep === "stack" && <Step2ProjectStack />}
              {currentStep === "generate" && <Step3Generate />}

              {/* Navigation Buttons */}
              <div className="flex justify-between gap-3 mt-8 pt-6 border-t border-[#333333]">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => {
                    if (currentStep === "stack") setCurrentStep("visual");
                    if (currentStep === "generate") setCurrentStep("stack");
                  }}
                  disabled={currentStep === "visual"}
                  className="flex-1 bg-[#171717] border-[#333333] text-[#ededed] hover:bg-[#1f1f1f] hover:border-[#444444]"
                >
                  Back
                </Button>

                <Button
                  size="lg"
                  onClick={() => {
                    if (currentStep === "visual") setCurrentStep("stack");
                    if (currentStep === "stack") setCurrentStep("generate");
                  }}
                  disabled={currentStep === "generate"}
                  className="flex-1 bg-[#4628f1] hover:bg-[#3720d1] text-white font-semibold"
                >
                  {currentStep === "generate" ? "Finish" : "Next"}
                </Button>
              </div>
            </div>
          </div>

          {/* Right Panel - Live Preview */}
          <div className="lg:sticky lg:top-8 animate-stagger-4">
            <div className="bg-[#171717]/80 backdrop-blur-xl border border-[#333333] rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold font-['Space_Grotesk'] text-[#ededed]">Live Preview</h2>
                <span className="text-xs px-2 py-1 rounded-full bg-[#4628f1]/10 text-[#4628f1] font-medium">
                  Real-time
                </span>
              </div>
              <LivePreviewPanel />
            </div>
          </div>
        </div>

        {/* Mobile Layout: Tabs */}
        <div className="lg:hidden animate-stagger-3">
          <Tabs
            value={currentStep}
            onChange={(value) => setCurrentStep(value as typeof STEPS[number]["id"])}
            variant="pills"
            className="mb-6"
          >
            <Tabs.List className="w-full grid grid-cols-3 gap-2 bg-[#171717] p-1.5 rounded-xl border border-[#333333]">
              {STEPS.map((step) => (
                <Tabs.Trigger
                  key={step.id}
                  value={step.id}
                  className="text-sm font-['Space_Grotesk'] text-[#a1a1aa] data-[state=active]:bg-[#4628f1] data-[state=active]:text-white"
                >
                  {step.label}
                </Tabs.Trigger>
              ))}
            </Tabs.List>

            {STEPS.map((step) => (
              <Tabs.Content key={step.id} value={step.id} className="mt-6">
                <div className="space-y-6">
                  {/* Step Content */}
                  {step.id === "visual" && <Step1VisualPreset />}
                  {step.id === "stack" && <Step2ProjectStack />}
                  {step.id === "generate" && <Step3Generate />}

                  {/* Live Preview - shown below controls on mobile */}
                  <div className="bg-[#171717]/80 backdrop-blur-xl border border-[#333333] rounded-2xl p-6 shadow-lg">
                    <h2 className="text-xl font-bold mb-4 font-['Space_Grotesk'] text-[#ededed]">Live Preview</h2>
                    <LivePreviewPanel />
                  </div>

                  {/* Navigation Buttons */}
                  <div className="flex justify-between gap-3">
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => {
                        const stepIndex = STEPS.findIndex((s) => s.id === step.id);
                        if (stepIndex > 0) {
                          const prevStep = STEPS[stepIndex - 1];
                          if (prevStep) setCurrentStep(prevStep.id);
                        }
                      }}
                      disabled={step.id === "visual"}
                      className="flex-1 bg-[#171717] border-[#333333] text-[#ededed] hover:bg-[#1f1f1f]"
                    >
                      Back
                    </Button>

                    <Button
                      size="lg"
                      onClick={() => {
                        const stepIndex = STEPS.findIndex((s) => s.id === step.id);
                        if (stepIndex < STEPS.length - 1) {
                          const nextStep = STEPS[stepIndex + 1];
                          if (nextStep) setCurrentStep(nextStep.id);
                        }
                      }}
                      disabled={step.id === "generate"}
                      className="flex-1 bg-[#4628f1] hover:bg-[#3720d1] text-white font-semibold"
                    >
                      {step.id === "generate" ? "Finish" : "Next"}
                    </Button>
                  </div>
                </div>
              </Tabs.Content>
            ))}
          </Tabs>
        </div>
      </div>
    </div>
  );
}
