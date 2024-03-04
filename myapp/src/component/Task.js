import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';


import AddIcon from '@mui/icons-material/Add';



import { Button } from '@mui/material';
import {
    GridRowEditStopReasons,
    GridRowModes,
    GridToolbarContainer
} from '@mui/x-data-grid';

import {
    randomId
} from '@mui/x-data-grid-generator';



function EditToolbar(props) {
    const { setRows, setRowModesModel } = props;

    const handleClick = () => {
        const id = randomId();
        setRows((oldRows) => [...oldRows, { id, description: '', isNew: true }]);
        setRowModesModel((oldModel) => ({
            ...oldModel,
            [id]: { mode: GridRowModes.Edit, fieldToFocus: 'description' },
        }));
    };

    return (
        <GridToolbarContainer>
            <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
                Add record
            </Button>
        </GridToolbarContainer>
    );
}

function Task() {
    const [rows, setRows] = useState([]);
    const [rowModesModel, setRowModesModel] = useState({});
    useEffect(() => {
        fetch("http://localhost:8000/tasks", {
            method: "GET",

        }).then(data => data.json()).then(data => setRows(data))
    }, [])
    const handleRowEditStop = (params, event) => {
        if (params.reason === GridRowEditStopReasons.rowFocusOut) {
            event.defaultMuiPrevented = true;
        }
    };

    const handleEditClick = (id) => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
    };

    const handleSaveClick = (id) => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
    };

    const handleDeleteClick = (id) => () => {
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

    const processRowUpdate = (newRow) => {
        console.log(newRow)

        fetch('http://localhost:8000/tasks', {
            method: 'PUT',
            headers: {
                Accept: '*/*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({description:newRow.description})
        })
            .then(res => res.json())
            .then(json => console.log(json))
            .catch(err => console.error('error:' + err));





        const updatedRow = { ...newRow, isNew: false };
        setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
        return updatedRow;
    };

    const handleRowModesModelChange = (newRowModesModel) => {
        setRowModesModel(newRowModesModel);
    };

    const columns = [
        { field: 'id', headerName: 'ID', width: 90 },
        {
            field: 'description',
            headerName: 'Description',
            width: 150,
            editable: true,
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
        </Box>
    );
}
export default Task;