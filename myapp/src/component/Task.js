import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';

import AddIcon from '@mui/icons-material/Add';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

import CancelIcon from '@mui/icons-material/Cancel';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import { Button } from '@mui/material';
import {
    GridActionsCellItem,
    GridRowEditStopReasons,
    GridRowModes,
    GridToolbarContainer
} from '@mui/x-data-grid';
import {
    randomId
} from '@mui/x-data-grid-generator';

function EditToolbar(props) {
    const { setRows, setRowModesModel } = props;

    const handleAddClick = () => {
        const id = randomId();
        setRows((oldRows) => [...oldRows, { id, description: '', isNew: true }]);
        setRowModesModel((oldModel) => ({
            ...oldModel,
            [id]: { mode: GridRowModes.Edit, fieldToFocus: 'description' },
        }));
    };
    return (
        <GridToolbarContainer>
            <Button color="primary" variant='contained' startIcon={<AddIcon />} onClick={handleAddClick}>
                Add
            </Button>

        </GridToolbarContainer>
    );
}

const Snack = ({ severity, message, open, onClose }) => {
    return (
        <Snackbar open={open} autoHideDuration={2000} onClose={onClose}>
            <Alert
                onClose={onClose}
                severity={severity}
                variant="filled"
                sx={{ width: '100%' }}
            >
                {message}
            </Alert>
        </Snackbar>
    );
}
function Task() {
    const [rows, setRows] = useState([]);
    const [rowModesModel, setRowModesModel] = useState({});


    // snackbar
    const [open, setOpen] = useState(false);

    const [message, setMessage] = useState("");
    const [severity, setSeverity] = useState("");
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };


    useEffect(() => {
        fetch("http://localhost:8000/tasks", {
            method: "GET",

        }).then(data => data.json()).then(data => setRows(data))
    }, [])
    const handleRowEditStop = (params, event) => {
        if (params.reason === GridRowEditStopReasons.rowFocusOut) {
            event.defaultMuiPrevented = true;
        }
        console.log(params)
    };

    const handleEditClick = (id) => () => {
        console.log(rows.filter((row) => row.id !== id))
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
    };

    const handleSaveClick = (id) => () => {
        console.log(rows.filter((row) => row.id !== id))
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
    };

    const handleDeleteClick = (id) => () => {
        console.log(rows.filter((row) => row.id == id))
        fetch(`http://localhost:8000/tasks/${id}`, {
            method: "DELETE",

        })
            .then(res => res.status)
            .then(status => {
                console.log(status);
                setMessage(`Data deleted ${status}`)
                setSeverity("warning")
                setOpen(true);
            })
        setRows(rows.filter((row) => row.id !== id));
    };

    const handleCancelClick = (id) => () => {
        setRowModesModel({
            ...rowModesModel,
            [id]: { mode: GridRowModes.View, ignoreModifications: true },
        });

        const editedRow = rows.find((row) => row.id === id);
        if (editedRow.isNew) {
            setRows(rows.filter((row) => row.id !== id));
        }
    };


    const apiUpdate = (rowData) => {
        console.log(rowData)
        fetch('http://localhost:8000/tasks', {
            method: 'PUT',
            headers: {
                Accept: '*/*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(rowData)
        })
            .then(res => res.status)
            .then(status => {
                console.log(status);
                setMessage(`Data added ${status}`)
                setSeverity("success")
                setOpen(true);
            })
            .catch(err => console.error('error:' + err));
    }

    const processRowUpdate = (newRow) => {
        console.log(newRow)
        if (newRow.isNew) {
            apiUpdate({ description: newRow.description })

        } else {
            apiUpdate(newRow)

        }
        const updatedRow = { ...newRow, isNew: false };
        setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
        return updatedRow;
    };

    const handleRowModesModelChange = (newRowModesModel) => {
        setRowModesModel(newRowModesModel);
    };

    const columns = [
        { field: 'id', headerName: 'ID', flex: 1 },
        { field: 'id', headerName: 'ID', flex: 1 },
        {
            field: 'description',
            headerName: 'Description',
            editable: true,
            flex: 15
        },
        {
            field: 'status',
            headerName: 'Status',
            type: "singleSelect",
            valueOptions: ['Not Yet Started', 'In Progress', 'Completed', 'Blocked'],
            editable: true,
            flex: 4
        },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            flex: 3,
            cellClassName: 'actions',
            getActions: ({ id }) => {
                const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

                if (isInEditMode) {
                    return [
                        <GridActionsCellItem
                            icon={<SaveIcon />}
                            label="Save"
                            sx={{
                                color: 'primary.main',
                            }}
                            onClick={handleSaveClick(id)}
                        />,
                        <GridActionsCellItem
                            icon={<CancelIcon />}
                            label="Cancel"
                            className="textPrimary"
                            onClick={handleCancelClick(id)}
                            color="inherit"
                        />,
                    ];
                }

                return [
                    <GridActionsCellItem
                        icon={<EditIcon />}
                        label="Edit"
                        className="textPrimary"
                        onClick={handleEditClick(id)}
                        color="inherit"
                    />,
                    <GridActionsCellItem
                        icon={<DeleteIcon />}
                        label="Delete"
                        onClick={handleDeleteClick(id)}
                        color="inherit"
                    />,
                ];
            },
        }
    ];

    return (
        <Box
            sx={{
                height: 500,
                width: '100%',
                '& .actions': {
                    color: 'text.secondary',
                },
                '& .textPrimary': {
                    color: 'text.primary',
                },

                display: "flex",
                justifyContent: "center", // Center horizontally
                alignItems: "center",
                minHeight: "100vh"
            }}
        >
            <DataGrid

                rows={rows}
                columns={columns}
                editMode="row"
                processRowUpdate={processRowUpdate}
                experimentalFeatures={{ newEditingApi: true }}
                rowModesModel={rowModesModel}
                onRowModesModelChange={handleRowModesModelChange}
                onRowEditStop={handleRowEditStop}
                slots={{
                    toolbar: EditToolbar,
                }}
                slotProps={{
                    toolbar: { setRows, setRowModesModel },
                }}
            />
            <Snack message={message} severity={severity} open={open} onClose={handleClose}></Snack>

        </Box>

    );
}
export default Task;