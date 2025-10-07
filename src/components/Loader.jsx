import { Box, CircularProgress } from "@mui/material";

const Loader = () => {
  return (
    <Box
      sx={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1300, // above everything
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center", // centers horizontally
          justifyContent: "center", // centers vertically if parent has height
        }}
      >
        {/* <CircularProgress size={64} sx={{ color: "white" }} /> */}
        <Box
          sx={{
            position: "relative",
            display: "inline-flex", // keep both stacked inline
          }}
        >
          <CircularProgress size={80} sx={{ color: "white" }} thickness={1} />

          {/* Image inside the circle */}
          <Box
            component="img"
            src="../../assets/tawakal_logo.jpeg" // your image path
            alt="Loading"
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 70, // adjust size to fit inside
              height: 70,
              borderRadius: "50%", // makes it circular
            }}
          />
        </Box>
        <br />
        <Box
          sx={{
            fontSize: "1.2rem",
            fontWeight: 500,
            color: "white",
            fontWeight: "bold",
          }}
        >
          Please wait...
        </Box>
      </Box>
    </Box>
  );
};

export default Loader;
