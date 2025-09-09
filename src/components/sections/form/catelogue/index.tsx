import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const catelogues = [
  {
    value: 'category',
    label: 'category',
  },
  {
    value: 'measure',
    label: 'measure',
  },
  {
    value: 'unit',
    label: 'unit',
  },
];

const CreateCatelogueForm = () => {
  return (
    <Paper sx={{ height: 396 }}>
      <Typography mb={3} variant="h5">
        Create Catelogue
      </Typography>

      <Stack mb={3} spacing={2} justifyContent="flex-start" alignItems="center">
          <TextField
            required
            id="outlined-required"
            label="Name"
            defaultValue="Coffee"
          />
          <TextField
            required
            id="outlined-required"
            label="Description"
            defaultValue="0"
          />
          <TextField
            id="outlined-select-currency-native"
            select
            size="medium"
            label="Category"
            defaultValue="Coffee"
            SelectProps={{
              native: true,
            }}
          >
            {catelogues.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </TextField>
      </Stack>
      <Stack mb={3} spacing={2} justifyContent="flex-start" alignItems="center">
        <Button
          component="label"
          role={undefined}
          variant="contained"
          tabIndex={-1}
          startIcon={<CloudUploadIcon />}
        >
          Upload file
          <VisuallyHiddenInput type="file" />
        </Button>
      </Stack>
      <Stack justifyContent="flex-end">
        <Button
          variant="contained"
          size="medium"
        >
          Create
        </Button>
      </Stack>
    </Paper>
  );
}

export default CreateCatelogueForm;