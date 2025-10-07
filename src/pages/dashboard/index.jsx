import {
  Box,
  Button,
  IconButton,
  Paper,
  Typography,
  useTheme,
} from "@mui/material";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import StatBox from "../../components/StatBox";
import {
  CheckCircle,
  Done,
  HourglassTop,
  Person,
  Task,
} from "@mui/icons-material";
import { useEffect, useState } from "react";
import { INIT_KEY } from "../../auth/AuthContext";
import { capitalizeFirstLetter } from "../../utils/stringUtils";

const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    try {
      const cachedInit = localStorage.getItem(INIT_KEY);
      if (cachedInit) {
        const init = JSON.parse(cachedInit);
        setUsers(init.mData.users || []);
      } else {
        // optional fallback if needed (e.g. token expired)
        console.log("No init data, please log in again");
      }
    } catch (e) {
      console.log(e);
    }

    // do just one refetch, then clear the flag
    // refetch();
    // navigate(".", { replace: true, state: {} });
  }, []);

  return (
    <Box m="0px 20px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="Dashboard" />
        {/* <Box>
          <Button
            sx={{
              backgroundColor: colors.blueAccent[700],
              color: colors.grey[100],
              fontSize: "14px",
              fontWeight: "bold",
              padding: "10px 20px",
            }}
          >
            <DownloadOutlinedIcon sx={{ mr: "10px" }} />
            Download Reports
          </Button>
        </Box> */}
      </Box>

      {/* GRID & CHARTS */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="140px"
        gap="20px"
      >
        {/* ROW 1 */}
        <Box gridColumn="span 3">
          <Paper elevation={4} sx={{ width: "100%", p: 2, borderRadius: 2 }}>
            <StatBox
              title="12,361"
              subtitle="Tasks Completed"
              icon={
                <CheckCircle
                  sx={{ color: colors.greenAccent[400], fontSize: "26px" }}
                />
              }
            />
          </Paper>
        </Box>
        <Box gridColumn="span 3">
          <Paper elevation={4} sx={{ width: "100%", p: 2, borderRadius: 2 }}>
            <StatBox
              title="431,225"
              subtitle="Pending Tasks"
              icon={
                <HourglassTop
                  sx={{ color: colors.greenAccent[400], fontSize: "26px" }}
                />
              }
            />
          </Paper>
        </Box>
        <Box gridColumn="span 3">
          <Paper elevation={4} sx={{ width: "100%", p: 2, borderRadius: 2 }}>
            <StatBox
              title="32,441"
              subtitle="All Tasks"
              progress="0.30"
              increase="+5%"
              icon={
                <Task
                  sx={{ color: colors.greenAccent[400], fontSize: "26px" }}
                />
              }
            />
          </Paper>
        </Box>
        <Box gridColumn="span 3">
          <Paper elevation={4} sx={{ width: "100%", p: 2, borderRadius: 2 }}>
            <StatBox
              title={users.length}
              subtitle="Users"
              progress="0.80"
              increase="+43%"
              icon={
                <Person
                  sx={{ color: colors.greenAccent[400], fontSize: "26px" }}
                />
              }
            />
          </Paper>
        </Box>
      </Box>

      {/* ROW 2 */}
      <Box mt="40px" display="flex" justifyContent="space-between">
        {/* NEW TICKETS */}
        <Box
          // backgroundColor="yellow"
          flex="7.2"
        >
          <Typography
            variant="h4"
            color={colors.grey[100]}
            fontWeight="bold"
            sx={{ m: "0 0 5px 0" }}
          >
            Recent Tickets
          </Typography>
        </Box>
        {/* LATEST USERS */}
        <Box flex="2.8" pl="35px">
          {" "}
          <Typography
            variant="h4"
            color={colors.grey[100]}
            fontWeight="bold"
            sx={{ marginLeft: "15px", marginBottom: "10px" }}
          >
            Recent Users
          </Typography>
          <Paper elevation={4} sx={{ p: 2, borderRadius: 2 }}>
            <Box p="0px 15px" borderRadius="8px" overflow="auto"  sx={{ maxHeight:"calc(100vh - 400px)",  overflowY: "auto" }}>
              {users.slice(0, 8).map((user, i) => (
                <Box
                  key={i}
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  p="10px 0px"
                  borderBottom="1px solid #5c5a5a4f"
                >
                  <Box display="flex" alignItems="center">
                    {/* PERSON ICON */}
                    <Box
                      mr="10px"
                      display="inline-flex"
                      justifyContent="center"
                      sx={{
                        width: 46,
                        height: 46,
                        minWidth: 46,
                        borderRadius: "50%",
                        // display: "grid",
                        placeItems: "center",
                        bgcolor: (t) =>
                          t.palette.mode === "dark"
                            ? "rgba(99,102,241,0.2)"
                            : "rgba(99,102,241,0.1)",
                      }}
                    >
                      <Person fontSize="medium" />
                    </Box>
                    {/* NAME AND THE TITLE */}
                    <Box>
                      <Typography
                        variant="h5"
                        fontWeight="600"
                        color={colors.blueAccent[500]}
                      >
                        {user.firstName} {user.middleName} {user.lastName}
                      </Typography>
                      <Typography color={colors.grey[100]}>
                        {user.title}
                      </Typography>
                    </Box>
                  </Box>

                  {/* ROLE */}
                  <Box
                    sx={{
                      height: "25px",
                      backgroundColor:
                        user.role === "ADMIN"
                          ? colors.greenAccent[400]
                          : user.role === "MANAGER"
                          ? colors.greenAccent[600]
                          : user.role === "USER"
                          ? "#e9b10a"
                          : colors.blueAccent[400],
                      borderRadius: "10px",
                    }}
                    // backgroundColor={colors.greenAccent[500]}
                    p="0px 14px"
                    borderRadius="4px"
                    display={"flex"}
                    alignItems="center"
                  >
                    <Typography sx={{ color: "white", fontWeight: "600" }}>
                      {capitalizeFirstLetter(user.role)}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
