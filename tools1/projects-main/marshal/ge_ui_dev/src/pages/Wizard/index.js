import * as React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Datasource from "./datasource.js";
import DataProfile from "./profile.js";
import CriticalElements from "./criticalElements.js";
import ExpectationSuit from "./expectations.js";
import Validations from "./validations.js";

function getSteps() {
  return [
    "Connect Datasource",
    "Basic Profiling",
    "Identify Critical Element",
    "Apply Rules",
    "Validations",
  ];
}

function getStepContent(step) {
  switch (step) {
    case 0:
      return (
        <div className="border p-2 m-3">
          <Datasource />
        </div>
      );
    case 1:
      return (
        <div className="border p-3 m-3">
          <DataProfile />
        </div>
      );
    case 2:
      return (
        <div className="border p-3 m-3">
          <CriticalElements />
        </div>
      );
    case 3:
      return (
        <div className="border p-2 m-3">
          <ExpectationSuit />
        </div>
      );
    case 4:
      return (
        <div className="border p-3 m-3">
          <Validations />
        </div>
      );
    default:
      return "Unknown step";
  }
}

export default function HorizontalLinearStepper() {
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set());
  const steps = getSteps();

  const isStepOptional = (step) => {
    return step === 0;
  };

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  // const handleSkip = () => {
  //   if (!isStepOptional(activeStep)) {
  //     throw new Error("You can't skip a step that isn't optional.")
  //   }

  //   setActiveStep((prevActiveStep) => prevActiveStep + 1)
  //   setSkipped((prevSkipped) => {
  //     const newSkipped = new Set(prevSkipped.values())
  //     newSkipped.add(activeStep)
  //     return newSkipped
  //   })
  // }

  // const handleReset = () => {
  //   setActiveStep(0)
  // }

  return (
    <Box style={{ width: "100%", backgroundColor: "white", padding: 2 }}>
      <div className="border m-2">
        <h4 className="border p-1 mb-3" align="center">
          <b>DATASOURCE ONBOARDING & PROFILING</b>
        </h4>

        <Stepper activeStep={activeStep}>
          {steps.map((label, index) => {
            const stepProps = {};
            const labelProps = {};
            if (isStepOptional(index)) {
              labelProps.optional = (
                <Typography variant="caption"> </Typography>
              );
            }
            if (isStepSkipped(index)) {
              stepProps.completed = false;
            }
            return (
              <Step key={label} {...stepProps}>
                <StepLabel {...labelProps} style={{ fontWeight: 600 }}>
                  {label}
                </StepLabel>
              </Step>
            );
          })}
        </Stepper>
        {activeStep === steps.length ? (
          <React.Fragment>
            {/* <div className="border p-3 m-2">
              <Typography sx={{ mt: 2, mb: 1 }}>
                All steps completed - you&apos;re finished
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                <Box sx={{ flex: '1 1 auto' }} />
                <Button
                  onClick={handleReset}
                  sx={{
                    mr: 1,
                    backgroundColor: '#ff6358',
                    border: 0,
                    color: 'white',
                  }}
                >
                  Reset
                </Button>
              </Box>
            </div> */}
          </React.Fragment>
        ) : (
          <React.Fragment>
            <Typography sx={{ mt: 2, mb: 1 }}>
              {getStepContent(activeStep)}
            </Typography>
            <Box
              className="pb-2"
              style={{ display: "none", flexDirection: "row", pt: 2, pl: 2 }}
            >
              <Button
                className="btn btn-danger"
                disabled={activeStep === 0}
                id="back"
                onClick={handleBack}
                style={{
                  backgroundColor: "#ff4500",
                  border: 0,
                  color: "white",
                }}
              >
                Back
              </Button>
              <Box style={{ flex: "1 1 auto" }} />
              {/* {isStepOptional(activeStep) && (
                <Button
                  onClick={handleSkip}
                  sx={{
                    mr: 1,
                    backgroundColor: '#ff6358',
                    border: 0,
                    color: 'white',
                  }}
                >
                  Skip
                </Button>
              )} */}
              <Button
                onClick={handleNext}
                id="next"
                style={{
                  marginRight: 14,
                  backgroundColor: "#ff4500",
                  border: 0,
                  color: "white",
                }}
              >
                {activeStep === steps.length - 1 ? "Submit" : "Next"}
              </Button>
            </Box>
          </React.Fragment>
        )}
      </div>
    </Box>
  );
}
