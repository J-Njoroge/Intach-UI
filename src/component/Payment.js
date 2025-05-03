import { useContext, useState } from "react";
import {
  Button,
  Grid,
  Typography,
  Paper,
  makeStyles,
  TextField,
  Divider,
  Avatar,
  Card,
  CardContent,
  IconButton,
  Collapse,
} from "@material-ui/core";
import {
  Payment as PaymentIcon,
  Phone as PhoneIcon,
  ExpandMore as ExpandMoreIcon,
  Info as InfoIcon,
} from "@material-ui/icons";
import { SetPopupContext } from "../App";
import apiList from "../lib/apiList";
import axios from "axios";

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: "5vh",
    minWidth: "5vw",
    padding: theme.spacing(4),
    backgroundColor: "#f5f7fa",
  },
  paymentCard: {
    maxWidth: 500,
    padding: theme.spacing(3),
    borderRadius: 12,
    boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
    background: "linear-gradient(135deg, #ffffff 0%, #f9f9f9 100%)",
  },
  premiumBadge: {
    backgroundColor: "#ffd700",
    color: "#000",
    fontWeight: "bold",
    padding: theme.spacing(0.5, 2),
    borderRadius: 20,
    marginLeft: theme.spacing(1),
    fontSize: 12,
  },
  paymentHeader: {
    marginBottom: theme.spacing(3),
    display: "flex",
    alignItems: "center",
  },
  paymentIcon: {
    backgroundColor: "#4caf50",
    color: "#fff",
    marginRight: theme.spacing(2),
  },
  inputField: {
    marginBottom: theme.spacing(2),
    "& .MuiOutlinedInput-root": {
      borderRadius: 8,
    },
  },
  payButton: {
    padding: theme.spacing(1.5),
    borderRadius: 8,
    fontWeight: "bold",
    fontSize: 16,
    marginTop: theme.spacing(2),
    background: "linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)",
  },
  divider: {
    margin: theme.spacing(2, 0),
  },
  instructionsCard: {
    marginTop: theme.spacing(3),
    backgroundColor: "#f0f4f8",
    borderRadius: 8,
  },
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: "rotate(180deg)",
  },
  premiumNumber: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "#fff8e1",
    padding: theme.spacing(1.5),
    borderRadius: 8,
    marginTop: theme.spacing(1),
  },
  featureBox: {
    padding: theme.spacing(3),
    backgroundColor: "#ffffff",
    borderRadius: 12,
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    marginRight: theme.spacing(4),
    maxWidth: 400,
  },
  featureSectionTitle: {
    fontWeight: "bold",
    marginBottom: theme.spacing(2),
  },
  featureCategory: {
    marginTop: theme.spacing(2),
    fontWeight: "bold",
  },
  featureItem: {
    marginLeft: theme.spacing(2),
    marginBottom: theme.spacing(1),
  },
}));

const Payment = () => {
  const classes = useStyles();
  const setPopup = useContext(SetPopupContext);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [amount, setAmount] = useState(3000);
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);

  const PREMIUM_NUMBER = "234567"; // Your premium number here

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handlePayment = () => {
    setLoading(true);
    if (!phoneNumber || !amount) {
      setPopup({
        open: true,
        severity: "error",
        message: "Please fill all fields",
      });
      setLoading(false);
      return;
    }

    axios
      .post(
        apiList.payment,
        {
          phoneNumber,
          amount,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((response) => {
        setPopup({
          open: true,
          severity: "success",
          message: "Payment initiated successfully! Check your phone to complete",
        });
        localStorage.setItem("paid", true);
        setLoading(false);
      })
      .catch((err) => {
        setPopup({
          open: true,
          severity: "error",
          message: err.response?.data?.message || "Payment failed",
        });
        setLoading(false);
      });
  };

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="flex-start"
      className={classes.root}
      spacing={4}
    >
      {/* Premium Features Section */}
      <Grid item>
        <Paper className={classes.featureBox}>
          <Typography variant="h6" className={classes.featureSectionTitle}>
            What You Get with Premium
          </Typography>

          <Typography variant="subtitle1" className={classes.featureCategory}>
            For Employers
          </Typography>
          <Typography variant="body2" className={classes.featureItem}>
            • Unlimited job posts
          </Typography>
          <Typography variant="body2" className={classes.featureItem}>
            • Candidate recommendations
          </Typography>
          <Typography variant="body2" className={classes.featureItem}>
            • Interviews and Assessments on this platfrom
          </Typography>

          <Typography variant="subtitle1" className={classes.featureCategory}>
            For Students
          </Typography>
          <Typography variant="body2" className={classes.featureItem}>
            • Early job access
          </Typography>
          <Typography variant="body2" className={classes.featureItem}>
            • AI match insights
          </Typography>
          <Typography variant="body2" className={classes.featureItem}>
            • CV review & mock interviews
          </Typography>
          <Typography variant="body2" className={classes.featureItem}>
            • Better-paying internships
          </Typography>
        </Paper>
      </Grid>

      {/* Payment Card Section */}
      <Grid item>
        <Card className={classes.paymentCard}>
          <CardContent>
            <div className={classes.paymentHeader}>
              <Avatar className={classes.paymentIcon}>
                <PaymentIcon />
              </Avatar>
              <Typography variant="h5" component="h2">
                M-Pesa Payment
                <span className={classes.premiumBadge}>PREMIUM</span>
              </Typography>
            </div>

            <Divider className={classes.divider} />

            <TextField
              fullWidth
              label="Your M-Pesa Phone Number"
              variant="outlined"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className={classes.inputField}
              placeholder="e.g. 254712345678"
              InputProps={{
                startAdornment: (
                  <PhoneIcon color="action" style={{ marginRight: 8 }} />
                ),
              }}
            />

            <TextField
              fullWidth
              label="Amount (KSH)"
              variant="outlined"
              type="number"
              value={amount}
              disabled
              onChange={(e) => setAmount(e.target.value)}
              className={classes.inputField}
              InputProps={{
                startAdornment: (
                  <Typography color="textSecondary" style={{ marginRight: 8 }}>
                    KSH
                  </Typography>
                ),
              }}
            />

            <Button
              fullWidth
              variant="contained"
              color="primary"
              size="large"
              className={classes.payButton}
              onClick={handlePayment}
              disabled={loading}
            >
              {loading ? "Processing..." : "Pay with M-Pesa"}
            </Button>

            <Card className={classes.instructionsCard} elevation={0}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "8px 16px",
                  cursor: "pointer",
                }}
                onClick={handleExpandClick}
              >
                <InfoIcon color="primary" style={{ marginRight: 8 }} />
                <Typography variant="subtitle1">Payment Instructions</Typography>
                <IconButton
                  className={`${classes.expand} ${
                    expanded ? classes.expandOpen : ""
                  }`}
                  onClick={handleExpandClick}
                  aria-expanded={expanded}
                  aria-label="show more"
                >
                  <ExpandMoreIcon />
                </IconButton>
              </div>

              <Collapse in={expanded} timeout="auto" unmountOnExit>
                <Divider />
                <div style={{ padding: 16 }}>
                  <Typography variant="body2" paragraph>
                    1. Enter your M-Pesa registered phone number
                  </Typography>
                  <Typography variant="body2" paragraph>
                    2. Enter the amount you wish to pay
                  </Typography>
                  <Typography variant="body2" paragraph>
                    3. Click "Pay with M-Pesa" button
                  </Typography>
                  <Typography variant="body2" paragraph>
                    4. You will receive a payment request on your phone
                  </Typography>
                  <Typography variant="body2" paragraph>
                    5. Enter your M-Pesa PIN to complete the transaction
                  </Typography>
                </div>
              </Collapse>
            </Card>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default Payment;
