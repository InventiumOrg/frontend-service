import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";

const measures = [
  {
    value: "pound",
    label: "lbs",
  },
  {
    value: "kg",
    label: "kg",
  },
  {
    value: "gram",
    label: "g",
  },
];

const categories = [
  {
    value: "coffee",
    label: "coffee",
  },
  {
    value: "condensed milk",
    label: "conndensed milk",
  },
  {
    value: "fresh milk",
    label: "fresh milk",
  },
  {
    value: "sugar",
    label: "sugar",
  },
];

const units = [
  {
    value: "box",
    label: "box",
  },
  {
    value: "package",
    label: "package",
  },
  {
    value: "bag",
    label: "bag",
  },
];

const CreateInventoryForm = () => {
  return (
    <Paper sx={{ height: 350}}>
      <Typography mb={3} variant="h5">
        Create Inventory
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
              label="Quantity"
              defaultValue="0"
            />
            <TextField
              required
              id="outlined-required"
              label="Location"
              defaultValue="Warehouse 1"
            />
        </Stack>
        <Stack mb={3} spacing={2} justifyContent="flex-start" alignItems="center">
            <TextField
              id="outlined-select-currency-native"
              select
              size="small"
              label="Category"
              defaultValue="Coffee"
              SelectProps={{
                native: true,
              }}
              helperText="Please select your category"
            >
              {categories.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </TextField>
            <TextField
              id="outlined-select-currency-native"
              select
              size="small"
              label="Measure"
              defaultValue="kg"
              SelectProps={{
                native: true,
              }}
              helperText="Please select your measure"
            >
              {measures.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </TextField>
            <TextField
              id="outlined-select-currency-native"
              select
              size="small"
              label="Unit"
              defaultValue="box"
              SelectProps={{
                native: true,
              }}
              helperText="Please select your unit"
            >
              {units.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </TextField>
        </Stack>
      <Stack justifyContent="flex-end">
        <Button
          variant="contained"
          size="medium"
          type="submit"
        >
          Create
        </Button>
      </Stack>
    </Paper>
  );
}

export default CreateInventoryForm;