import {
  Box,
  Button,
  Card,
  Dialog,
  InputAdornment,
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
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { mockDataTeam } from "../../data/mockData";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import Header from "../../components/Header";
import { Add, Edit, Person, Search } from "@mui/icons-material";
import { TextField } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useUsers } from "../../hooks/useUsers";
import Loader from "../../components/Loader";
import { INIT_KEY } from "../../auth/AuthContext";
import { capitalizeFirstLetter } from "../../utils/stringUtils";

const Users = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const location = useLocation();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);

  const [openLoginDialog, setOpenLoginDialog] = useState(false);

  const handleClickOpenEditDialog = () => {
    setOpenLoginDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenLoginDialog(false);
  };

  useEffect(() => {
    const cachedInit = localStorage.getItem(INIT_KEY);
    if (cachedInit) {
      const init = JSON.parse(cachedInit);
      setUsers(init.mData.users || []);
    } else {
      // optional fallback if needed (e.g. token expired)
      console.log("No init data, please log in again");
    }

    // do just one refetch, then clear the flag
    // refetch();
    // navigate(".", { replace: true, state: {} });
  }, []);

  const [page, setPage] = useState(0); // Current page index
  const [rowsPerPage, setRowsPerPage] = useState(6); // Number of rows per page
  const [searchQuery, setSearchQuery] = useState("");

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handle change in rows per page
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset the table to the first page whenever rows per page changes
  };

  const filteredUsers = users.filter(
    (user) =>
      user.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.middleName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.phoneNumber || "").includes(searchQuery)
  );

  return (
    <Box m="0px 20px">
      <Header title="Team" subtitle="Managing team Members" />
      <Box display="flex" alignItems="center">
        {/* Search team member */}
        <Box flex={1}>
          <TextField
            label="Search user"
            sx={{ width: "500px" }}
            variant="outlined"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <Box flex={1} display="flex" justifyContent="end">
          <Button
            type="submit"
            color="primary"
            variant="contained"
            onClick={() => navigate("/add-user")}
            startIcon={<Add />}
          >
            Add New User
          </Button>
        </Box>
      </Box>

      {/* USERS TABLE */}
      <Box
        display="flex"
        justifyContent="center"
        border="ActiveBorder"
        mt="20px"
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
                      width: "25%",
                    }}
                    scope="col"
                  >
                    Full Name
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      fontSize: "16px",
                      width: "17%",
                    }}
                    scope="col"
                  >
                    {" "}
                    Phone Number{" "}
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      fontSize: "16px",
                      width: "23%",
                    }}
                    scope="col"
                  >
                    Title
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      fontSize: "16px",
                      width: "12%",
                    }}
                    scope="col"
                  >
                    Role
                  </TableCell>
                  <TableCell
                    scope="col"
                    align="center"
                    sx={{
                      fontWeight: "bold",
                      fontSize: "16px",
                      width: "23%",
                    }}
                  >
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredUsers
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((user, index) => (
                    <TableRow key={index}>
                      <TableCell sx={{ width: "25%" }}>
                        <Box display="flex" alignItems="center">
                          <Box
                            mr="10px"
                            display="inline-flex"
                            justifyContent="center"
                            sx={{
                              width: 46,
                              height: 46,
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
                          <Typography variant="body2" fontSize="15px">
                            {user.firstName} {user.middleName} {user.lastName}
                          </Typography>
                        </Box>

                        {/* {member.name} */}
                      </TableCell>
                      <TableCell sx={{ fontSize: "15px", width: "17%" }}>
                        {user.phoneNumber}
                      </TableCell>
                      <TableCell sx={{ fontSize: "15px", width: "23%" }}>
                        {user.title}
                      </TableCell>
                      <TableCell sx={{ fontSize: "15px", width: "12%" }}>
                        <Typography
                          sx={{
                            fontSize: "15px",
                            backgroundColor:
                              user.role === "ADMIN"
                                ? colors.blueAccent[600]
                                : "",
                            color: user.role === "ADMIN" ? "white" : "",
                            borderRadius: "10px",
                            display: "inline",
                            padding: "3px 10px",
                          }}
                        >
                          {capitalizeFirstLetter(user.role)}
                        </Typography>
                      </TableCell>
                      <TableCell align="center" sx={{ width: "23%" }}>
                        <Box
                          display="flex"
                          justifyContent="center"
                          alignItems="center"
                          gap="30px"
                        >
                          <Button
                            sx={{
                              backgroundColor: colors.greenAccent[600],
                              color: colors.grey[100],
                              fontSize: "14px",
                              fontWeight: "bold",
                              padding: "5px 15px",
                            }}
                            startIcon={<Edit />}
                            onClick={() =>
                              navigate("/edit-user", { state: { user } })
                            }
                          >
                            Edit
                          </Button>

                          {/* RESET PASSWORD */}
                          <img
                            alt="profile-user"
                            width="40px"
                            height="40px"
                            src={`../../assets/reset.png`}
                            style={{ cursor: "pointer" }}
                          />
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
            <TablePagination
              sx={{ fontSize: "1.1rem" }}
              component="div"
              count={filteredUsers.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[6, 7]}
              labelRowsPerPage="Rows per page"
            />
          </TableContainer>
        </Card>
      </Box>

      {/* Edit User Dialog */}
      <Dialog open={openLoginDialog} onClose={handleCloseEditDialog} fullWidth>
        <Box p={3}>
          <Typography variant="h6" gutterBottom>
            Edit User
          </Typography>
          {/* Add your form fields here */}
          <Button
            variant="contained"
            color="primary"
            onClick={handleCloseEditDialog}
          >
            Save
          </Button>
        </Box>
      </Dialog>
    </Box>
  );
};

export default Users;
