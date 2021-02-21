import React from 'react';
import Button from '@material-ui/core/Button';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import indigo from '@material-ui/core/colors/indigo';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import InputAdornment from '@material-ui/core/InputAdornment';
import { API } from 'aws-amplify';
// import { calculateSavings, months, saved, invested, diff } from "./calculate_savings/calculate_savings"
import { withStyles, Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TablePagination from '@material-ui/core/TablePagination';

const StyledTableCell = withStyles((theme: Theme) =>
  createStyles({
    head: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    body: {
      fontSize: 14,
    },
  }),
)(TableCell);

const StyledTableRow = withStyles((theme: Theme) =>
  createStyles({
    root: {
      '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
      },
    },
  }),
)(TableRow);

const personal_theme = createMuiTheme({
  palette: {
    type: "dark",
    primary: indigo,
    secondary: {
      main: '#b9f6ca',
    },
  },
});

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      padding: theme.spacing(4, 5, 6),
    },
    marginAutoContainer: {
      backgroundColor: theme.palette.background.paper,
      padding: theme.spacing(8, 0, 6),
    },
    form: {
      '& > *': {
        margin: theme.spacing(1),
        width: '25ch',
      },
    },
    grid: {
      marginBottom: theme.spacing(4),
      justify: "center",
      textAlign: "center",
    },
    paper: {
      padding: theme.spacing(2),
    },
    highlight: {
      color: "#ff9100",
      fontSize: 20
    },
  }),
);
type TableData = {
  monthsArr: number[],
  savedArr: number[]
}
function InspectionEntries({ monthsArr, savedArr }: TableData) {
  return (
    <div>
      < TableContainer component={Paper} >
        <Table aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell align="center">Months</StyledTableCell>
              <StyledTableCell align="center">Saved Money</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {monthsArr.map((month: number) => (
              <StyledTableRow>
                <StyledTableCell align="center" component="th" scope="row">
                  {month}
                </StyledTableCell>
                <StyledTableCell align="center">{savedArr[month - 1] ? savedArr[month - 1].toFixed(2) : null} €</StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer >
    </div>
  );
}

function App() {
  const classes = useStyles();

  async function calculateSavings(initialInvest: number, mensalInvest: number, percentage: number, years: number) {
    const apiName = 'InvestCalculatorAPI';
    const path = '/calculatesavings';
    const myInit = {
      body: {
        "initial_invest": initialInvest,
        "mensal_invest": mensalInvest,
        "annual_percentage": percentage,
        "years": years
      },
    };

    const response = await API.post(apiName, path, myInit);
    // alert(JSON.stringify(response));
    setMonths(response.Months);
    setSaved(response.Saved.toFixed(2));
    setInvested(response.InvestedMoney.toFixed(2));
    setDiff(response.Diff.toFixed(2));
    setMonthsArr(response.MonthsArr);
    setSavedArr(response.SavedArr);
  }
  // Output
  const [months, setMonths] = React.useState(0);
  const [saved, setSaved] = React.useState(0);
  const [monthsArr, setMonthsArr] = React.useState([]);
  const [savedArr, setSavedArr] = React.useState([]);
  const [invested, setInvested] = React.useState(0);
  const [diff, setDiff] = React.useState(0);
  // Input
  const [initInvest, setInitInvest] = React.useState(0);
  const [mensalInvest, setMensalInvest] = React.useState(0);
  const [years, setYears] = React.useState(0);
  const [percentage, setPercentage] = React.useState(0);
  const onInitialInvestChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInitInvest(parseInt(e.target.value));
  };
  const onMensalInvestChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMensalInvest(parseInt(e.target.value));
  };
  const onPercentageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPercentage(parseInt(e.target.value));
  };
  const onYearsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setYears(parseInt(e.target.value));
  };

  return (
    <ThemeProvider theme={personal_theme}>
      <CssBaseline />
      <React.Fragment>
        <main>
          <div className={classes.root}>
            <Grid className={classes.grid}>
              <form className={classes.form} noValidate autoComplete="off">
                <TextField
                  value={initInvest}
                  error={isNaN(initInvest)}
                  id="outlined-basic"
                  type="number"
                  label="Initial Investment"
                  variant="outlined"
                  helperText={isNaN(initInvest) == true ?
                    "Error" : "Desired Initial Investment"}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">€</InputAdornment>,
                  }}
                  onChange={onInitialInvestChange} />
                <TextField
                  id="outlined-basic"
                  value={mensalInvest}
                  error={isNaN(mensalInvest)}
                  type="number"
                  label="Mensal Investment"
                  variant="outlined"
                  helperText={isNaN(initInvest) == true ?
                    "Error" : "Expected Mensal Investment"}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">€</InputAdornment>,
                  }}
                  onChange={onMensalInvestChange} />
                <TextField
                  id="outlined-basic"
                  value={years}
                  error={isNaN(years)}
                  type="number"
                  label="Years"
                  variant="outlined"
                  helperText={isNaN(initInvest) == true ?
                    "Error" : "Number of years of investment"}
                  onChange={onYearsChange} />
                <TextField
                  id="outlined-basic"
                  value={percentage}
                  error={isNaN(percentage)}
                  type="number"
                  label="Annual Percentage"
                  variant="outlined"
                  helperText={isNaN(initInvest) == true ?
                    "Error" : "Average annual profit rate"}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">%</InputAdornment>,
                  }}
                  onChange={onPercentageChange} />
              </form>
            </Grid>
            <Grid className={classes.grid}>
              <Button variant="contained" color="primary" onClick={() => calculateSavings(initInvest, mensalInvest, percentage, years)}>
                Calculate
              </Button>
            </Grid>
            <Grid xs={12} className={classes.grid}>
              <Paper className={classes.paper}>
                <Typography>
                  Total of saved money in <span className={classes.highlight}> {months}</span> months: <span className={classes.highlight}> {saved} €</span>
                </Typography>
                <Typography>
                  Total of invested money:
                  <span className={classes.highlight}> {invested} €</span>
                </Typography>
                <Typography>
                  Difference: <span className={classes.highlight}> {diff} €</span>
                </Typography>
                <InspectionEntries monthsArr={monthsArr} savedArr={savedArr} />
              </Paper>
            </Grid>
          </div>
        </main>
      </React.Fragment >
    </ThemeProvider>
  );
}
export default App;
