import React, {createContext, Dispatch, SetStateAction, useState} from 'react';
import {makeStyles, Theme, createStyles} from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import styled from "styled-components";
import "codemirror/lib/codemirror.css";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: '100%',
        },
        backButton: {
            marginRight: theme.spacing(1),
        },
        instructions: {
            marginTop: theme.spacing(1),
            marginBottom: theme.spacing(1),
        },
    }),
);




export const IndexPage: React.FC = () => {
    const classes = useStyles();
    const [activeStep, setActiveStep] = React.useState(0);

    const transferList: [string, Dispatch<SetStateAction<string>>] = useState('');


    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    return (
        <IndexContext.Provider value={{handleNext, handleBack, transferList}}>
            <div className={classes.root}>
                 tmp
            </div>
        </IndexContext.Provider>

    );
}

export const IndexContext = createContext<{ handleBack: Function, handleNext: Function, transferList: [string, Dispatch<SetStateAction<string>>] }>({
    handleBack: () => {
    },
    handleNext(p0: number) {
    },
    transferList: ['', (ev) => null]
});


const MContainer = styled.div`
  max-width: 700px;
  margin: 50px auto;
`
