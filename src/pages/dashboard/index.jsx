import {
  Box,
  Button,
  Card,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  useTheme,
} from "@mui/material";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import StatBox from "../../components/StatBox";
import {
  BuildCircle,
  CalendarMonth,
  Category,
  CheckCircle,
  Circle,
  Done,
  HourglassTop,
  Lens,
  Person,
  PriorityHigh,
  SignalWifiStatusbar4Bar,
  Task,
  Timeline,
  Title,
  TrackChanges,
} from "@mui/icons-material";
import { useEffect, useState } from "react";
import { INIT_KEY } from "../../auth/AuthContext";
import { capitalizeFirstLetter } from "../../utils/stringUtils";

const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [users, setUsers] = useState([]);

  const [page, setPage] = useState(0); // Current page index
  const [rowsPerPage, setRowsPerPage] = useState(9); // Number of rows per page

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handle change in rows per page
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset the table to the first page whenever rows per page changes
  };

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
              subtitle="Completed Tickets"
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
              subtitle="In Review Tickets"
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
              subtitle="In Progress Tickets"
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
        {/* RECENT TICKETS */}
        <Box flex="7.2">
          <Typography
            variant="h4"
            color={colors.grey[100]}
            fontWeight="bold"
            sx={{ m: "0 0 5px 0" }}
          >
            Recent Tickets
          </Typography>
          <Box
            display="flex"
            justifyContent="center"
            border="ActiveBorder"
            mt="10px"
          >
            <Card
              sx={{
                width: "100%",
                border: "1px solid #e0ddddff",
                borderRadius: "15px",
              }}
            >
              <TableContainer>
                <Table aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell
                        sx={{
                          fontWeight: "bold",
                          fontSize: "16px",
                          width: "12%",
                        }}
                        scope="col"
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: "5px",
                          }}
                        >
                          <Task sx={{ color: colors.greenAccent[400] }} />
                          Ticket No
                        </Box>
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: "bold",
                          fontSize: "16px",
                          width: "22%",
                        }}
                        scope="col"
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: "5px",
                          }}
                        >
                          <Title sx={{ color: colors.greenAccent[400] }} />
                          Ticket Name
                        </Box>
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: "bold",
                          fontSize: "16px",
                          width: "11%",
                        }}
                        scope="col"
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: "5px",
                          }}
                        >
                          <TrackChanges
                            sx={{ color: colors.greenAccent[400] }}
                          />
                          Status
                        </Box>
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: "bold",
                          fontSize: "16px",
                          width: "11%",
                        }}
                        scope="col"
                      >
                        {" "}
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: "5px",
                          }}
                        >
                          <PriorityHigh
                            sx={{ color: colors.greenAccent[400] }}
                          />
                          Priority
                        </Box>
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: "bold",
                          fontSize: "16px",
                          width: "12%",
                        }}
                        scope="col"
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: "5px",
                          }}
                        >
                          <BuildCircle
                            sx={{ color: colors.greenAccent[400] }}
                          />
                          Type
                        </Box>
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: "bold",
                          fontSize: "16px",
                          width: "16%",
                        }}
                        scope="col"
                      >
                               <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: "5px",
                          }}
                        >
                          <CalendarMonth
                            sx={{ color: colors.greenAccent[400] }}
                          />
                        Start Date
                        </Box>
                      </TableCell>
                      <TableCell
                        scope="col"
                        align="center"
                        sx={{
                          fontWeight: "bold",
                          fontSize: "16px",
                          width: "16%",
                        }}
                      >
                               <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: "5px",
                          }}
                        >
                          <CalendarMonth
                            sx={{ color: colors.greenAccent[400] }}
                          />
                        Due Date
                        </Box>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {users
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((user, index) => (
                        <TableRow key={index}>
                          <TableCell sx={{ width: "12%" }}>
                            <Typography
                              sx={{
                                fontSize: "15px",
                                color: colors.blueAccent[400],
                                fontWeight: "600",
                                cursor: "pointer",
                                textDecoration: "underline",
                              }}
                            >
                              TKT-000001
                            </Typography>
                          </TableCell>
                          <TableCell sx={{ fontSize: "15px", width: "22%" }}>
                            Reset Customer Account
                          </TableCell>
                          <TableCell sx={{ fontSize: "15px", width: "11%" }}>
                            Pending
                          </TableCell>
                          <TableCell sx={{ fontSize: "15px", width: "11%" }}>
                            Critical
                          </TableCell>
                          <TableCell sx={{ fontSize: "15px", width: "12%" }}>
                            Maintenance
                          </TableCell>
                          <TableCell sx={{ fontSize: "15px", width: "16%" }}>
                            2025-10-07 10:00 AM
                          </TableCell>
                          <TableCell sx={{ fontSize: "15px", width: "16%" }}>
                            2025-10-08 05:00 PM
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Card>
          </Box>
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
            <Box
              p="0px 15px"
              borderRadius="8px"
              overflow="auto"
              sx={{ maxHeight: "calc(100vh - 400px)", overflowY: "auto" }}
            >
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
