import React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import EditorMargin from "../EditorMargin/EditorMargin";

export default function EditorFooter() {

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="fixed" sx={{ top: 'auto', bottom: 0, backgroundColor: "#edf2fa" }}>
                <Toolbar variant="dense" sx={{ height: "30px", minHeight: "30px" }}>
                    <Box sx={{ flexGrow: 1 }} />
                    <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                        <EditorMargin />
                    </Box>
                </Toolbar>
            </AppBar>
        </Box>
    );
}
